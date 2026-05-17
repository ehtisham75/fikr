import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { s, vs } from '../theme/sizeMatter'

const AppKeyboardAvoidingView = ({ children, style, behavior }) => {
    return (
        <KeyboardAvoidingView
            style={[styles.container, style]}
            behavior={behavior || (Platform.OS === 'ios' ? 'padding' : 'height')}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}>
                    {children}
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

export default AppKeyboardAvoidingView

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    content: {
        flexGrow: 1,
        paddingHorizontal: s(24),
        paddingTop: vs(24),
        paddingBottom: vs(32),
    },
})