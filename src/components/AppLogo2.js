import { useEffect } from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSequence,
    Easing,
    cancelAnimation,
} from 'react-native-reanimated';
import COLORS from '../theme/colors';

const AppLogo2 = ({ size }) => {
    // Animation values
    const logoScale = useSharedValue(0);
    const logoRotate = useSharedValue(0);

    useEffect(() => {
        startAnimations();

        return () => {
            cancelAnimation(logoScale);
            cancelAnimation(logoRotate);
        };
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
            <View style={styles.logoInner}>
                {/* Dollar/Coffee cup icon using pure shapes */}
                <View style={styles.logoIcon}>
                    <View style={styles.logoCurve}>
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
        width: 130,
        height: 130,
        backgroundColor: '#FFFFFF',
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.2,
                shadowRadius: 25,
            },
            android: {
                elevation: 12,
            },
        }),
    },
    logoIcon: {
        width: 70,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoCurve: {
        width: 50,
        height: 40,
        borderWidth: 4,
        borderColor: '#A78BFA',
        borderBottomWidth: 0,
        borderRadius: 20,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    logoDot: {
        position: 'absolute',
        bottom: -8,
        left: 18,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#A78BFA',
    },
})