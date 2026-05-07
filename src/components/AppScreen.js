import React from 'react'
import { StyleSheet, useColorScheme } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import COLORS from '../theme/colors'

const AppScreen = ({ children, contentStyle }) => {
  const isDarkMode = useColorScheme() === 'dark'

  return (
    <SafeAreaView
      style={[
        styles.screen,
        isDarkMode ? styles.screenDark : styles.screenLight,
        contentStyle,
      ]}>
      {children}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  screenLight: {
    backgroundColor: COLORS.background,
  },
  screenDark: {
    backgroundColor: COLORS.secondary,
  },
})

export default AppScreen
