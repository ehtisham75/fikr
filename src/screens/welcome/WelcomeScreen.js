import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { AppButton, AppContainer, AppText } from '../../components';
import ROUTES from '../../utils/routes';
import { Fonts, SCREEN_HEIGHT, SCREEN_WIDTH, lineHeight, s, vs } from '../../theme/sizeMatter';

const WelcomeScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(40);
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(20);

  useEffect(() => {
    contentOpacity.value = withDelay(
      200,
      withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) })
    );
    contentTranslateY.value = withDelay(
      200,
      withTiming(0, { duration: 800, easing: Easing.out(Easing.cubic) })
    );

    buttonOpacity.value = withDelay(
      500,
      withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) })
    );
    buttonTranslateY.value = withDelay(
      500,
      withTiming(0, { duration: 800, easing: Easing.out(Easing.cubic) })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonTranslateY.value }],
  }));
  const primaryGraphicTheme = { backgroundColor: colors.primary };
  const secondaryGraphicTheme = { backgroundColor: colors.purple.purple2 };
  const eyebrowTheme = { color: colors.primary };

  return (
    <AppContainer safeArea={false}>
      <View style={styles.graphicContainer}>
        {/* Minimal Animated Graphic Background */}
        <Animated.View style={[styles.graphicCircle, secondaryGraphicTheme, contentAnimatedStyle]} />
        <Animated.View style={[styles.graphicCircleSmall, primaryGraphicTheme, contentAnimatedStyle]} />
        <Animated.View style={[styles.graphicCircleTiny, primaryGraphicTheme, contentAnimatedStyle]} />
      </View>

      <View style={styles.contentWrapper}>
        <Animated.View style={[styles.copy, contentAnimatedStyle]}>
          <AppText variant="eyebrow" style={[styles.eyebrow, eyebrowTheme]}>
            Welcome to
          </AppText>
          <AppText variant="title" style={styles.title}>
            Fikr
          </AppText>
          <AppText muted style={styles.subtitle}>
            Mindful spending starts here. Track your expenses effortlessly and securely.
          </AppText>
        </Animated.View>

        <Animated.View style={[styles.actions, buttonAnimatedStyle]}>
          <AppButton onPress={() => navigation.navigate(ROUTES.SIGN_UP)}>
            Create Account
          </AppButton>
          <AppButton variant="secondary" onPress={() => navigation.navigate(ROUTES.SIGN_IN)}>
            Log in
          </AppButton>
          <AppButton
            variant="ghost"
            onPress={() => navigation.navigate(ROUTES.HOME)}
            style={styles.skipButton}
          >
            Skip for now
          </AppButton>
        </Animated.View>
      </View>
    </AppContainer>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'flex-start',
    // paddingHorizontal: 0,
    // paddingTop: 0,
  },
  graphicContainer: {
    height: SCREEN_HEIGHT * 0.45,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  graphicCircle: {
    width: SCREEN_WIDTH * 1.2,
    height: SCREEN_WIDTH * 1.2,
    borderRadius: SCREEN_WIDTH * 0.6,
    // opacity: 0.05,
    position: 'absolute',
    top: -SCREEN_WIDTH * 0.4,
    right: -SCREEN_WIDTH * 0.3,
  },
  graphicCircleSmall: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_WIDTH * 0.8,
    borderRadius: SCREEN_WIDTH * 0.4,
    opacity: 0.08,
    position: 'absolute',
    top: -SCREEN_WIDTH * 0.1,
    left: -SCREEN_WIDTH * 0.2,
  },
  graphicCircleTiny: {
    width: SCREEN_WIDTH * 0.3,
    height: SCREEN_WIDTH * 0.3,
    borderRadius: SCREEN_WIDTH * 0.15,
    opacity: 0.15,
    position: 'absolute',
    bottom: SCREEN_WIDTH * 0.25,
    right: SCREEN_WIDTH * 0.1,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: s(24),
    paddingBottom: vs(40),
  },
  copy: {
    gap: vs(8),
    marginBottom: vs(40),
  },
  eyebrow: {
    letterSpacing: 2,
    marginBottom: vs(4),
  },
  title: {
    fontSize: Fonts.size.hero,
    lineHeight: lineHeight(48, 1.17),
  },
  subtitle: {
    fontSize: Fonts.size.subtitle,
    lineHeight: lineHeight(18, 1.55),
    marginTop: vs(8),
  },
  actions: {
    gap: vs(16),
  },
  skipButton: {
    marginTop: vs(8),
  },
});
