import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV();

const FOLDERS_KEY = 'fikr_folders';
const DEFAULT_FOLDERS = [
  { id: '1', name: 'Groceries', amount: 350.5, is_locked: false },
  { id: '2', name: 'Personal', amount: 120.0, is_locked: true },
  { id: '3', name: 'Subscriptions', amount: 45.99, is_locked: false },
];

export const saveFolders = folders => {
  storage.set(FOLDERS_KEY, JSON.stringify(folders));
};

export const getFolders = () => {
  const folders = storage.getString(FOLDERS_KEY);
  if (!folders) {
    return DEFAULT_FOLDERS;
  }

  try {
    const parsedFolders = JSON.parse(folders);
    return Array.isArray(parsedFolders) ? parsedFolders : DEFAULT_FOLDERS;
  } catch (error) {
    return DEFAULT_FOLDERS;
  }
};
