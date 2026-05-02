import React from 'react'
import { StyleSheet, View } from 'react-native'
import { AppButton, AppScreen, AppText } from '../../components'

const SplashScreen = ({ navigation }) => {
  return (
    <AppScreen contentStyle={styles.screen}>
      <View style={styles.copy}>
        <AppText variant="eyebrow" muted>
          Welcome
        </AppText>
        <AppText variant="title">Fikr</AppText>
        <AppText muted>
          Your app now uses local reusable components from src/components,
          ready for the next screens.
        </AppText>
      </View>

      <AppButton onPress={() => navigation.navigate('Home')}>
        Continue
      </AppButton>
    </AppScreen>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'center',
  },
  copy: {
    gap: 10,
    marginBottom: 28,
  },
})
