import React from 'react'
import {
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
} from 'react-native'

const AppButton = ({ children, onPress, variant = 'primary' }) => {
  const isDarkMode = useColorScheme() === 'dark'
  const isPrimary = variant === 'primary'

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.primary : styles.secondary,
        !isPrimary && (isDarkMode ? styles.secondaryDark : styles.secondaryLight),
        pressed && styles.pressed,
      ]}>
      <Text style={[styles.label, isPrimary ? styles.primaryLabel : styles.secondaryLabel]}>
        {children}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  primary: {
    backgroundColor: '#246b51',
  },
  secondary: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  secondaryLight: {
    borderColor: '#c7d0c8',
  },
  secondaryDark: {
    borderColor: '#3d4741',
  },
  pressed: {
    opacity: 0.78,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0,
  },
  primaryLabel: {
    color: '#ffffff',
  },
  secondaryLabel: {
    color: '#246b51',
  },
})

export default AppButton
