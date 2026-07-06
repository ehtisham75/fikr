import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, View, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@react-navigation/native';
import AppText from '../../../components/AppText';
import AppIcon from '../../../components/AppIcon';
import { Fonts, Radius, icon, s, vs } from '../../../theme/sizeMatter';

const PinModal = ({ visible, mode = 'set', correctPin = '', onClose, onSuccess }) => {
  const { colors } = useTheme();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState(1); // 1 = enter pin, 2 = confirm pin
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const shakeOffset = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      setPin('');
      setConfirmPin('');
      setStep(1);
      setErrorMsg('');
      if (mode === 'set') {
        setTitle('Create PIN');
        setSubtitle('Enter a 4-digit PIN to secure your app');
      } else {
        setTitle('Enter PIN');
        setSubtitle('Enter your 4-digit PIN to continue');
      }
    }
  }, [visible, mode]);

  const triggerError = (msg) => {
    setErrorMsg(msg);
    setPin('');
    // Shake animation
    shakeOffset.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  };

  const handleKeyPress = (num) => {
    setErrorMsg('');
    if (pin.length >= 4) return;
    
    const newPin = pin + num;
    setPin(newPin);

    if (newPin.length === 4) {
      // Small delay for better UX before processing
      setTimeout(() => {
        if (mode === 'set') {
          if (step === 1) {
            setConfirmPin(newPin);
            setPin('');
            setStep(2);
            setTitle('Confirm PIN');
            setSubtitle('Please re-enter your 4-digit PIN');
          } else {
            if (newPin === confirmPin) {
              onSuccess?.(newPin);
            } else {
              setStep(1);
              setTitle('Create PIN');
              setSubtitle('Enter a 4-digit PIN to secure your app');
              triggerError('PINs do not match. Try again.');
            }
          }
        } else {
          // verify mode
          if (newPin === correctPin) {
            onSuccess?.();
          } else {
            triggerError('Incorrect PIN. Please try again.');
          }
        }
      }, 150);
    }
  };

  const handleDelete = () => {
    setErrorMsg('');
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
    }
  };

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeOffset.value }],
  }));

  if (!visible) return null;

  const dots = [1, 2, 3, 4];
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'delete'];

  return (
    <Modal
      transparent={false}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <AppIcon name="X" size={icon(22)} color={colors.text} />
          </Pressable>
        </View>

        <View style={styles.content}>
          <AppText style={[styles.title, { color: colors.primary }]}>{title}</AppText>
          <AppText muted style={styles.subtitle}>{subtitle}</AppText>
          
          <Animated.View style={[styles.dotsContainer, shakeStyle]}>
            {dots.map((dot, idx) => (
              <View
                key={dot}
                style={[
                  styles.dot,
                  {
                    borderColor: colors.primary,
                    backgroundColor: idx < pin.length ? colors.primary : 'transparent',
                  },
                ]}
              />
            ))}
          </Animated.View>

          {!!errorMsg && (
            <AppText style={[styles.errorText, { color: colors.error }]}>
              {errorMsg}
            </AppText>
          )}

          <View style={styles.keyboard}>
            {keys.map((key, index) => {
              if (key === '') {
                return <View key={`empty-${index}`} style={styles.key} />;
              }

              if (key === 'delete') {
                return (
                  <Pressable
                    key="delete"
                    onPress={handleDelete}
                    style={({ pressed }) => [
                      styles.key,
                      pressed && { opacity: 0.5 },
                    ]}
                  >
                    <AppIcon name="Delete" size={icon(22)} color={colors.text} />
                  </Pressable>
                );
              }

              return (
                <Pressable
                  key={key}
                  onPress={() => handleKeyPress(key)}
                  style={({ pressed }) => [
                    styles.key,
                    { backgroundColor: pressed ? `${colors.primary}12` : 'transparent' },
                  ]}
                >
                  <AppText style={styles.keyText}>{key}</AppText>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: vs(54),
    paddingHorizontal: s(16),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  closeButton: {
    width: s(40),
    height: s(40),
    borderRadius: Radius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: vs(40),
  },
  title: {
    fontSize: Fonts.size.headingSmall,
    fontWeight: Fonts.weight.bold,
    marginBottom: vs(8),
  },
  subtitle: {
    fontSize: Fonts.size.bodySmall,
    textAlign: 'center',
    paddingHorizontal: s(40),
    marginBottom: vs(40),
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(24),
    marginBottom: vs(24),
  },
  dot: {
    width: s(16),
    height: s(16),
    borderRadius: Radius.round,
    borderWidth: 2,
  },
  errorText: {
    fontSize: Fonts.size.caption,
    fontWeight: Fonts.weight.bold,
    marginBottom: vs(24),
  },
  keyboard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: s(280),
    justifyContent: 'space-between',
    gap: vs(16),
    marginTop: vs(20),
  },
  key: {
    width: s(72),
    height: s(72),
    borderRadius: Radius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    fontSize: Fonts.size.headingSmall,
    fontWeight: Fonts.weight.medium,
  },
});

export default PinModal;
