import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Text,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  cancelAnimation,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import COLORS from '../../theme/colors';
import ROUTES from '../../utils/routes';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  // Animation values
  const logoScale = useSharedValue(0);
  const logoRotate = useSharedValue(0);
  const circleScale = useSharedValue(0);
  const circleOpacity = useSharedValue(1);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(30);
  const bgOpacity = useSharedValue(1);

  useEffect(() => {
    startAnimations();

    return () => {
      cancelAnimation(logoScale);
      cancelAnimation(logoRotate);
      cancelAnimation(circleScale);
      cancelAnimation(circleOpacity);
      cancelAnimation(textOpacity);
      cancelAnimation(textTranslateY);
      cancelAnimation(bgOpacity);
    };
  }, []);

  const startAnimations = () => {
    // Circle ripple effect
    circleScale.value = withSequence(
      withTiming(0, { duration: 0 }),
      withTiming(1.5, { duration: 800, easing: Easing.out(Easing.ease) }),
      withTiming(2.5, { duration: 800, easing: Easing.out(Easing.ease) })
    );
    circleOpacity.value = withSequence(
      withTiming(0.6, { duration: 0 }),
      withTiming(0.3, { duration: 800 }),
      withTiming(0, { duration: 800 })
    );

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

    // Text animation - delayed
    setTimeout(() => {
      textOpacity.value = withTiming(1, {
        duration: 600,
        easing: Easing.bezier(0.23, 1, 0.32, 1),
      });
      textTranslateY.value = withTiming(0, {
        duration: 600,
        easing: Easing.bezier(0.23, 1, 0.32, 1),
      });
    }, 500);

    // Auto complete
    setTimeout(() => {
      bgOpacity.value = withTiming(0, { duration: 500 });
      setTimeout(() => {
        runOnJS(navigation.replace)(ROUTES.WELCOME);
      }, 500);
    }, 2800);
  };

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: logoScale.value },
      { rotate: `${logoRotate.value}deg` },
    ],
  }));

  const circleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: circleScale.value }],
    opacity: circleOpacity.value,
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const bgAnimatedStyle = useAnimatedStyle(() => ({
    opacity: bgOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, bgAnimatedStyle]}>
      {/* Background decoration */}
      <View style={styles.decorationTop} />
      <View style={styles.decorationBottom} />

      {/* Ripple circles */}
      <Animated.View style={[styles.rippleCircle, circleAnimatedStyle]} />
      <Animated.View style={[styles.rippleCircle2, circleAnimatedStyle]} />

      {/* Logo */}
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

      {/* Text */}
      <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
        <Text style={styles.brandName}>Fikr</Text>
        <View style={styles.divider} />
        <Text style={styles.tagline}>mindful spending</Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  decorationTop: {
    position: 'absolute',
    top: -height * 0.2,
    left: -width * 0.3,
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  decorationBottom: {
    position: 'absolute',
    bottom: -height * 0.15,
    right: -width * 0.2,
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  rippleCircle: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  rippleCircle2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    transform: [{ scale: 0.8 }],
  },
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
  textContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  brandName: {
    fontSize: 44,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 2,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginVertical: 12,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});

export default SplashScreen;