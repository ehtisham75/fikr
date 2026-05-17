import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useFocusEffect, useNavigation, useTheme } from '@react-navigation/native';
import { LogOut, Mail, UserRound } from 'lucide-react-native';
import {
  AppButton,
  AppContainer,
  AppText,
} from '../../components';
import { supabase } from '../../lib/supabase';
import ROUTES from '../../utils/routes';
import { showToast } from '../../utils/helper';
import { Fonts, Radius, icon, lineHeight, s, vs } from '../../theme/sizeMatter';

const SettingsScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [state, setState] = useState({
    user: null,
    isSigningOut: false,
  });
  const updateState = value => setState(prev => ({ ...prev, ...value }));

  const loadUser = useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    updateState({ user: data?.user || null });
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUser();
    }, [loadUser]),
  );

  const handleSignOut = async () => {
    updateState({ isSigningOut: true });

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      showToast('success', 'Signed out', 'See you next time.');
      const rootNavigation = navigation.getParent() || navigation;
      rootNavigation.reset({
        index: 0,
        routes: [{ name: ROUTES.SIGN_IN }],
      });
    } catch (error) {
      showToast('error', 'Sign out failed', error.message || 'Please try again.');
    } finally {
      updateState({ isSigningOut: false });
    }
  };

  const name = state.user?.user_metadata?.full_name || 'Fikr user';
  const email = state.user?.email || 'No email found';

  return (
    <AppContainer contentStyle={styles.screen}>
      <View style={styles.header}>
        <AppText muted style={styles.eyebrow}>Settings</AppText>
        <AppText variant="heading" style={[styles.title, { color: colors.primary }]}>
          Account
        </AppText>
      </View>

      <View
        style={[
          styles.profileCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            shadowColor: colors.shadow,
          },
        ]}>
        <View style={[styles.avatar, { backgroundColor: `${colors.primary}18` }]}>
          <UserRound size={icon(28)} color={colors.primary} />
        </View>
        <View style={styles.profileCopy}>
          <AppText style={styles.name}>{name}</AppText>
          <View style={styles.emailRow}>
            <Mail size={icon(15)} color={colors.textSecondary} />
            <AppText muted numberOfLines={1} style={styles.email}>
              {email}
            </AppText>
          </View>
        </View>
      </View>

      <Pressable
        style={[
          styles.settingRow,
          { borderColor: colors.border, backgroundColor: colors.card },
        ]}
        onPress={handleSignOut}
        disabled={state.isSigningOut}>
        <View style={[styles.rowIcon, { backgroundColor: `${colors.error}12` }]}>
          <LogOut size={icon(18)} color={colors.error} />
        </View>
        <View style={styles.rowCopy}>
          <AppText style={styles.rowTitle}>Sign out</AppText>
          <AppText muted style={styles.rowSubtitle}>
            End this session on your device.
          </AppText>
        </View>
      </Pressable>

      <AppButton
        onPress={handleSignOut}
        loading={state.isSigningOut}
        variant="secondary"
        style={styles.signOutButton}>
        Sign out
      </AppButton>
    </AppContainer>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: s(24),
    paddingTop: vs(22),
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
    lineHeight: lineHeight(30, 1.2),
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: s(16),
    marginBottom: vs(18),
  },
  avatar: {
    width: s(56),
    height: s(56),
    borderRadius: Radius.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(14),
  },
  profileCopy: {
    flex: 1,
  },
  name: {
    fontSize: Fonts.size.bodyLarge,
    fontWeight: Fonts.weight.bold,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(4),
    gap: s(6),
  },
  email: {
    flex: 1,
    fontSize: Fonts.size.bodySmall,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: s(14),
  },
  rowIcon: {
    width: s(42),
    height: s(42),
    borderRadius: Radius.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(12),
  },
  rowCopy: {
    flex: 1,
  },
  rowTitle: {
    fontSize: Fonts.size.bodySmall,
    fontWeight: Fonts.weight.bold,
  },
  rowSubtitle: {
    fontSize: Fonts.size.caption,
    marginTop: vs(2),
  },
  signOutButton: {
    marginTop: vs(24),
  },
});
