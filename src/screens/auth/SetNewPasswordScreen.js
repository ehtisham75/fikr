import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';
import { useTheme } from '@react-navigation/native';
import { AppButton, AppText, AppTextInput } from '../../components';
import { supabase } from '../../lib/supabase';
import ROUTES from '../../utils/routes';
import { setNewPasswordSchema } from '../../utils/authValidator';
import { formatZodErrors, getAuthErrorMessage } from '../../utils/authHelpers';
import { showToast } from '../../utils/helper';
import { Fonts, Radius, icon, lineHeight, s, vs } from '../../theme/sizeMatter';
import AuthScaffold from './components/AuthScaffold';

const SetNewPasswordScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [state, setState] = useState({
    password: '',
    confirmPassword: '',
    isLoading: false,
    errors: {},
  });
  const updateState = value => setState(prev => ({ ...prev, ...value }));

  const handleUpdatePassword = async () => {
    updateState({ errors: {} });

    const validationResult = setNewPasswordSchema.safeParse({
      password: state.password,
      confirmPassword: state.confirmPassword,
    });

    if (!validationResult.success) {
      updateState({ errors: formatZodErrors(validationResult) });
      return;
    }

    updateState({ isLoading: true });

    try {
      const { error } = await supabase.auth.updateUser({
        password: state.password,
      });

      if (error) {
        throw error;
      }

      showToast('success', 'Password updated', 'You are logged in securely.');
      navigation.reset({
        index: 0,
        routes: [{ name: ROUTES.HOME }],
      });
    } catch (error) {
      showToast('error', 'Update failed', getAuthErrorMessage(error));
    } finally {
      updateState({ isLoading: false });
    }
  };

  return (
    <AuthScaffold
      navigation={navigation}
      showBack
      eyebrow="Almost done"
      title="Set a new password"
      subtitle="Choose a strong password with at least 8 characters, one uppercase letter, and one number.">
      <View
        style={[
          styles.securityPanel,
          { borderColor: colors.border, backgroundColor: colors.card },
        ]}>
        <View style={[styles.securityIcon, { backgroundColor: `${colors.primary}18` }]}>
          <ShieldCheck size={icon(22)} color={colors.primary} />
        </View>
        <AppText muted style={styles.securityText}>
          Your reset code has been verified. Save a new password to continue.
        </AppText>
      </View>

      <AppTextInput
        label="New Password"
        placeholder="Create a new password"
        secureTextEntry
        value={state.password}
        onChangeText={text => updateState({
          password: text,
          errors: { ...state.errors, password: null },
        })}
        error={state.errors.password}
      />
      <AppTextInput
        label="Confirm Password"
        placeholder="Re-enter your password"
        secureTextEntry
        value={state.confirmPassword}
        onChangeText={text => updateState({
          confirmPassword: text,
          errors: { ...state.errors, confirmPassword: null },
        })}
        error={state.errors.confirmPassword}
      />

      <AppButton
        onPress={handleUpdatePassword}
        loading={state.isLoading}
        disabled={!state.password || !state.confirmPassword}
        style={styles.saveButton}>
        Save new password
      </AppButton>
    </AuthScaffold>
  );
};

export default SetNewPasswordScreen;

const styles = StyleSheet.create({
  securityPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: s(14),
    paddingVertical: vs(14),
    marginBottom: vs(18),
  },
  securityIcon: {
    width: s(42),
    height: s(42),
    borderRadius: Radius.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(12),
  },
  securityText: {
    flex: 1,
    fontSize: Fonts.size.bodySmall,
    lineHeight: lineHeight(14, 1.4),
  },
  saveButton: {
    marginTop: vs(14),
  },
});
