import React, { useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Pressable } from 'react-native';
import { AppScreen, AppText, AppTextInput, AppButton } from '../../components';
import ROUTES from '../../utils/routes';
import COLORS from '../../theme/colors';

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
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
                onChangeText={setEmail}
              />
              <AppTextInput
                label="Password"
                placeholder="Enter your password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
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
              <AppButton onPress={handleLogin}>
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