import dayjs from 'dayjs';
import { create } from 'zustand';
import { storage } from '../utils/storage';
import { supabase } from '../lib/supabase';
import {
  SUPABASE_TABLES,
  TASKS_SELECT_COLUMNS,
  isMissingSupabaseTableError,
  isSupabasePolicyError,
} from '../lib/supabaseTables';

const TASKS_KEY = 'fikr_tasks';
const PENDING_TASKS_KEY = 'fikr_pending_tasks';

const readArray = key => {
  const value = storage.getString(key);

  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const saveArray = (key, value) => {
  storage.set(key, JSON.stringify(value));
};

const getCurrentUserId = async () => {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user?.id) {
    throw error || new Error('Please log in to sync tasks.');
  }

  return data.user.id;
};

const sortTasks = tasks => [...tasks].sort((first, second) => {
  const firstTime = `${first.due_date || ''} ${first.due_time || '00:00'}`;
  const secondTime = `${second.due_date || ''} ${second.due_time || '00:00'}`;

  return firstTime.localeCompare(secondTime);
});

const normalizeTask = task => ({
  ...task,
  is_completed: Boolean(task.is_completed),
  sync_status: task.sync_status || 'synced',
});

const getTaskSyncMessage = error => {
  if (isMissingSupabaseTableError(error)) {
    return 'Tasks are saved offline. Run the tasks table SQL in Supabase, then reopen the app to sync.';
  }

  if (isSupabasePolicyError(error)) {
    return 'Tasks are saved offline. Update the tasks RLS policies in Supabase to sync.';
  }

  return error?.message || 'Tasks are available offline.';
};

const mergeTasks = (localTasks, remoteTasks) => {
  const byId = new Map();

  sortTasks([...remoteTasks.map(normalizeTask), ...localTasks]).forEach(task => {
    byId.set(String(task.id), task);
  });

  return sortTasks(Array.from(byId.values()));
};

export const useTaskStore = create((set, get) => ({
  tasks: sortTasks(readArray(TASKS_KEY)),
  pendingTasks: readArray(PENDING_TASKS_KEY),
  isLoading: false,
  isSyncing: false,
  error: null,

  hydrate: () => {
    set({
      tasks: sortTasks(readArray(TASKS_KEY)),
      pendingTasks: readArray(PENDING_TASKS_KEY),
    });
  },

  loadTasks: async () => {
    set({ isLoading: true, error: null });
    get().hydrate();

    try {
      await getCurrentUserId();
      await get().syncPendingTasks();

      const { data, error } = await supabase
        .from(SUPABASE_TABLES.TASKS)
        .select(TASKS_SELECT_COLUMNS)
        .order('due_date', { ascending: true })
        .order('due_time', { ascending: true });

      if (error) {
        throw error;
      }

      const mergedTasks = mergeTasks(readArray(TASKS_KEY), data || []);
      saveArray(TASKS_KEY, mergedTasks);
      set({ tasks: mergedTasks, error: null });
    } catch (error) {
      if (isMissingSupabaseTableError(error)) {
        console.log('Create tasks table SQL:', error);
      } else if (isSupabasePolicyError(error)) {
        console.log('Tasks table policy SQL:', error);
      } else {
        console.log('Task load error:', error);
      }

      set({ error: getTaskSyncMessage(error) });
    } finally {
      set({ isLoading: false });
    }
  },

  addTask: async values => {
    const now = dayjs().toISOString();
    const userId = await getCurrentUserId();
    const localId = `local-${Date.now()}`;
    const task = normalizeTask({
      id: localId,
      user_id: userId,
      title: values.title.trim(),
      notes: values.notes.trim(),
      due_date: values.due_date,
      due_time: values.due_time,
      priority: values.priority,
      is_completed: false,
      created_at: now,
      updated_at: now,
      sync_status: 'pending',
    });

    const nextTasks = sortTasks([task, ...get().tasks]);
    const nextPending = [task, ...get().pendingTasks];
    saveArray(TASKS_KEY, nextTasks);
    saveArray(PENDING_TASKS_KEY, nextPending);
    set({ tasks: nextTasks, pendingTasks: nextPending });

    try {
      const payload = {
        title: task.title,
        user_id: userId,
        notes: task.notes,
        due_date: task.due_date,
        due_time: task.due_time,
        priority: task.priority,
        is_completed: task.is_completed,
      };

      const { data, error } = await supabase
        .from(SUPABASE_TABLES.TASKS)
        .insert(payload)
        .select(TASKS_SELECT_COLUMNS)
        .single();

      if (error) {
        throw error;
      }

      const syncedTask = normalizeTask(data);
      const tasks = sortTasks(get().tasks.map(item => (
        item.id === localId ? syncedTask : item
      )));
      const pendingTasks = get().pendingTasks.filter(item => item.id !== localId);

      saveArray(TASKS_KEY, tasks);
      saveArray(PENDING_TASKS_KEY, pendingTasks);
      set({ tasks, pendingTasks });

      return { task: syncedTask, offline: false };
    } catch (error) {
      if (isMissingSupabaseTableError(error)) {
        console.log('Create tasks table SQL:', error);
      } else if (isSupabasePolicyError(error)) {
        console.log('Tasks table policy SQL:', error);
      } else {
        console.log('Task save queued:', error);
      }

      return { task, offline: true, error };
    }
  },

  syncPendingTasks: async () => {
    const pendingTasks = readArray(PENDING_TASKS_KEY);

    if (!pendingTasks.length) {
      return;
    }

    set({ isSyncing: true });

    try {
      const syncedIds = [];
      const syncedTasks = [];
      const userId = await getCurrentUserId();

      for (const task of pendingTasks) {
        const { data, error } = await supabase
          .from(SUPABASE_TABLES.TASKS)
          .insert({
            user_id: userId,
            title: task.title,
            notes: task.notes,
            due_date: task.due_date,
            due_time: task.due_time,
            priority: task.priority,
            is_completed: task.is_completed,
          })
          .select(TASKS_SELECT_COLUMNS)
          .single();

        if (error) {
          throw error;
        }

        syncedIds.push(task.id);
        syncedTasks.push(normalizeTask(data));
      }

      const localTasks = readArray(TASKS_KEY).filter(task => !syncedIds.includes(task.id));
      const tasks = mergeTasks(localTasks, syncedTasks);
      const remainingPending = pendingTasks.filter(task => !syncedIds.includes(task.id));

      saveArray(TASKS_KEY, tasks);
      saveArray(PENDING_TASKS_KEY, remainingPending);
      set({ tasks, pendingTasks: remainingPending });
    } finally {
      set({ isSyncing: false });
    }
  },
}));

export const getTodayTasks = tasks => {
  const today = dayjs().format('YYYY-MM-DD');

  return sortTasks(tasks.filter(task => task.due_date === today));
};

export const getNextTodayTask = tasks => (
  getTodayTasks(tasks).find(task => !task.is_completed) || getTodayTasks(tasks)[0] || null
);
