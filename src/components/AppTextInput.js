import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Pressable } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Eye, EyeOff } from 'lucide-react-native';
import AppText from './AppText';
import { Fonts, Radius, icon, s, vs } from '../theme/sizeMatter';

const AppTextInput = ({
  label,
  secureTextEntry,
  style,
  containerStyle,
  inputContainerStyle,
  error,
  ...props
}) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isPassword = secureTextEntry;
  const inputContainerTheme = {
    borderColor: colors.border,
    backgroundColor: colors.background,
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <AppText style={[styles.label, isFocused && { color: colors.primary },]} variant="body" muted>
          {label}
        </AppText>
      )}
      <View
        style={[
          styles.inputContainer,
          inputContainerTheme,
          inputContainerStyle,
          isFocused && { borderColor: colors.primary },
          error && { borderColor: colors.error },
        ]}>
        <TextInput
          style={[
            styles.input,
            { color: colors.text },
            style,
          ]}
          placeholderTextColor={colors.textSecondary}
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
              <EyeOff size={icon(20)} color={colors.textSecondary} />
            ) : (
              <Eye size={icon(20)} color={colors.textSecondary} />
            )}
          </Pressable>
        )}
      </View>
      {error && (
        <AppText style={[styles.errorText, { color: colors.error }]} variant="body">
          {error}
        </AppText>
      )}
    </View>
  );
};

export default AppTextInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: vs(10),
  },
  label: {
    marginBottom: vs(2),
    fontSize: Fonts.size.small,
    fontWeight: Fonts.weight.medium,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: Radius.md,
    height: vs(38),
    paddingHorizontal: s(16),
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    fontSize: Fonts.size.bodySmall,
  },
  eyeIconContainer: {
    paddingLeft: s(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: Fonts.size.caption,
    marginTop: vs(6),
  },
});
