import { useEffect, useState } from 'react'
import { StyleSheet, Pressable, Platform, View } from 'react-native'
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated'
import AppIcon from './AppIcon'
import AppText from './AppText'
import { Fonts, Radius, icon, lineHeight, s, vs } from '../theme/sizeMatter'
import { useTheme } from '@react-navigation/native'

const DEFAULT_SUB_BUTTONS = [
    { key: 'folder', label: 'New Folder', icon: 'FolderPlus' },
    { key: 'task', label: 'Add Task', icon: 'ListPlus' },
]

const FloatingSubButton = ({
    colors,
    index,
    item,
    onPress,
    progress,
    total,
}) => {
    const closedOffset = s(10);
    const openOffset = -(total - index) * vs(58);
    const animatedStyle = useAnimatedStyle(() => {
        const translateY = interpolate(
            progress.value,
            [0, 1],
            [closedOffset, openOffset],
            Extrapolation.CLAMP,
        );

        return {
            opacity: progress.value,
            transform: [
                { translateY },
                { scale: interpolate(progress.value, [0, 1], [0.82, 1]) },
            ],
        };
    });

    return (
        <Animated.View 
            needsOffscreenAlphaCompositing={true}
            style={[styles.subButtonAnimated, animatedStyle]}>
            <Pressable
                onPress={onPress}
                style={({ pressed }) => [
                    styles.subButton,
                    {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                        shadowColor: colors.shadow,
                    },
                    pressed && styles.subButtonPressed,
                ]}>
                <View style={[styles.subIcon, { backgroundColor: `${colors.primary}18` }]}>
                    <AppIcon name={item.icon} size={icon(18)} color={colors.primary} />
                </View>
                <AppText style={styles.subLabel}>{item.label}</AppText>
            </Pressable>
        </Animated.View>
    );
};

const AppFloatingButton = ({
    onPress,
    hasSubButtons = false,
    isSubButtons = false,
    subButtons = DEFAULT_SUB_BUTTONS,
}) => {
    const { colors } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const progress = useSharedValue(0);

    const fabTheme = {
        backgroundColor: colors.primary,
        shadowColor: colors.shadow,
    };

    useEffect(() => {
        progress.value = withSpring(isOpen ? 1 : 0, {
            damping: 15,
            stiffness: 180,
            mass: 0.75,
        });
    }, [isOpen, progress]);

    const iconAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            { rotate: `${interpolate(progress.value, [0, 1], [0, 45])}deg` },
        ],
    }));

    const backdropAnimatedStyle = useAnimatedStyle(() => ({
        opacity: withTiming(isOpen ? 1 : 0, { duration: 160 }),
    }));

    const handleMainPress = () => {
        if (hasSubButtons || isSubButtons) {
            setIsOpen(current => !current);
            return;
        }

        onPress?.();
    };

    const handleSubButtonPress = item => {
        setIsOpen(false);
        // Small delay ensures smoother closing animation before navigation push
        setTimeout(() => {
            item.onPress?.();
        }, 10);
    };

    return (
        <>
            {(hasSubButtons || isSubButtons) && isOpen && (
                <Pressable
                    onPress={() => setIsOpen(false)}
                    style={styles.backdrop}>
                    <Animated.View style={[styles.backdropFill, backdropAnimatedStyle]} />
                </Pressable>
            )}
            {(hasSubButtons || isSubButtons) && (
                <View pointerEvents={isOpen ? 'box-none' : 'none'} style={styles.subButtonWrap}>
                    {subButtons.map((item, index) => {
                        return (
                            <FloatingSubButton
                                key={item.key || item.label}
                                colors={colors}
                                index={index}
                                item={item}
                                onPress={() => handleSubButtonPress(item)}
                                progress={progress}
                                total={subButtons.length}
                            />
                        )
                    })}
                </View>
            )}
            <View style={styles.fabPosition}>
                <Pressable
                    style={({ pressed }) => [
                        styles.fab,
                        fabTheme,
                        pressed && styles.fabPressed,
                    ]}
                    onPress={handleMainPress}
                >
                    <Animated.View style={iconAnimatedStyle}>
                        <AppIcon name={'Plus'} size={icon(24)} color={colors.white} />
                    </Animated.View>
                </Pressable>
            </View>
        </>
    )
}

export default AppFloatingButton

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 8,
    },
    backdropFill: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
    },
    subButtonWrap: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 9,
    },
    subButtonAnimated: {
        position: 'absolute',
        bottom: vs(32),
        right: s(24),
    },
    subButton: {
        width: s(160),
        minHeight: vs(44),
        borderRadius: Radius.lg,
        borderWidth: 1,
        paddingHorizontal: s(12),
        paddingVertical: vs(8),
        flexDirection: 'row',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowOffset: { width: 0, height: vs(4) },
                shadowOpacity: 0.1,
                shadowRadius: s(10),
            },
            android: {
                elevation: 3,
            },
        }),
    },
    subButtonPressed: {
        transform: [{ scale: 0.96 }],
    },
    subIcon: {
        width: s(30),
        height: s(30),
        borderRadius: Radius.round,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: s(10),
    },
    subLabel: {
        flex: 1,
        fontSize: Fonts.size.bodySmall,
        lineHeight: lineHeight(14, 1.2),
        fontWeight: Fonts.weight.bold,
    },
    fabPosition: {
        position: 'absolute',
        bottom: vs(32),
        right: s(24),
        zIndex: 10,
    },
    fab: {
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
        transform: [{ scale: 0.92 }],
    },
})
