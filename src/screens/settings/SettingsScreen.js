import React, { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AppContainer, AppText, AppButton } from '../../components';
import { SettingsRow, SettingsSwitch, PinModal } from './components';
import { useSettingsStore } from '../../store/settingsStore';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import ROUTES from '../../utils/routes';
import { showToast } from '../../utils/helper';
import { storage } from '../../utils/storage';
import { Fonts, Radius, s, vs } from '../../theme/sizeMatter';

const SettingsScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const user = useAuthStore(state => state.user);
  const isLoggedIn = !!user;

  // Settings states
  const themeMode = useSettingsStore(state => state.themeMode);
  const pinEnabled = useSettingsStore(state => state.pinEnabled);
  const biometricEnabled = useSettingsStore(state => state.biometricEnabled);
  const pinCode = useSettingsStore(state => state.pinCode);

  const setThemeMode = useSettingsStore(state => state.setThemeMode);
  const setPinEnabled = useSettingsStore(state => state.setPinEnabled);
  const setBiometricEnabled = useSettingsStore(state => state.setBiometricEnabled);
  const setPinCode = useSettingsStore(state => state.setPinCode);

  // Modal states
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [pinModalMode, setPinModalMode] = useState('set'); // 'set' | 'verify'
  const [pinPurpose, setPinPurpose] = useState(''); // 'enable' | 'disable' | 'change_verify' | 'change_set'

  const handlePinToggle = (value) => {
    if (value) {
      setPinModalMode('set');
      setPinPurpose('enable');
      setPinModalVisible(true);
    } else {
      setPinModalMode('verify');
      setPinPurpose('disable');
      setPinModalVisible(true);
    }
  };

  const handlePinSuccess = (code) => {
    setPinModalVisible(false);

    if (pinPurpose === 'enable') {
      setPinCode(code);
      setPinEnabled(true);
      showToast('success', 'PIN Enabled', 'Passcode lock has been enabled.');
    } else if (pinPurpose === 'disable') {
      setPinEnabled(false);
      showToast('success', 'PIN Disabled', 'Passcode lock has been disabled.');
    } else if (pinPurpose === 'change_verify') {
      // verified existing pin, now show setup for new pin
      setTimeout(() => {
        setPinModalMode('set');
        setPinPurpose('change_set');
        setPinModalVisible(true);
      }, 300);
    } else if (pinPurpose === 'change_set') {
      setPinCode(code);
      showToast('success', 'PIN Updated', 'Passcode lock PIN has been changed.');
    }
  };

  const handleChangePin = () => {
    setPinModalMode('verify');
    setPinPurpose('change_verify');
    setPinModalVisible(true);
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase.auth.signOut();
            if (error) {
              showToast('error', 'Logout Failed', error.message);
            } else {
              showToast('success', 'Logged Out', 'You have been signed out.');
              navigation.reset({
                index: 0,
                routes: [{ name: ROUTES.WELCOME }],
              });
            }
          },
        },
      ]
    );
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'This will delete all folders, budgets, tasks, and settings permanently. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Everything',
          style: 'destructive',
          onPress: async () => {
            try {
              await supabase.auth.signOut();
              storage.clearAll();
              
              // Reset settings in memory
              setThemeMode('system');
              setPinEnabled(false);
              setBiometricEnabled(false);
              
              showToast('success', 'Data Reset', 'All local data has been reset.');
              navigation.reset({
                index: 0,
                routes: [{ name: ROUTES.WELCOME }],
              });
            } catch (error) {
              showToast('error', 'Reset Failed', error.message || 'An error occurred.');
            }
          },
        },
      ]
    );
  };

  return (
    <AppContainer contentStyle={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(50).duration(400)} style={styles.header}>
          <AppText muted style={styles.eyebrow}>Settings</AppText>
          <AppText variant="heading" style={[styles.title, { color: colors.primary }]}>
            Preferences
          </AppText>
        </Animated.View>

        {/* Account Module Card */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <AppText style={styles.sectionHeader}>Account</AppText>
          {isLoggedIn ? (
            <View style={styles.accountInfo}>
              <View style={styles.profileMeta}>
                <AppText style={styles.profileName}>
                  {user.user_metadata?.name || 'Fikr User'}
                </AppText>
                <AppText muted style={styles.profileEmail}>
                  {user.email}
                </AppText>
              </View>
              <AppButton variant="secondary" style={styles.logoutBtn} onPress={handleLogout}>
                Log Out
              </AppButton>
            </View>
          ) : (
            <View style={styles.guestPanel}>
              <AppText muted style={styles.guestText}>
                You are currently using the app in Guest Mode. Register or log in to sync your budgets and tasks across devices.
              </AppText>
              <AppButton style={styles.loginBtn} onPress={() => navigation.navigate(ROUTES.SIGN_IN)}>
                Log In / Sign Up
              </AppButton>
            </View>
          )}
        </Animated.View>

        {/* Security Module Card */}
        <Animated.View entering={FadeInDown.delay(150).duration(400)} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <AppText style={styles.sectionHeader}>Security</AppText>
          
          <SettingsRow
            iconName="Lock"
            title="Passcode Lock"
            description="Secure the app with a 4-digit PIN"
            rightElement={
              <SettingsSwitch
                value={pinEnabled}
                onValueChange={handlePinToggle}
              />
            }
          />

          {pinEnabled && (
            <>
              <SettingsRow
                iconName="Fingerprint"
                title="Biometric Authentication"
                description="Unlock the app using fingerprint/face"
                rightElement={
                  <SettingsSwitch
                    value={biometricEnabled}
                    onValueChange={(val) => {
                      setBiometricEnabled(val);
                      showToast('success', val ? 'Biometrics Enabled' : 'Biometrics Disabled');
                    }}
                  />
                }
              />
              <SettingsRow
                iconName="Key"
                title="Change Passcode PIN"
                description="Update your security code"
                onPress={handleChangePin}
              />
            </>
          )}
        </Animated.View>

        {/* App Configuration Card */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <AppText style={styles.sectionHeader}>App settings</AppText>

          <View style={styles.themeRow}>
            <View style={styles.themeCopy}>
              <AppText style={styles.rowTitle}>Theme preference</AppText>
              <AppText muted style={styles.rowDesc}>Choose light, dark, or system matching</AppText>
            </View>
            <View style={[styles.selectorContainer, { backgroundColor: colors.background }]}>
              {['system', 'light', 'dark'].map((mode) => {
                const isActive = themeMode === mode;
                return (
                  <View
                    key={mode}
                    style={[
                      styles.selectorButton,
                      isActive && { backgroundColor: colors.card, shadowColor: colors.shadow },
                    ]}
                  >
                    <AppText
                      onPress={() => setThemeMode(mode)}
                      style={[
                        styles.selectorText,
                        isActive ? { color: colors.primary, fontWeight: Fonts.weight.bold } : { color: colors.textSecondary },
                      ]}
                    >
                      {mode}
                    </AppText>
                  </View>
                );
              })}
            </View>
          </View>

          <SettingsRow
            iconName="Trash"
            title="Reset All Data"
            description="Clear all folders, tasks, and settings"
            onPress={handleResetData}
            danger
          />
        </Animated.View>
      </ScrollView>

      {/* PIN entry modal */}
      <PinModal
        visible={pinModalVisible}
        mode={pinModalMode}
        correctPin={pinCode}
        onClose={() => setPinModalVisible(false)}
        onSuccess={handlePinSuccess}
      />
    </AppContainer>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  content: {
    paddingHorizontal: s(24),
    paddingTop: vs(14),
    paddingBottom: vs(42),
  },
  header: {
    marginBottom: vs(18),
  },
  eyebrow: {
    fontSize: Fonts.size.caption,
    fontWeight: Fonts.weight.bold,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: Fonts.size.heading,
    lineHeight: vs(34),
  },
  card: {
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: s(16),
    marginBottom: vs(16),
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: vs(4) },
        shadowOpacity: 0.04,
        shadowRadius: s(10),
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sectionHeader: {
    fontSize: Fonts.size.bodySmall,
    fontWeight: Fonts.weight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: vs(12),
  },
  accountInfo: {
    gap: vs(14),
  },
  profileMeta: {
    gap: vs(2),
  },
  profileName: {
    fontSize: Fonts.size.subtitle,
    fontWeight: Fonts.weight.bold,
  },
  profileEmail: {
    fontSize: Fonts.size.bodySmall,
  },
  logoutBtn: {
    height: vs(36),
    marginTop: vs(4),
  },
  guestPanel: {
    gap: vs(14),
  },
  guestText: {
    fontSize: Fonts.size.bodySmall,
    lineHeight: vs(18),
  },
  loginBtn: {
    height: vs(36),
  },
  themeRow: {
    paddingVertical: vs(12),
    borderBottomWidth: 1,
    borderBottomColor: 'transparent', // just spacer
  },
  themeCopy: {
    marginBottom: vs(10),
  },
  rowTitle: {
    fontSize: Fonts.size.body,
    fontWeight: Fonts.weight.bold,
  },
  rowDesc: {
    fontSize: Fonts.size.caption,
    marginTop: vs(2),
  },
  selectorContainer: {
    flexDirection: 'row',
    borderRadius: Radius.md,
    padding: s(2),
  },
  selectorButton: {
    flex: 1,
    paddingVertical: vs(8),
    alignItems: 'center',
    borderRadius: Radius.sm,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 1,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  selectorText: {
    fontSize: Fonts.size.bodySmall,
    textTransform: 'capitalize',
  },
});