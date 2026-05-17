import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { AppIcon, AppText } from '../../../components';
import { Fonts, icon, lineHeight, s, vs } from '../../../theme/sizeMatter';

const HomeHeader = () => {
  const { colors } = useTheme();

  return (
    <View style={styles.header}>
      <AppText variant="title" style={[styles.headerTitle, { color: colors.primary }]}>
        Fikr
      </AppText>
      <Pressable style={styles.settingsButton}>
        <AppIcon name="Settings" size={icon(24)} color={colors.text} />
      </Pressable>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(24),
    paddingTop: vs(16),
    paddingBottom: vs(14),
  },
  headerTitle: {
    fontSize: Fonts.size.heading,
    lineHeight: lineHeight(32, 1.25),
  },
  settingsButton: {
    padding: s(8),
  },
});
