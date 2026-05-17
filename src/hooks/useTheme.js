import React from 'react'
import { StyleSheet, Text, View, useColorScheme } from 'react-native'

const useTheme = () => {
    const isDarkMode = useColorScheme() === 'dark'

    return (
        <View>
            <Text>useTheme</Text>
        </View>
    )
}

export default useTheme

const styles = StyleSheet.create({})