import React, { useEffect, useState } from 'react';
import {
  Modal,
  StyleSheet,
  View,
  Pressable,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '@react-navigation/native';
import AppButton from './AppButton';
import AppText from './AppText';
import AppIcon from './AppIcon';
import { Fonts, Radius, icon, lineHeight, s, vs } from '../theme/sizeMatter';

const LoginBottomSheet = ({ visible, onClose, onLogin }) => {
  const { colors } = useTheme();
  const [shouldRender, setShouldRender] = useState(visible);
  
  const translateY = useSharedValue(vs(400));
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      // Brief delay to allow layout
      setTimeout(() => {
        backdropOpacity.value = withTiming(0.5, { duration: 250 });
        translateY.value = withSpring(0, {
          damping: 20,
          stiffness: 130,
          mass: 0.8,
        });
      }, 50);
    } else {
      backdropOpacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(vs(400), { duration: 200 }, (finished) => {
        if (finished) {
          runOnJS(setShouldRender)(false);
        }
      });
    }
  }, [visible, backdropOpacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  if (!shouldRender) return null;

  return (
    <Modal
      transparent
      visible={shouldRender}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
          <Animated.View style={[styles.backdrop, backdropStyle, { backgroundColor: colors.black }]} />
        </Pressable>
        <Animated.View style={[styles.sheet, animatedStyle, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {/* Handle bar */}
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
          
          <View style={styles.content}>
            <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}18` }]}>
              <AppIcon name="Lock" size={icon(26)} color={colors.primary} />
            </View>
            
            <AppText style={styles.title}>Login Required</AppText>
            <AppText muted style={styles.subtitle}>
              Please sign in or create an account to start creating folders, tracking expenses, and managing your tasks.
            </AppText>

            <View style={styles.buttonContainer}>
              <AppButton 
                style={styles.loginButton} 
                onPress={() => {
                  onClose();
                  setTimeout(() => {
                    onLogin();
                  }, 250);
                }}
              >
                Log In / Sign Up
              </AppButton>
              
              <AppButton 
                variant="ghost" 
                style={styles.cancelButton}
                onPress={onClose}
              >
                Cancel
              </AppButton>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingTop: vs(8),
    paddingBottom: vs(Platform.OS === 'ios' ? 44 : 24),
    paddingHorizontal: s(24),
  },
  handle: {
    width: s(36),
    height: vs(4),
    borderRadius: Radius.round,
    alignSelf: 'center',
    marginBottom: vs(24),
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    width: s(58),
    height: s(58),
    borderRadius: Radius.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vs(16),
  },
  title: {
    fontSize: Fonts.size.headingSmall,
    fontWeight: Fonts.weight.bold,
    marginBottom: vs(8),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Fonts.size.bodySmall,
    lineHeight: lineHeight(18, 1.3),
    textAlign: 'center',
    marginBottom: vs(24),
    paddingHorizontal: s(12),
  },
  buttonContainer: {
    width: '100%',
    gap: vs(12),
  },
  loginButton: {
    width: '100%',
    height: vs(44),
  },
  cancelButton: {
    width: '100%',
    height: vs(36),
  },
});

export default LoginBottomSheet;
