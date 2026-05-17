import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { AppButton, AppText } from '../../components';
import { supabase } from '../../lib/supabase';
import ROUTES from '../../utils/routes';
import { otpSchema } from '../../utils/authValidator';
import { formatZodErrors, getAuthErrorMessage } from '../../utils/authHelpers';
import { showToast } from '../../utils/helper';
import { Fonts, Radius, lineHeight, s, vs } from '../../theme/sizeMatter';
import AuthScaffold from './components/AuthScaffold';
import resetNavigation from '../../utils/resetNavigation';

const CODE_LENGTH = 6;

const OTPVerificationScreen = ({ navigation, route }) => {
  const { colors } = useTheme();
  const inputRef = useRef(null);
  const email = route?.params?.email || '';
  const flow = route?.params?.flow || 'signup';
  const [state, setState] = useState({
    otp: '',
    isLoading: false,
    isResending: false,
    errors: {},
  });
  const updateState = value => setState(prev => ({ ...prev, ...value }));
  const isRecovery = flow === 'recovery';

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 350);
    return () => clearTimeout(timer);
  }, []);

  const handleChangeCode = value => {
    updateState({
      otp: value.replace(/\D/g, '').slice(0, CODE_LENGTH),
      errors: { ...state.errors, otp: null },
    });
  };

  const handleVerify = async () => {
    updateState({ errors: {} });

    const validationResult = otpSchema.safeParse({ otp: state.otp });

    if (!validationResult.success) {
      updateState({ errors: formatZodErrors(validationResult) });
      return;
    }

    updateState({ isLoading: true });

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: state.otp,
        type: isRecovery ? 'recovery' : 'email',
      });

      if (error) {
        throw error;
      }

      showToast('success', 'Code verified', isRecovery ? 'Set your new password.' : 'Your email is verified.');

      if (isRecovery) {
        navigation.replace(ROUTES.SET_NEW_PASSWORD, { email });
        return;
      }

      resetNavigation(navigation, ROUTES.HOME);
    } catch (error) {
      showToast('error', 'Verification failed', getAuthErrorMessage(error));
    } finally {
      updateState({ isLoading: false });
    }
  };

  const handleResend = async () => {
    if (!email) {
      showToast('error', 'Email missing', 'Go back and enter your email again.');
      return;
    }

    updateState({ isResending: true });

    try {
      const response = isRecovery
        ? await supabase.auth.resetPasswordForEmail(email)
        : await supabase.auth.resend({ type: 'signup', email });

      if (response.error) {
        throw response.error;
      }

      showToast('success', 'Code sent', 'Check your email for the latest code.');
    } catch (error) {
      showToast('error', 'Resend failed', getAuthErrorMessage(error));
    } finally {
      updateState({ isResending: false });
    }
  };

  const title = isRecovery ? 'Verify reset code' : 'Verify your email';
  const subtitle = email
    ? `Enter the 6 digit code sent to ${email}.`
    : 'Enter the 6 digit code sent to your email.';

  return (
    <AuthScaffold
      navigation={navigation}
      showBack
      // eyebrow={isRecovery ? 'Password reset' : 'Email confirmation'}
      title={title}
      subtitle={subtitle}>
      <Pressable
        onPress={() => inputRef.current?.focus()}
        style={styles.otpRow}>
        {Array.from({ length: CODE_LENGTH }).map((_, index) => {
          const digit = state.otp[index];
          const isActive = state.otp.length === index;

          return (
            <View
              key={index}
              style={[
                styles.otpBox,
                {
                  borderColor: state.errors.otp
                    ? colors.error
                    : isActive
                      ? colors.primary
                      : colors.border,
                  backgroundColor: colors.card,
                },
              ]}>
              <AppText style={styles.otpDigit}>{digit || ''}</AppText>
            </View>
          );
        })}
      </Pressable>
      <TextInput
        ref={inputRef}
        value={state.otp}
        onChangeText={handleChangeCode}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        maxLength={CODE_LENGTH}
        style={styles.hiddenInput}
      />
      {state.errors.otp && (
        <AppText style={[styles.errorText, { color: colors.error }]}>
          {state.errors.otp}
        </AppText>
      )}

      <AppButton
        onPress={handleVerify}
        loading={state.isLoading}
        disabled={state.otp.length !== CODE_LENGTH}
        style={styles.verifyButton}>
        Verify code
      </AppButton>

      <Pressable
        onPress={handleResend}
        disabled={state.isResending}
        style={styles.resendButton}>
        <AppText muted style={styles.resendText}>
          {state.isResending ? 'Sending code...' : "Didn't receive it? Resend code"}
        </AppText>
      </Pressable>
    </AuthScaffold>
  );
};

export default OTPVerificationScreen;

const styles = StyleSheet.create({
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(4),
    marginBottom: vs(10),
  },
  otpBox: {
    width: s(45),
    height: vs(52),
    borderWidth: 1.5,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpDigit: {
    fontSize: Fonts.size.headingSmall,
    lineHeight: lineHeight(22, 1.15),
    fontWeight: Fonts.weight.bold,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
  errorText: {
    fontSize: Fonts.size.caption,
    marginTop: vs(2),
  },
  verifyButton: {
    marginTop: vs(18),
  },
  resendButton: {
    alignItems: 'center',
    paddingVertical: vs(18),
  },
  resendText: {
    fontSize: Fonts.size.bodySmall,
    fontWeight: Fonts.weight.semiBold,
    textAlign: 'center',
  },
});
