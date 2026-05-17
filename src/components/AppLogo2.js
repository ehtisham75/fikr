import { useEffect } from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSequence,
    Easing,
    cancelAnimation,
} from 'react-native-reanimated';
import { Radius, icon, s, vs } from '../theme/sizeMatter';

const AppLogo2 = ({ size = 130 }) => {
    const logoSize = icon(size);
    const curveWidth = logoSize * 0.38;
    const curveHeight = logoSize * 0.3;
    // Animation values
    const logoScale = useSharedValue(0);
    const logoRotate = useSharedValue(0);

    useEffect(() => {
        startAnimations();

        return () => {
            cancelAnimation(logoScale);
            cancelAnimation(logoRotate);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const startAnimations = () => {

        // Logo scale with elastic bounce
        logoScale.value = withSequence(
            withTiming(0, { duration: 0 }),
            withTiming(1.3, {
                duration: 800,
                easing: Easing.bezier(0.34, 1.56, 0.64, 1),
            }),
            withTiming(1, {
                duration: 400,
                easing: Easing.bezier(0.34, 1.56, 0.64, 1),
            })
        );

        // Logo rotation
        logoRotate.value = withSequence(
            withTiming(0, { duration: 0 }),
            withTiming(-10, { duration: 300 }),
            withTiming(10, { duration: 300 }),
            withTiming(0, { duration: 300 })
        );
    };

    const logoAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: logoScale.value },
            { rotate: `${logoRotate.value}deg` },
        ],
    }));

    return (
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
            <View style={[
                styles.logoInner,
                {
                    width: logoSize,
                    height: logoSize,
                    borderRadius: logoSize * 0.27,
                },
            ]}>
                {/* Dollar/Coffee cup icon using pure shapes */}
                <View style={[
                    styles.logoIcon,
                    {
                        width: logoSize * 0.54,
                        height: logoSize * 0.54,
                    },
                ]}>
                    <View style={[
                        styles.logoCurve,
                        {
                            width: curveWidth,
                            height: curveHeight,
                            borderRadius: curveHeight / 2,
                        },
                    ]}>
                        <View style={styles.logoDot} />
                    </View>
                </View>
            </View>
        </Animated.View>
    )
}

export default AppLogo2

const styles = StyleSheet.create({

    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoInner: {
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: vs(10) },
                shadowOpacity: 0.2,
                shadowRadius: s(25),
            },
            android: {
                elevation: 12,
            },
        }),
    },
    logoIcon: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoCurve: {
        borderWidth: s(4),
        borderColor: '#A78BFA',
        borderBottomWidth: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    logoDot: {
        position: 'absolute',
        bottom: -vs(8),
        left: s(18),
        width: icon(8),
        height: icon(8),
        borderRadius: Radius.xs,
        backgroundColor: '#A78BFA',
    },
})
