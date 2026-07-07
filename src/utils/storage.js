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

// ─── Expense helpers ─────────────────────────────────────
const expensesKey = folderId => `fikr_expenses_${folderId}`;

export const getExpenses = folderId => {
  const raw = storage.getString(expensesKey(folderId));
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveExpenses = (folderId, expenses) => {
  storage.set(expensesKey(folderId), JSON.stringify(expenses));
};

export const addExpense = (folderId, expense) => {
  const existing = getExpenses(folderId);
  const updated = [expense, ...existing];
  saveExpenses(folderId, updated);
  return updated;
};

export const deleteExpense = (folderId, expenseId) => {
  const existing = getExpenses(folderId);
  const updated = existing.filter(e => e.id !== expenseId);
  saveExpenses(folderId, updated);
  return updated;
};

/** Recalculate and persist the folder's total amount from its expenses. */
export const updateFolderAmount = (folderId) => {
  const expenses = getExpenses(folderId);
  const total = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const folders = getFolders();
  const updatedFolders = folders.map(f =>
    f.id === folderId ? { ...f, amount: total } : f,
  );
  saveFolders(updatedFolders);
  return total;
};
