import React from 'react'
import { StyleSheet, View } from 'react-native'
import { AppButton, AppScreen, AppText } from '../../components'

const HomeScreen = () => {
  return (
    <AppScreen contentStyle={styles.screen}>
      <View style={styles.copy}>
        <AppText variant="heading">Home</AppText>
        <AppText muted>
          This screen is rendered with your own app components, ready to extend
          as the product grows.
        </AppText>
      </View>

      <View style={styles.actions}>
        <AppButton>
          Primary Action
        </AppButton>
        <AppButton variant="secondary">
          Secondary
        </AppButton>
      </View>
    </AppScreen>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'center',
  },
  copy: {
    gap: 10,
    marginBottom: 28,
  },
  actions: {
    gap: 12,
  },
})
