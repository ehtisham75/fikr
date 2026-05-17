import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { MailCheck } from 'lucide-react-native';
import { useTheme } from '@react-navigation/native';
import { AppButton, AppText, AppTextInput } from '../../components';
import { supabase } from '../../lib/supabase';
import ROUTES from '../../utils/routes';
import { forgotPasswordSchema } from '../../utils/authValidator';
import { formatZodErrors, getAuthErrorMessage } from '../../utils/authHelpers';
import { showToast } from '../../utils/helper';
import { Fonts, Radius, icon, lineHeight, s, vs } from '../../theme/sizeMatter';
import AuthScaffold from './components/AuthScaffold';

const ForgotPasswordScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [state, setState] = useState({
    email: '',
    isLoading: false,
    errors: {},
  });
  const updateState = value => setState(prev => ({ ...prev, ...value }));

  const handleSendCode = async () => {
    updateState({ errors: {} });

    const validationResult = forgotPasswordSchema.safeParse({ email: state.email });

    if (!validationResult.success) {
      updateState({ errors: formatZodErrors(validationResult) });
      return;
    }

    updateState({ isLoading: true });

    try {
      const email = state.email.trim();
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        throw error;
      }

      showToast('success', 'Code sent', 'Check your email for the reset code.');
      navigation.navigate(ROUTES.OTP_VERIFICATION, {
        email,
        flow: 'recovery',
      });
    } catch (error) {
      showToast('error', 'Reset failed', getAuthErrorMessage(error));
    } finally {
      updateState({ isLoading: false });
    }
  };

  return (
    <AuthScaffold
      navigation={navigation}
      showBack
      // eyebrow="Password help"
      title="Reset password"
      subtitle="Enter the email for your Fikr account and we will send a secure one-time code.">
      <View
        style={[
          styles.infoPanel,
          { backgroundColor: `${colors.primary}12`, borderColor: `${colors.primary}33` },
        ]}>
        <View style={[styles.infoIcon, { backgroundColor: colors.primary }]}>
          <MailCheck size={icon(20)} color={colors.white} />
        </View>
        <View style={styles.infoCopy}>
          <AppText style={styles.infoTitle}>Check your inbox</AppText>
          <AppText muted style={styles.infoText}>
            The code expires quickly, so keep this screen open after sending.
          </AppText>
        </View>
      </View>

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

      <AppButton
        onPress={handleSendCode}
        loading={state.isLoading}
        disabled={!state.email}
        style={styles.sendButton}>
        Send reset code
      </AppButton>
    </AuthScaffold>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  infoPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: s(14),
    paddingVertical: vs(14),
    marginBottom: vs(18),
  },
  infoIcon: {
    width: s(42),
    height: s(42),
    borderRadius: Radius.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(12),
  },
  infoCopy: {
    flex: 1,
  },
  infoTitle: {
    fontSize: Fonts.size.bodySmall,
    fontWeight: Fonts.weight.bold,
  },
  infoText: {
    fontSize: Fonts.size.caption,
    lineHeight: lineHeight(12, 1.35),
    marginTop: vs(2),
  },
  sendButton: {
    marginTop: vs(14),
  },
});
