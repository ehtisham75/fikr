import { StyleSheet, Pressable, Platform } from 'react-native'
import AppIcon from './AppIcon'
import { icon, s, vs, Radius } from '../theme/sizeMatter'
import { useTheme } from '@react-navigation/native'

const AppFloatingButton = ({ onPress }) => {
    const { colors } = useTheme();

    const fabTheme = {
        backgroundColor: colors.primary,
        shadowColor: colors.shadow,
    };
    return (
        <Pressable
            style={({ pressed }) => [
                styles.fab,
                fabTheme,
                pressed && styles.fabPressed,
            ]}
            onPress={onPress}
        >
            <AppIcon name={'Plus'} size={icon(24)} color={colors.white} />
        </Pressable>
    )
}

export default AppFloatingButton

const styles = StyleSheet.create({

    fab: {
        position: 'absolute',
        bottom: vs(32),
        right: s(24),
        width: s(48),
        height: s(48),
        borderRadius: s(32),
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowOffset: { width: 0, height: vs(6) },
                shadowOpacity: 0.4,
                shadowRadius: s(12),
            },
            android: {
                elevation: 8,
            },
        }),
    },
    fabPressed: {
        transform: [{ scale: 0.95 }],
        opacity: 0.9,
    },
})