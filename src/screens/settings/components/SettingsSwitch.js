import React, { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import { useTheme } from '@react-navigation/native';
import { Radius, s, vs } from '../../../theme/sizeMatter';

const SettingsSwitch = ({ value, onValueChange }) => {
  const { colors } = useTheme();
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(value ? 1 : 0, {
      damping: 15,
      stiffness: 150,
      mass: 0.5,
    });
  }, [value, progress]);

  const trackAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [colors.border, colors.primary]
    );
    return {
      backgroundColor,
    };
  });

  const knobAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: progress.value * s(18) }],
    };
  });

  return (
    <Pressable onPress={() => onValueChange?.(!value)}>
      <Animated.View style={[styles.track, trackAnimatedStyle]}>
        <Animated.View style={[styles.knob, knobAnimatedStyle, { backgroundColor: colors.white }]} />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  track: {
    width: s(44),
    height: vs(26),
    borderRadius: Radius.round,
    padding: s(3),
    justifyContent: 'center',
  },
  knob: {
    width: s(20),
    height: s(20),
    borderRadius: Radius.round,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
});

export default SettingsSwitch;
