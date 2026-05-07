import React, { useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Pressable } from 'react-native';
import { AppScreen, AppText, AppTextInput, AppButton } from '../../components';
import ROUTES from '../../utils/routes';
import COLORS from '../../theme/colors';

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    // Supabase signup logic will go here
    console.log('Signup pressed:', email);
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
                Create an account
              </AppText>
              <AppText muted style={styles.subtitle}>
                Start your journey towards mindful spending.
              </AppText>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <AppTextInput
                label="Full Name"
                placeholder="Enter your name"
                autoCapitalize="words"
                value={name}
                onChangeText={setName}
              />
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
                placeholder="Create a password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <AppButton onPress={handleSignup}>
                Sign up
              </AppButton>
              <Pressable 
                onPress={() => navigation.navigate(ROUTES.SIGN_IN)}
                style={styles.footerLinkContainer}
              >
                <AppText muted>
                  Already have an account? <AppText style={styles.footerLinkText}>Log in</AppText>
                </AppText>
              </Pressable>
            </View>

          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </AppScreen>
  );
};

export default SignUpScreen;

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