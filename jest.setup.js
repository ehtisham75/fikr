/* global jest */

jest.mock('react-native-reanimated');

jest.mock('react-native-mmkv', () => {
  const stores = new Map();

  return {
    MMKV: jest.fn().mockImplementation(() => ({
      set: jest.fn((key, value) => stores.set(key, value)),
      getString: jest.fn((key) => stores.get(key)),
      delete: jest.fn((key) => stores.delete(key)),
      clearAll: jest.fn(() => stores.clear()),
    })),
  };
});
