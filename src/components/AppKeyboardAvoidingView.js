import React from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

export default function AppKeyboardAvoidingView({ children, style, contentContainerStyle }) {

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
            style={[styles.container, style]}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* <View style={[styles.inner, contentContainerStyle]}> */}
                    {children}
                    {/* </View> */}
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inner: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
});