import React from 'react'
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native'
import { useColorScheme } from 'react-native'
import MainStack from './MainStack'
import { LightThemeColors, DarkThemeColors } from '../theme/colors'

const RootNavigator = () => {
  const scheme = useColorScheme()
  const isDarkMode = scheme === 'dark'

  const customLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      ...LightThemeColors,
    },
  }

  const customDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      ...DarkThemeColors,
    },
  }

  return (
    <NavigationContainer theme={isDarkMode ? customDarkTheme : customLightTheme}>
      <MainStack />
    </NavigationContainer>
  )
}

export default RootNavigator
