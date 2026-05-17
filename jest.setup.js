/* global jest */

jest.mock('react-native-reanimated');

jest.mock('react-native-mmkv', () => {
  const stores = new Map();
  const createMockStorage = () => ({
    set: jest.fn((key, value) => stores.set(key, value)),
    getString: jest.fn(key => stores.get(key)),
    delete: jest.fn(key => stores.delete(key)),
    clearAll: jest.fn(() => stores.clear()),
  });

  return {
    createMMKV: jest.fn(createMockStorage),
  };
});

jest.mock('./src/lib/supabase', () => {
  const query = {
    select: jest.fn(() => query),
    eq: jest.fn(() => query),
    order: jest.fn(() => Promise.resolve({ data: [], error: null })),
    insert: jest.fn(() => query),
    single: jest.fn(() => Promise.resolve({ data: null, error: null })),
  };

  return {
    supabase: {
      auth: {
        getUser: jest.fn(() => Promise.resolve({ data: { user: null } })),
      },
      from: jest.fn(() => query),
    },
  };
});
