import React, { useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Pressable } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { AppContainer, AppText, AppTextInput, AppButton, AppLogo } from '../../components';
import ROUTES from '../../utils/routes';
import { loginSchema } from '../../utils/authValidator';
import { Fonts, lineHeight, s, vs } from '../../theme/sizeMatter';

const SignInScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const linkTextTheme = { color: colors.primary };

    const handleLogin = () => {
        // Clear previous errors
        setErrors({});

        // Validate using Zod
        const validationResult = loginSchema.safeParse({ email, password });

        if (!validationResult.success) {
            // Map Zod errors to our state
            const formattedErrors = {};
            validationResult.error.issues.forEach(issue => {
                formattedErrors[issue.path[0]] = issue.message;
            });
            setErrors(formattedErrors);
            return;
        }

        // Supabase login logic will go here
        console.log('Login pressed:', email);
    };

    return (
        <AppContainer>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.inner}>

                        <AppLogo size={80} containerStyle={styles.logo} />

                        {/* Header */}
                        <View style={styles.header}>
                            <AppText variant="title" style={styles.title}>
                                Welcome back
                            </AppText>
                            <AppText muted style={styles.subtitle}>
                                Log in to continue tracking your mindful spending.
                            </AppText>
                        </View>

                        {/* Form */}
                        <View style={styles.form}>
                            <AppTextInput
                                label="Email"
                                placeholder="Enter your email"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={(text) => {
                                    setEmail(text);
                                    if (errors.email) setErrors({ ...errors, email: null });
                                }}
                                error={errors.email}
                            />
                            <AppTextInput
                                label="Password"
                                placeholder="Enter your password"
                                secureTextEntry
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text);
                                    if (errors.password) setErrors({ ...errors, password: null });
                                }}
                                error={errors.password}
                            />
                            <Pressable
                                onPress={() => navigation.navigate(ROUTES.FORGOT_PASSWORD)}
                                style={styles.forgotPasswordContainer}
                            >
                                <AppText style={[styles.forgotPasswordText, linkTextTheme]}>
                                    Forgot password?
                                </AppText>
                            </Pressable>
                        </View>

                        {/* Actions */}
                        <View style={styles.actions}>
                            <AppButton
                                onPress={handleLogin}
                                disabled={!email || !password}
                            >
                                Log in
                            </AppButton>
                            <Pressable
                                onPress={() => navigation.navigate(ROUTES.SIGN_UP)}
                                style={styles.footerLinkContainer}
                            >
                                <AppText muted>
                                    Don't have an account? <AppText style={[styles.footerLinkText, linkTextTheme]}>Sign up</AppText>
                                </AppText>
                            </Pressable>
                        </View>

                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </AppContainer>
    );
};

export default SignInScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inner: {
        flex: 1,
        paddingHorizontal: s(24),
        paddingTop: vs(60),
    },
    header: {
        marginBottom: vs(40),
        marginTop: vs(20),
    },
    logo: {
        alignSelf: 'center',
    },
    title: {
        fontSize: Fonts.size.title,
        lineHeight: lineHeight(36, 1.22),
    },
    subtitle: {
        fontSize: Fonts.size.body,
        marginTop: vs(8),
    },
    form: {
        marginBottom: vs(32),
    },
    forgotPasswordContainer: {
        alignSelf: 'flex-end',
        marginTop: vs(4),
        paddingVertical: vs(8),
    },
    forgotPasswordText: {
        fontWeight: Fonts.weight.semiBold,
        fontSize: Fonts.size.bodySmall,
    },
    actions: {
        gap: vs(24),
    },
    footerLinkContainer: {
        alignItems: 'center',
        paddingVertical: vs(12),
    },
    footerLinkText: {
        fontWeight: Fonts.weight.bold,
    },
});
