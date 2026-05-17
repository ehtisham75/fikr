import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import {
  AppContainer,
  AppKeyboardAvoidingView,
  AppLogo,
  AppText,
} from '../../../components';
import { Fonts, Radius, icon, lineHeight, s, vs } from '../../../theme/sizeMatter';

const AuthScaffold = ({
  children,
  eyebrow,
  title,
  subtitle,
  navigation,
  showBack = false,
  footer,
}) => {
  const { colors } = useTheme();

  return (
    <AppContainer contentStyle={styles.screen}>
      <AppKeyboardAvoidingView>

        <View style={styles.topBar}>
          {showBack ? (
            <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
              <ArrowLeft size={icon(22)} color={colors.text} />
            </Pressable>
          ) : (
            <View style={styles.backButtonPlaceholder} />
          )}
          <AppLogo size={72} containerStyle={styles.logo} />
          <View style={styles.backButtonPlaceholder} />
        </View>

        <View style={styles.header}>
          {eyebrow && (
            <AppText muted style={styles.eyebrow}>
              {eyebrow}
            </AppText>
          )}
          <AppText variant="title" style={styles.title}>
            {title}
          </AppText>
          <AppText muted style={styles.subtitle}>
            {subtitle}
          </AppText>
        </View>

        <View style={styles.form}>{children}</View>
        {footer}
      </AppKeyboardAvoidingView>
    </AppContainer>
  );
};

export default AuthScaffold;

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginBottom: vs(26),
    paddingVertical: vs(26),
    // backgroundColor: 'red'
  },
  backButton: {
    width: s(42),
    height: s(42),
    borderRadius: Radius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPlaceholder: {
    width: s(42),
    height: s(42),
  },
  logo: {
    alignSelf: 'center',
  },
  header: {
    marginBottom: vs(30),
  },
  eyebrow: {
    fontSize: Fonts.size.caption,
    fontWeight: Fonts.weight.bold,
    textTransform: 'uppercase',
    marginBottom: vs(8),
  },
  title: {
    fontSize: Fonts.size.title,
    lineHeight: lineHeight(36, 1.18),
  },
  subtitle: {
    fontSize: Fonts.size.body,
    lineHeight: lineHeight(16, 1.45),
    marginTop: vs(8),
  },
  form: {
    gap: vs(4),
  },
});
