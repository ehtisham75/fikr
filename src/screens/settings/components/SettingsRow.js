import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import AppText from '../../../components/AppText';
import AppIcon from '../../../components/AppIcon';
import { Fonts, Radius, icon, s, vs } from '../../../theme/sizeMatter';

const SettingsRow = ({
  iconName,
  title,
  description,
  rightElement,
  onPress,
  iconColor,
  danger = false,
}) => {
  const { colors } = useTheme();

  const RowContainer = onPress ? Pressable : View;

  return (
    <RowContainer
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { borderColor: colors.border },
        onPress && pressed && styles.pressed,
      ]}
    >
      <View style={styles.leftContainer}>
        {iconName && (
          <View style={[styles.iconWrap, { backgroundColor: danger ? `${colors.error}12` : `${iconColor || colors.primary}12` }]}>
            <AppIcon
              name={iconName}
              size={icon(20)}
              color={danger ? colors.error : (iconColor || colors.primary)}
            />
          </View>
        )}
        <View style={styles.textContainer}>
          <AppText style={[styles.title, danger && { color: colors.error }]}>
            {title}
          </AppText>
          {description && (
            <AppText muted style={styles.description}>
              {description}
            </AppText>
          )}
        </View>
      </View>
      {rightElement && <View style={styles.rightContainer}>{rightElement}</View>}
    </RowContainer>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: vs(12),
    borderBottomWidth: 1,
  },
  pressed: {
    opacity: 0.6,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconWrap: {
    width: s(40),
    height: s(40),
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(12),
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: Fonts.size.body,
    fontWeight: Fonts.weight.bold,
  },
  description: {
    fontSize: Fonts.size.caption,
    marginTop: vs(2),
  },
  rightContainer: {
    marginLeft: s(12),
    justifyContent: 'center',
  },
});

export default SettingsRow;
