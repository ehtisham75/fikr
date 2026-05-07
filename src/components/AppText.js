import React from 'react'
import { StyleSheet, Text, useColorScheme } from 'react-native'
import COLORS from '../theme/colors'

const AppText = ({ children, muted = false, style, variant = 'body' }) => {
  const isDarkMode = useColorScheme() === 'dark'

  return (
    <Text
      style={[
        styles.base,
        styles[variant],
        muted && styles.muted,
        isDarkMode ? styles.textDark : styles.textLight,
        muted && (isDarkMode ? styles.mutedDark : styles.mutedLight),
        style,
      ]}>
      {children}
    </Text>
  )
}

const styles = StyleSheet.create({
  base: {
    letterSpacing: 0,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 44,
    fontWeight: '800',
    lineHeight: 52,
  },
  heading: {
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 38,
  },
  body: {
    fontSize: 17,
    lineHeight: 25,
  },
  muted: {
    fontWeight: '500',
  },
  textLight: {
    color: COLORS.text.black2,
  },
  textDark: {
    color: COLORS.text.white,
  },
  mutedLight: {
    color: COLORS.text.gray,
  },
  mutedDark: {
    color: COLORS.text.gray,
  },
})

export default AppText
