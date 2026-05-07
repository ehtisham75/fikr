import React, { useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Pressable } from 'react-native';
import { AppScreen, AppText, AppTextInput, AppButton } from '../../components';
import ROUTES from '../../utils/routes';
import COLORS from '../../theme/colors';
import { loginSchema } from '../../utils/authValidator';

const SignInScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

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
        <AppScreen contentStyle={styles.screen}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.inner}>

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
                                <AppText style={styles.forgotPasswordText}>
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
                                    Don't have an account? <AppText style={styles.footerLinkText}>Sign up</AppText>
                                </AppText>
                            </Pressable>
                        </View>

                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </AppScreen>
    );
};

export default SignInScreen;

const styles = StyleSheet.create({
    screen: {
        paddingHorizontal: 0,
        paddingTop: 0,
    },
    container: {
        flex: 1,
    },
    inner: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
    },
    header: {
        marginBottom: 40,
        marginTop: 20,
    },
    title: {
        fontSize: 36,
        lineHeight: 44,
    },
    subtitle: {
        fontSize: 16,
        marginTop: 8,
    },
    form: {
        marginBottom: 32,
    },
    forgotPasswordContainer: {
        alignSelf: 'flex-end',
        marginTop: 4,
        paddingVertical: 8,
    },
    forgotPasswordText: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    actions: {
        gap: 24,
    },
    footerLinkContainer: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    footerLinkText: {
        color: COLORS.primary,
        fontWeight: '700',
    },
});