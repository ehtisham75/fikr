import React from 'react'
import {
  Pressable,
  StyleSheet,
  Text,
} from 'react-native'
import { Fonts, Radius, s, vs } from '../theme/sizeMatter'
import { useTheme } from '@react-navigation/native'

const AppButton = ({ children, onPress, variant = 'primary', style, textStyle, disabled }) => {
  const { colors } = useTheme()
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
        isPrimary && { backgroundColor: colors.primary },
        isSecondary && styles.secondary,
        isSecondary && { borderColor: colors.border },
        isGhost && styles.ghost,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}>
      <Text style={[
        styles.label,
        isPrimary && { color: colors.white },
        isSecondary && { color: colors.primary },
        isGhost && styles.ghostLabel,
        isGhost && { color: colors.textSecondary },
        textStyle
      ]}>
        {children}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    height: vs(38),
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: s(18),
    flexDirection: 'row',
  },
  secondary: {
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    height: vs(30),
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  label: {
    fontSize: Fonts.size.body,
    fontWeight: Fonts.weight.bold,
    letterSpacing: 0.5,
  },
  ghostLabel: {
    fontWeight: Fonts.weight.semiBold,
  },
})

export default AppButton
