import React from 'react'
import {
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
} from 'react-native'
import COLORS from '../theme/colors'

const AppButton = ({ children, onPress, variant = 'primary', style, textStyle, disabled }) => {
  const isDarkMode = useColorScheme() === 'dark'
  const isPrimary = variant === 'primary'
  const isSecondary = variant === 'secondary'
  const isGhost = variant === 'ghost'

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        isPrimary && styles.primary,
        isSecondary && styles.secondary,
        isSecondary && (isDarkMode ? styles.secondaryDark : styles.secondaryLight),
        isGhost && styles.ghost,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}>
      <Text style={[
        styles.label,
        isPrimary && styles.primaryLabel,
        isSecondary && styles.secondaryLabel,
        isGhost && styles.ghostLabel,
        textStyle
      ]}>
        {children}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    flexDirection: 'row',
  },
  primary: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  secondaryLight: {
    borderColor: COLORS.border.lightGray,
  },
  secondaryDark: {
    borderColor: COLORS.border.gray,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    minHeight: 48,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  primaryLabel: {
    color: COLORS.text.white,
  },
  secondaryLabel: {
    color: COLORS.primary,
  },
  ghostLabel: {
    color: '#9CA3AF',
    fontWeight: '600',
  },
})

export default AppButton
