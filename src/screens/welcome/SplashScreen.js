import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Text,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
  cancelAnimation,
  runOnJS,
} from 'react-native-reanimated';
import ROUTES from '../../utils/routes';
import { AppLogo } from '../../components';
import { supabase } from '../../lib/supabase';
import { Fonts, SCREEN_HEIGHT, SCREEN_WIDTH, lineHeight, s, vs } from '../../theme/sizeMatter';

const SplashScreen = ({ navigation }) => {
  const { colors } = useTheme();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const completeSplash = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      navigation.replace(data?.session ? ROUTES.HOME : ROUTES.WELCOME);
    } catch (error) {
      console.log('Splash auth session error:', error);
      navigation.replace(ROUTES.WELCOME);
    }
  };

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
        runOnJS(completeSplash)();
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
  const containerTheme = { backgroundColor: colors.primary };
  const brandTextTheme = { color: colors.onPrimary };
  const dividerTheme = { backgroundColor: colors.onPrimarySubtle };
  const taglineTheme = { color: colors.onPrimaryMuted };

  return (
    <Animated.View style={[styles.container, containerTheme, bgAnimatedStyle]}>
      {/* Background decoration */}
      <View style={styles.decorationTop} />
      <View style={styles.decorationBottom} />

      {/* Ripple circles */}
      <Animated.View style={[styles.rippleCircle, circleAnimatedStyle]} />
      <Animated.View style={[styles.rippleCircle2, circleAnimatedStyle]} />

      {/* Logo */}
      <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
        <AppLogo size={130} />
      </Animated.View>

      {/* Text */}
      <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
        <Text style={[styles.brandName, brandTextTheme]}>Fikr</Text>
        <View style={[styles.divider, dividerTheme]} />
        <Text style={[styles.tagline, taglineTheme]}>mindful spending</Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  decorationTop: {
    position: 'absolute',
    top: -SCREEN_HEIGHT * 0.2,
    left: -SCREEN_WIDTH * 0.3,
    width: SCREEN_WIDTH * 0.7,
    height: SCREEN_WIDTH * 0.7,
    borderRadius: SCREEN_WIDTH * 0.35,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  decorationBottom: {
    position: 'absolute',
    bottom: -SCREEN_HEIGHT * 0.15,
    right: -SCREEN_WIDTH * 0.2,
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_WIDTH * 0.6,
    borderRadius: SCREEN_WIDTH * 0.3,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  rippleCircle: {
    position: 'absolute',
    width: s(120),
    height: s(120),
    borderRadius: s(60),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  rippleCircle2: {
    position: 'absolute',
    width: s(120),
    height: s(120),
    borderRadius: s(60),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    transform: [{ scale: 0.8 }],
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    marginTop: vs(40),
    alignItems: 'center',
  },
  brandName: {
    fontSize: Fonts.size.display,
    lineHeight: lineHeight(44, 1.18),
    fontWeight: Fonts.weight.bold,
    letterSpacing: 2,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
  },
  divider: {
    width: s(40),
    height: vs(2),
    marginVertical: vs(12),
  },
  tagline: {
    fontSize: Fonts.size.bodySmall,
    lineHeight: lineHeight(14),
    fontWeight: Fonts.weight.medium,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});

export default SplashScreen;
