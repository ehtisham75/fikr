import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV();

const FOLDERS_KEY = 'fikr_folders';

export const saveFolders = folders => {
  storage.set(FOLDERS_KEY, JSON.stringify(folders));
};

export const getFolders = () => {
  const folders = storage.getString(FOLDERS_KEY);
  if (!folders) {
    return [];
  }

  try {
    const parsedFolders = JSON.parse(folders);
    return Array.isArray(parsedFolders) ? parsedFolders : [];
  } catch (error) {
    return [];
  }
};

