import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { AppButton, AppScreen, AppText } from '../../components';
import COLORS from '../../theme/colors';
import ROUTES from '../../utils/routes';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
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
  }, []);

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonTranslateY.value }],
  }));

  return (
    <AppScreen contentStyle={styles.screen}>
      <View style={styles.graphicContainer}>
        {/* Minimal Animated Graphic Background */}
        <Animated.View style={[styles.graphicCircle, contentAnimatedStyle]} />
        <Animated.View style={[styles.graphicCircleSmall, contentAnimatedStyle]} />
        <Animated.View style={[styles.graphicCircleTiny, contentAnimatedStyle]} />
      </View>

      <View style={styles.contentWrapper}>
        <Animated.View style={[styles.copy, contentAnimatedStyle]}>
          <AppText variant="eyebrow" style={styles.eyebrow}>
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
    </AppScreen>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  graphicContainer: {
    height: height * 0.45,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  graphicCircle: {
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
    backgroundColor: COLORS.primary,
    // opacity: 0.05,
    position: 'absolute',
    top: -width * 0.4,
    right: -width * 0.3,
  },
  graphicCircleSmall: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: COLORS.purple.purple2,
    opacity: 0.08,
    position: 'absolute',
    top: -width * 0.1,
    left: -width * 0.2,
  },
  graphicCircleTiny: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
    backgroundColor: COLORS.purple.purple2,
    opacity: 0.15,
    position: 'absolute',
    bottom: width * 0.2,
    right: width * 0.1,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  copy: {
    gap: 8,
    marginBottom: 40,
  },
  eyebrow: {
    color: COLORS.primary,
    letterSpacing: 2,
    marginBottom: 4,
  },
  title: {
    fontSize: 48,
    lineHeight: 56,
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 28,
    marginTop: 8,
  },
  actions: {
    gap: 16,
  },
  skipButton: {
    marginTop: 8,
  },
});
