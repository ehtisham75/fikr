import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Pressable, useColorScheme } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import AppText from './AppText';
import COLORS from '../theme/colors';

const AppTextInput = ({
  label,
  secureTextEntry,
  style,
  containerStyle,
  error,
  ...props
}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isPassword = secureTextEntry;
  const isDark = isDarkMode;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <AppText style={styles.label} variant="body" muted>
          {label}
        </AppText>
      )}
      <View
        style={[
          styles.inputContainer,
          isDark ? styles.inputContainerDark : styles.inputContainerLight,
          isFocused && styles.inputFocused,
          error && styles.inputError,
        ]}>
        <TextInput
          style={[
            styles.input,
            isDark ? styles.textDark : styles.textLight,
            style,
          ]}
          placeholderTextColor={isDark ? COLORS.text.gray : COLORS.text.gray}
          secureTextEntry={isPassword && !isPasswordVisible}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {isPassword && (
          <Pressable
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.eyeIconContainer}>
            {isPasswordVisible ? (
              <EyeOff size={20} color={COLORS.text.gray} />
            ) : (
              <Eye size={20} color={COLORS.text.gray} />
            )}
          </Pressable>
        )}
      </View>
      {error && (
        <AppText style={styles.errorText} variant="body">
          {error}
        </AppText>
      )}
    </View>
  );
};

export default AppTextInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    minHeight: 52,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  inputContainerLight: {
    borderColor: COLORS.border.lightGray,
    backgroundColor: '#F9FAFB', // subtle light bg for input
  },
  inputContainerDark: {
    borderColor: COLORS.border.gray,
    backgroundColor: '#1F2937', // subtle dark bg
  },
  inputFocused: {
    borderColor: COLORS.primary,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  textLight: {
    color: COLORS.text.black,
  },
  textDark: {
    color: COLORS.text.white,
  },
  eyeIconContainer: {
    paddingLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 6,
  },
});