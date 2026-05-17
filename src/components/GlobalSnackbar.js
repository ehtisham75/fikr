import React, { useState, useEffect } from 'react';
import { DeviceEventEmitter, StyleSheet, useColorScheme } from 'react-native';
import { Snackbar, Text } from 'react-native-paper';
import { Fonts } from '../theme/sizeMatter';
import { DarkThemeColors, LightThemeColors } from '../theme/colors';

const GlobalSnackbar = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('success');
  const isDarkMode = useColorScheme() === 'dark';
  const colors = isDarkMode ? DarkThemeColors : LightThemeColors;

  useEffect(() => {
    const listener = DeviceEventEmitter.addListener('showToast', (event) => {
      const header = event.header || 'Success';
      const text = event.text || '';
      setMessage(text ? `${header}: ${text}` : header);
      setType(event.type || 'success');
      setVisible(true);
    });

    return () => {
      listener.remove();
    };
  }, []);

  return (
    <Snackbar
      visible={visible}
      onDismiss={() => setVisible(false)}
      duration={3000}
      style={[
        styles.snackbar,
        { backgroundColor: type === 'error' ? colors.error : colors.primary }
      ]}
      action={{
        label: 'OK',
        labelStyle: { color: colors.card },
        onPress: () => setVisible(false),
      }}
    >
      <Text style={[styles.text, { color: colors.card }]}>{message}</Text>
    </Snackbar>
  );
};

const styles = StyleSheet.create({
  snackbar: {
    borderRadius: 8,
  },
  text: {
    fontSize: Fonts.size.bodySmall,
    fontWeight: Fonts.weight.semiBold,
  },
});

export default GlobalSnackbar;
