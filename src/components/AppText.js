import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { useTheme } from '@react-navigation/native'
import { Typography } from '../theme/sizeMatter'

const AppText = ({ children, muted = false, style, variant = 'body' }) => {
  const { colors } = useTheme()

  return (
    <Text
      style={[
        styles.base,
        styles[variant],
        { color: muted ? colors.textSecondary : colors.text },
        muted && styles.muted,
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
  eyebrow: Typography.eyebrow,
  title: Typography.title,
  heading: Typography.heading,
  body: Typography.body,
  muted: {
    fontWeight: '500',
  },
})

export default AppText
