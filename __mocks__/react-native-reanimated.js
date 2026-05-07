const ReactNative = require('react-native')

const Easing = {
  cubic: value => value,
  quad: value => value,
  inOut: easing => easing,
  out: easing => easing,
}

const passthrough = value => value

module.exports = {
  __esModule: true,
  default: {
    View: ReactNative.View,
    Text: ReactNative.Text,
  },
  Easing,
  useAnimatedStyle: styleFactory => styleFactory(),
  useSharedValue: value => ({ value }),
  withDelay: (_duration, animation) => animation,
  withSequence: (...animations) => animations[animations.length - 1],
  withTiming: passthrough,
}
