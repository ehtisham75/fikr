import { Dimensions, PixelRatio } from 'react-native';
import {
  ScaledSheet,
  scale,
  verticalScale,
  moderateScale,
  moderateVerticalScale,
  s,
  vs,
  ms,
  mvs,
} from 'react-native-size-matters';

const { width, height } = Dimensions.get('window');

const SCREEN_WIDTH = width < height ? width : height;
const SCREEN_HEIGHT = width < height ? height : width;

const round = (size) => PixelRatio.roundToNearestPixel(size);
const percentToNumber = (value) => {
  if (typeof value === 'string') {
    return Number(value.replace('%', ''));
  }

  return value;
};

const widthPercentage = (percentage) => (
  SCREEN_WIDTH * percentToNumber(percentage)
) / 100;

const heightPercentage = (percentage) => (
  SCREEN_HEIGHT * percentToNumber(percentage)
) / 100;

const font = (size, factor = 0.45) => round(moderateScale(size, factor));
const radius = (size, factor = 0.35) => round(moderateScale(size, factor));
const icon = (size, factor = 0.4) => round(moderateScale(size, factor));
const space = (size) => round(scale(size));
const vSpace = (size) => round(verticalScale(size));
const lineHeight = (size, multiplier = 1.35) => round(font(size) * multiplier);

const Metrics = {
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmallDevice: SCREEN_WIDTH < 375,
  isMediumDevice: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414,
  isLargeDevice: SCREEN_WIDTH >= 414,
  hairlineWidth: StyleSheetHairlineWidth(),
  scale,
  verticalScale,
  moderateScale,
  moderateVerticalScale,
  s,
  vs,
  ms,
  mvs,
  wp: widthPercentage,
  hp: heightPercentage,
  font,
  radius,
  icon,
  space,
  vSpace,
  lineHeight,
};

const Spacing = {
  none: 0,
  xxs: space(2),
  xs: space(4),
  sm: space(8),
  md: space(12),
  lg: space(16),
  xl: space(20),
  xxl: space(24),
  xxxl: space(32),
  jumbo: space(40),
};

const VerticalSpacing = {
  none: 0,
  xxs: vSpace(2),
  xs: vSpace(4),
  sm: vSpace(8),
  md: vSpace(12),
  lg: vSpace(16),
  xl: vSpace(20),
  xxl: vSpace(24),
  xxxl: vSpace(32),
  jumbo: vSpace(40),
};

const Radius = {
  xs: radius(4),
  sm: radius(8),
  md: radius(12),
  lg: radius(14),
  xl: radius(20),
  round: 999,
};

const Fonts = {
  size: {
    tiny: font(10),
    caption: font(12),
    small: font(13),
    bodySmall: font(14),
    body: font(16),
    bodyLarge: font(17),
    subtitle: font(18),
    headingSmall: font(22),
    heading: font(30),
    title: font(36),
    display: font(44),
    hero: font(48),
  },
  lineHeight: {
    caption: lineHeight(12),
    bodySmall: lineHeight(14),
    body: lineHeight(16),
    bodyLarge: lineHeight(17),
    subtitle: lineHeight(18),
    headingSmall: lineHeight(22),
    heading: lineHeight(30, 1.25),
    title: lineHeight(36, 1.22),
    display: lineHeight(44, 1.18),
    hero: lineHeight(48, 1.17),
  },
  weight: {
    light: '300',
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
    extraBold: '800',
  },
};

const Typography = {
  eyebrow: {
    fontSize: Fonts.size.small,
    lineHeight: Fonts.lineHeight.bodySmall,
    fontWeight: Fonts.weight.bold,
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: Fonts.size.display,
    lineHeight: Fonts.lineHeight.display,
    fontWeight: Fonts.weight.extraBold,
    letterSpacing: 0,
  },
  heading: {
    fontSize: Fonts.size.heading,
    lineHeight: Fonts.lineHeight.heading,
    fontWeight: Fonts.weight.extraBold,
    letterSpacing: 0,
  },
  body: {
    fontSize: Fonts.size.bodyLarge,
    lineHeight: Fonts.lineHeight.bodyLarge,
    fontWeight: Fonts.weight.regular,
    letterSpacing: 0,
  },
  caption: {
    fontSize: Fonts.size.caption,
    lineHeight: Fonts.lineHeight.caption,
    fontWeight: Fonts.weight.medium,
    letterSpacing: 0,
  },
};

function StyleSheetHairlineWidth() {
  return round(1 / PixelRatio.get());
}

export {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  ScaledSheet,
  Metrics,
  Fonts,
  Typography,
  Spacing,
  VerticalSpacing,
  Radius,
  scale,
  verticalScale,
  moderateScale,
  moderateVerticalScale,
  s,
  vs,
  ms,
  mvs,
  widthPercentage as wp,
  heightPercentage as hp,
  font,
  radius,
  icon,
  space,
  vSpace,
  lineHeight,
};

export default {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  ScaledSheet,
  Metrics,
  Fonts,
  Typography,
  Spacing,
  VerticalSpacing,
  Radius,
  scale,
  verticalScale,
  moderateScale,
  moderateVerticalScale,
  s,
  vs,
  ms,
  mvs,
  wp: widthPercentage,
  hp: heightPercentage,
  font,
  radius,
  icon,
  space,
  vSpace,
  lineHeight,
};
