import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { AppButton, AppText, AppTextInput } from '../../components';
import { supabase } from '../../lib/supabase';
import ROUTES from '../../utils/routes';
import { signupSchema } from '../../utils/authValidator';
import { formatZodErrors, getAuthErrorMessage } from '../../utils/authHelpers';
import { showToast } from '../../utils/helper';
import { Fonts, vs } from '../../theme/sizeMatter';
import resetNavigation from '../../utils/resetNavigation';
import AuthScaffold from './components/AuthScaffold';

const SignUpScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [state, setState] = useState({
    name: '',
    email: '',
    password: '',
    isLoading: false,
    errors: {},
  });
  const updateState = value => setState(prev => ({ ...prev, ...value }));
  const linkTextTheme = { color: colors.primary };

  const handleSignup = async () => {
    updateState({ errors: {} });

    const validationResult = signupSchema.safeParse({
      name: state.name,
      email: state.email,
      password: state.password,
    });

    if (!validationResult.success) {
      updateState({ errors: formatZodErrors(validationResult) });
      return;
    }

    updateState({ isLoading: true });

    try {
      const email = state.email.trim();
      const { data, error } = await supabase.auth.signUp({
        email,
        password: state.password,
        options: {
          data: {
            full_name: state.name.trim(),
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data?.session) {
        showToast('success', 'Account created', 'You are logged in.');
        resetNavigation(navigation, ROUTES.HOME);
        return;
      }

      showToast('success', 'Check your email', 'Enter the verification code we sent.');
      navigation.navigate(ROUTES.OTP_VERIFICATION, {
        email,
        flow: 'signup',
      });
    } catch (error) {
      showToast('error', 'Signup failed', getAuthErrorMessage(error));
    } finally {
      updateState({ isLoading: false });
    }
  };

  return (
    <AuthScaffold
      navigation={navigation}
      showBack
      title="Create an account"
      subtitle="Start your journey toward mindful spending.">
      <AppTextInput
        label="Full Name"
        placeholder="Enter your name"
        autoCapitalize="words"
        value={state.name}
        onChangeText={text => updateState({
          name: text,
          errors: { ...state.errors, name: null },
        })}
        error={state.errors.name}
      />
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
        placeholder="Create a password"
        secureTextEntry
        value={state.password}
        onChangeText={text => updateState({
          password: text,
          errors: { ...state.errors, password: null },
        })}
        error={state.errors.password}
      />

      <View style={styles.actions}>
        <AppButton
          onPress={handleSignup}
          loading={state.isLoading}
          disabled={!state.name || !state.email || !state.password}>
          Sign up
        </AppButton>
        <Pressable
          onPress={() => navigation.navigate(ROUTES.SIGN_IN)}
          style={styles.footerLinkContainer}>
          <AppText muted style={styles.footerText}>
            Already have an account? <AppText style={[styles.footerLinkText, linkTextTheme]}>Log in</AppText>
          </AppText>
        </Pressable>
      </View>
    </AuthScaffold>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  actions: {
    gap: vs(20),
    marginTop: vs(18),
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
