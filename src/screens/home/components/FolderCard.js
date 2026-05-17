import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Lock } from 'lucide-react-native';
import { AppText } from '../../../components';
import { Fonts, Radius, icon, lineHeight, s, vs } from '../../../theme/sizeMatter';

const FolderCard = ({ item, onPress }) => {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
          shadowColor: colors.shadow,
        },
        pressed && styles.cardPressed,
      ]}>
      <View style={styles.cardHeader}>
        <AppText style={styles.cardTitle} variant="heading">
          {item.name}
        </AppText>
        {item.is_locked && (
          <Lock size={icon(18)} color={colors.textSecondary} />
        )}
      </View>
      <AppText muted style={styles.cardAmount}>
        ${item.amount.toFixed(2)}
      </AppText>
    </Pressable>
  );
};

export default FolderCard;

const styles = StyleSheet.create({
  card: {
    padding: s(20),
    marginHorizontal: s(24),
    borderRadius: Radius.xl,
    minHeight: vs(100),
    justifyContent: 'center',
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: vs(4) },
        shadowOpacity: 0.05,
        shadowRadius: s(10),
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(8),
  },
  cardTitle: {
    fontSize: Fonts.size.headingSmall,
    lineHeight: lineHeight(22, 1.27),
  },
  cardAmount: {
    fontSize: Fonts.size.body,
  },
});
