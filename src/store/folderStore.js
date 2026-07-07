import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import {
    SUPABASE_TABLES,
    FOLDERS_SELECT_COLUMNS,
    EXPENSES_SELECT_COLUMNS,
    isMissingSupabaseTableError,
    isSupabasePolicyError,
} from '../lib/supabaseTables';

const getCurrentUserId = async () => {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user?.id) {
        throw error || new Error('Please log in to manage folders.');
    }

    return data.user.id;
};

const getSyncMessage = (error, entity = 'Data') => {
    if (isMissingSupabaseTableError(error)) {
        return `${entity} table missing. Create it in Supabase SQL Editor.`;
    }

    if (isSupabasePolicyError(error)) {
        return `${entity} permission blocked. Update the RLS policies in Supabase.`;
    }

    return error?.message || `Could not load ${entity.toLowerCase()}.`;
};

export const useFolderStore = create((set, get) => ({
    folders: [],
    expenses: [],
    isLoading: false,
    isSaving: false,
    error: null,

    // ─── Folders ──────────────────────────────────────

    loadFolders: async () => {
        set({ isLoading: true, error: null });

        try {
            const userId = await getCurrentUserId();

            const { data, error } = await supabase
                .from(SUPABASE_TABLES.FOLDERS)
                .select(FOLDERS_SELECT_COLUMNS)
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            set({ folders: Array.isArray(data) ? data : [] });
        } catch (error) {
            console.log('Folder load error:', error);
            set({ error: getSyncMessage(error, 'Folders') });
        } finally {
            set({ isLoading: false });
        }
    },

    addFolder: async ({ name, amount = 0, is_locked = false }) => {
        set({ isSaving: true });

        try {
            const userId = await getCurrentUserId();

            const { data, error } = await supabase
                .from(SUPABASE_TABLES.FOLDERS)
                .insert({
                    user_id: userId,
                    name: name.trim(),
                    amount,
                    is_locked,
                })
                .select(FOLDERS_SELECT_COLUMNS)
                .single();

            if (error) throw error;

            set({ folders: [data, ...get().folders] });
            return { folder: data };
        } catch (error) {
            console.log('Folder save error:', error);
            throw error;
        } finally {
            set({ isSaving: false });
        }
    },

    // ─── Expenses ─────────────────────────────────────

    loadExpenses: async folderId => {
        set({ isLoading: true, error: null });

        try {
            await getCurrentUserId();

            const { data, error } = await supabase
                .from(SUPABASE_TABLES.EXPENSES)
                .select(EXPENSES_SELECT_COLUMNS)
                .eq('folder_id', folderId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const expenses = Array.isArray(data) ? data : [];
            set({ expenses });
            return expenses;
        } catch (error) {
            console.log('Expense load error:', error);
            set({ error: getSyncMessage(error, 'Expenses') });
            return [];
        } finally {
            set({ isLoading: false });
        }
    },

    addExpense: async (folderId, { amount, note }) => {
        set({ isSaving: true });

        try {
            const userId = await getCurrentUserId();

            const { data, error } = await supabase
                .from(SUPABASE_TABLES.EXPENSES)
                .insert({
                    folder_id: folderId,
                    user_id: userId,
                    amount,
                    note: note?.trim() || 'Untitled expense',
                    date: new Date().toISOString(),
                })
                .select(EXPENSES_SELECT_COLUMNS)
                .single();

            if (error) throw error;

            const updatedExpenses = [data, ...get().expenses];
            set({ expenses: updatedExpenses });

            // Recalculate folder amount
            const newTotal = updatedExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
            await get().updateFolderAmount(folderId, newTotal);

            return { expense: data };
        } catch (error) {
            console.log('Expense save error:', error);
            throw error;
        } finally {
            set({ isSaving: false });
        }
    },

    deleteExpense: async (folderId, expenseId) => {
        try {
            const { error } = await supabase
                .from(SUPABASE_TABLES.EXPENSES)
                .delete()
                .eq('id', expenseId);

            if (error) throw error;

            const updatedExpenses = get().expenses.filter(e => e.id !== expenseId);
            set({ expenses: updatedExpenses });

            // Recalculate folder amount
            const newTotal = updatedExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
            await get().updateFolderAmount(folderId, newTotal);

            return updatedExpenses;
        } catch (error) {
            console.log('Expense delete error:', error);
            throw error;
        }
    },

    updateFolderAmount: async (folderId, newAmount) => {
        try {
            const { error } = await supabase
                .from(SUPABASE_TABLES.FOLDERS)
                .update({ amount: newAmount })
                .eq('id', folderId);

            if (error) throw error;

            // Update local state
            set({
                folders: get().folders.map(f =>
                    f.id === folderId ? { ...f, amount: newAmount } : f,
                ),
            });
        } catch (error) {
            console.log('Folder amount update error:', error);
        }
    },
}));
