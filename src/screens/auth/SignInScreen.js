import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { AppButton, AppText, AppTextInput } from '../../components';
import { supabase } from '../../lib/supabase';
import ROUTES from '../../utils/routes';
import { loginSchema } from '../../utils/authValidator';
import { formatZodErrors, getAuthErrorMessage } from '../../utils/authHelpers';
import { showToast } from '../../utils/helper';
import { Fonts, s, vs } from '../../theme/sizeMatter';
import AuthScaffold from './components/AuthScaffold';
import resetNavigation from '../../utils/resetNavigation';

const SignInScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const [state, setState] = useState({
        email: '',
        password: '',
        isLoading: false,
        errors: {},
    });
    const updateState = value => setState(prev => ({ ...prev, ...value }));
    const linkTextTheme = { color: colors.primary };

    const handleLogin = async () => {
        updateState({ errors: {} });

        const validationResult = loginSchema.safeParse({
            email: state.email,
            password: state.password,
        });

        if (!validationResult.success) {
            updateState({ errors: formatZodErrors(validationResult) });
            return;
        }

        updateState({ isLoading: true });

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: state.email.trim(),
                password: state.password,
            });

            if (error) {
                throw error;
            }

            showToast('success', 'Welcome back', 'You are logged in.');
            resetNavigation(navigation, ROUTES.HOME);

        } catch (error) {
            showToast('error', 'Login failed', getAuthErrorMessage(error));
        } finally {
            updateState({ isLoading: false });
        }
    };

    return (
        <AuthScaffold
            navigation={navigation}
            title="Welcome back"
            subtitle="Log in to continue tracking your mindful spending.">
            <AppTextInput
                label="Email"
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={state.email}
                onChangeText={text => updateState({
                    email: text,
                    errors: { ...state.errors, email: null },
                })}
                error={state.errors.email}
            />
            <AppTextInput
                label="Password"
                placeholder="Enter your password"
                secureTextEntry
                value={state.password}
                onChangeText={text => updateState({
                    password: text,
                    errors: { ...state.errors, password: null },
                })}
                error={state.errors.password}
            />

            <Pressable
                onPress={() => navigation.navigate(ROUTES.FORGOT_PASSWORD)}
                style={styles.forgotPasswordContainer}>
                <AppText style={[styles.forgotPasswordText, linkTextTheme]}>
                    Forgot password?
                </AppText>
            </Pressable>

            <View style={styles.actions}>
                <AppButton
                    onPress={handleLogin}
                    loading={state.isLoading}
                    disabled={!state.email || !state.password}>
                    Log in
                </AppButton>
                <Pressable
                    onPress={() => navigation.navigate(ROUTES.SIGN_UP)}
                    style={styles.footerLinkContainer}>
                    <AppText muted style={styles.footerText}>
                        Don't have an account? <AppText style={[styles.footerLinkText, linkTextTheme]}>Sign up</AppText>
                    </AppText>
                </Pressable>
            </View>
        </AuthScaffold>
    );
};

export default SignInScreen;

const styles = StyleSheet.create({
    forgotPasswordContainer: {
        alignSelf: 'flex-end',
        paddingVertical: vs(8),
        paddingHorizontal: s(2),
    },
    forgotPasswordText: {
        fontWeight: Fonts.weight.semiBold,
        fontSize: Fonts.size.bodySmall,
    },
    actions: {
        gap: vs(20),
        marginTop: vs(14),
    },
    footerLinkContainer: {
        alignItems: 'center',
        paddingVertical: vs(12),
    },
    footerText: {
        textAlign: 'center',
    },
    footerLinkText: {
        fontWeight: Fonts.weight.bold,
    },
});
