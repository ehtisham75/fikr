import React from 'react'
import { Button, H1, Paragraph, YStack } from 'tamagui/native'

const SplashScreen = ({ navigation }) => {
  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      padding="$5"
      justifyContent="center"
      gap="$4">
      <YStack gap="$2">
        <Paragraph size="$3" color="$color10">
          Tamagui is ready
        </Paragraph>
        <H1 color="$color" size="$10">
          Fikr
        </H1>
        <Paragraph size="$5" color="$color11">
          Your app is wrapped in TamaguiProvider and using Tamagui tokens,
          themes, and components.
        </Paragraph>
      </YStack>

      <Button theme="active" size="$4" onPress={() => navigation.navigate('Home')}>
        Continue
      </Button>
    </YStack>
  )
}

export default SplashScreen
