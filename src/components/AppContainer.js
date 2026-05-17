import { StyleSheet, View, StatusBar, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useIsFocused, useTheme } from '@react-navigation/native'

const AppContainer = ({ children, contentStyle,
  safeArea = true,
  barStyle = 'dark-content',
  barColor = 'transparent',
  isTranslucent = true
}) => {
  const { colors } = useTheme()
  const isFocused = useIsFocused()
  const isAndroid = Platform.OS === 'android'

  const Container = isAndroid ? View : safeArea ? SafeAreaView : View
  return (
    <Container
      style={[
        styles.screen,
        { backgroundColor: colors.background },
        contentStyle,
      ]}>
      {isFocused && <StatusBar barStyle={barStyle}
        backgroundColor={barColor}
        translucent={isTranslucent}
      />}
      {children}
    </Container>
  )
}

export default AppContainer

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
})
