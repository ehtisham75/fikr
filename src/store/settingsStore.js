import { create } from 'zustand';
import { storage } from '../utils/storage';

export const useSettingsStore = create((set) => ({
  themeMode: storage.getString('fikr_theme_mode') || 'system',
  pinEnabled: storage.getBoolean('fikr_pin_enabled') || false,
  biometricEnabled: storage.getBoolean('fikr_biometric_enabled') || false,
  pinCode: storage.getString('fikr_pin_code') || '',

  setThemeMode: (mode) => {
    storage.set('fikr_theme_mode', mode);
    set({ themeMode: mode });
  },

  setPinEnabled: (enabled) => {
    storage.set('fikr_pin_enabled', enabled);
    set({ pinEnabled: enabled });
    if (!enabled) {
      storage.delete('fikr_pin_code');
      set({ pinCode: '' });
    }
  },

  setBiometricEnabled: (enabled) => {
    storage.set('fikr_biometric_enabled', enabled);
    set({ biometricEnabled: enabled });
  },

  setPinCode: (code) => {
    storage.set('fikr_pin_code', code);
    set({ pinCode: code });
  },
}));
