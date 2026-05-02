import React from 'react'
import { Button, H2, Paragraph, Separator, XStack, YStack } from 'tamagui/native'

const HomeScreen = () => {
  return (
    <YStack flex={1} backgroundColor="$background" padding="$5" justifyContent="center" gap="$5">
      <YStack gap="$2">
        <H2 color="$color">Home</H2>
        <Paragraph size="$5" color="$color11">
          This screen is rendered with Tamagui layout and typography primitives.
        </Paragraph>
      </YStack>

      <Separator />

      <XStack gap="$3" flexWrap="wrap">
        <Button size="$4" theme="active">
          Primary Action
        </Button>
        <Button size="$4" variant="outlined">
          Secondary
        </Button>
      </XStack>
    </YStack>
  )
}

export default HomeScreen
