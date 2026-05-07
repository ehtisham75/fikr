import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

const FOLDERS_KEY = 'fikr_folders';

export const saveFolders = (folders) => {
  storage.set(FOLDERS_KEY, JSON.stringify(folders));
};

export const getFolders = () => {
  const folders = storage.getString(FOLDERS_KEY);
  if (!folders) {
    // Return dummy data if empty for preview purposes
    return [
      { id: '1', name: 'Groceries', amount: 350.50, is_locked: false },
      { id: '2', name: 'Personal', amount: 120.00, is_locked: true },
      { id: '3', name: 'Subscriptions', amount: 45.99, is_locked: false },
    ];
  }
  return JSON.parse(folders);
};
