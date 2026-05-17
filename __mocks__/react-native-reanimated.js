const ReactNative = require('react-native')

const Easing = {
  cubic: value => value,
  quad: value => value,
  inOut: easing => easing,
  out: easing => easing,
}

const passthrough = value => value
const interpolate = (value, inputRange, outputRange) => {
  if (value <= inputRange[0]) return outputRange[0]
  if (value >= inputRange[inputRange.length - 1]) return outputRange[outputRange.length - 1]

  const inputSpan = inputRange[inputRange.length - 1] - inputRange[0]
  const outputSpan = outputRange[outputRange.length - 1] - outputRange[0]

  return outputRange[0] + ((value - inputRange[0]) / inputSpan) * outputSpan
}

module.exports = {
  __esModule: true,
  default: {
    View: ReactNative.View,
    Text: ReactNative.Text,
    createAnimatedComponent: component => component,
  },
  Easing,
  Extrapolation: {
    CLAMP: 'clamp',
  },
  interpolate,
  useAnimatedStyle: styleFactory => styleFactory(),
  useSharedValue: value => ({ value }),
  withDelay: (_duration, animation) => animation,
  withSequence: (...animations) => animations[animations.length - 1],
  withSpring: passthrough,
  withTiming: passthrough,
}
