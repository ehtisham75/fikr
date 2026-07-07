import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import dayjs from 'dayjs';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { CalendarDays, Clock3, Plus, WifiOff, CheckCircle2, Circle, Trash2 } from 'lucide-react-native';
import { AppButton, AppContainer, AppText, LoginBottomSheet } from '../../components';
import { useTaskStore } from '../../store/taskStore';
import { useAuthStore } from '../../store/authStore';
import ROUTES from '../../utils/routes';
import { showToast } from '../../utils/helper';
import { Fonts, Radius, icon, lineHeight, s, vs } from '../../theme/sizeMatter';

const TaskListItem = ({ item, onToggle, onDelete }) => {
  const { colors } = useTheme();
  const dueLabel = dayjs(`${item.due_date} ${item.due_time}`).format('MMM D, h:mm A');
  const isCompleted = !!item.is_completed;

  return (
    <View
      style={[
        styles.taskRow,
        {
          backgroundColor: colors.card,
          borderColor: isCompleted ? colors.border : colors.border,
          shadowColor: colors.shadow,
          opacity: isCompleted ? 0.6 : 1,
        },
      ]}>
      <Pressable
        onPress={() => onToggle(item.id)}
        hitSlop={8}
        style={({ pressed }) => [
          styles.checkContainer,
          pressed && { opacity: 0.7 }
        ]}>
        {isCompleted ? (
          <CheckCircle2 size={icon(20)} color={colors.primary} />
        ) : (
          <Circle size={icon(20)} color={colors.textSecondary} />
        )}
      </Pressable>

      <View style={styles.rowCopy}>
        <AppText
          numberOfLines={1}
          style={[
            styles.rowTitle,
            isCompleted && { textDecorationLine: 'line-through', color: colors.textSecondary }
          ]}>
          {item.title}
        </AppText>
        {!!item.notes && (
          <AppText
            muted
            numberOfLines={2}
            style={[
              styles.rowNotes,
              isCompleted && { textDecorationLine: 'line-through' }
            ]}>
            {item.notes}
          </AppText>
        )}
        <AppText muted style={styles.rowMeta}>
          {dueLabel} • {item.priority}
        </AppText>
      </View>

      <View style={styles.rightActions}>
        {item.sync_status === 'pending' && (
          <View style={[styles.syncPill, { backgroundColor: `${colors.warning}18`, marginRight: s(6) }]}>
            <WifiOff size={icon(12)} color={colors.warning} />
          </View>
        )}
        <Pressable
          onPress={() => onDelete(item.id)}
          hitSlop={8}
          style={({ pressed }) => [
            styles.deleteButton,
            { backgroundColor: `${colors.error}14` },
            pressed && { opacity: 0.6 },
          ]}>
          <Trash2 size={icon(16)} color={colors.error} />
        </Pressable>
      </View>
    </View>
  );
};

const TasksScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const tasks = useTaskStore(state => state.tasks);
  const isLoading = useTaskStore(state => state.isLoading);
  const loadTasks = useTaskStore(state => state.loadTasks);
  const toggleTask = useTaskStore(state => state.toggleTask);
  const deleteTask = useTaskStore(state => state.deleteTask);
  const [showLoginSheet, setShowLoginSheet] = useState(false);

  const user = useAuthStore(state => state.user);
  const isLoggedIn = !!user;

  const sortedTasks = useMemo(() => {
    // Sort tasks: incomplete ones first, then completed ones. Within each group, sort by due time.
    const sorted = [...tasks].sort((first, second) => {
      const firstTime = `${first.due_date || ''} ${first.due_time || '00:00'}`;
      const secondTime = `${second.due_date || ''} ${second.due_time || '00:00'}`;
      return firstTime.localeCompare(secondTime);
    });

    const incomplete = sorted.filter(t => !t.is_completed);
    const completed = sorted.filter(t => t.is_completed);

    return [...incomplete, ...completed];
  }, [tasks]);

  const todayCount = useMemo(() => {
    const today = dayjs().format('YYYY-MM-DD');
    return tasks.filter(task => task.due_date === today).length;
  }, [tasks]);

  useFocusEffect(
    useCallback(() => {
      if (isLoggedIn) {
        loadTasks();
      }
    }, [isLoggedIn, loadTasks]),
  );

  const navigateToAddTask = () => {
    if (!isLoggedIn) {
      setShowLoginSheet(true);
      return;
    }
    navigation.navigate(ROUTES.ADD_NEW_TASK);
  };

  const handleLoginPress = () => {
    navigation.navigate(ROUTES.SIGN_IN);
  };

  const handleToggleTask = async (taskId) => {
    try {
      await toggleTask(taskId);
    } catch (error) {
      showToast('error', 'Update failed', error.message || 'Could not update task.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      showToast('success', 'Task deleted', 'Task has been removed.');
    } catch (error) {
      showToast('error', 'Delete failed', error.message || 'Could not delete task.');
    }
  };

  const renderEmpty = () => {
    if (isLoading) {
      return null;
    }

    return (
      <View style={[styles.emptyState, { borderColor: colors.border }]}>
        <CalendarDays size={icon(28)} color={colors.textSecondary} />
        <AppText muted style={styles.emptyText}>
          No tasks yet.
        </AppText>
        <AppButton onPress={navigateToAddTask} style={styles.emptyButton}>
          Add Task
        </AppButton>
      </View>
    );
  };

  return (
    <AppContainer contentStyle={styles.screen}>
      <FlatList
        data={sortedTasks}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <TaskListItem
            item={item}
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
          />
        )}
        ListHeaderComponent={(
          <View>
            <View style={styles.header}>
              <View style={styles.headerCopy}>
                <AppText muted style={styles.eyebrow}>Tasks</AppText>
                <AppText variant="heading" style={[styles.title, { color: colors.primary }]}>
                  Task list
                </AppText>
                <AppText muted style={styles.subtitle}>
                  {todayCount} today • {tasks.length} total
                </AppText>
              </View>
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Pressable
                  onPress={navigateToAddTask}
                  style={[styles.addIconButton, { backgroundColor: colors.primary }]}>
                  <Plus size={icon(20)} color={colors.white} />
                </Pressable>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={(
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadTasks}
            tintColor={colors.primary}
          />
        )}
      />

      <LoginBottomSheet
        visible={showLoginSheet}
        onClose={() => setShowLoginSheet(false)}
        onLogin={handleLoginPress}
      />
    </AppContainer>
  );
};

export default TasksScreen;

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
  },
  content: {
    paddingHorizontal: s(24),
    paddingTop: vs(14),
    paddingBottom: vs(108),
  },
  header: {
    minHeight: vs(76),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(16),
  },
  headerCopy: {
    flex: 1,
    paddingRight: s(12),
  },
  eyebrow: {
    fontSize: Fonts.size.caption,
    fontWeight: Fonts.weight.bold,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: Fonts.size.heading,
    lineHeight: lineHeight(30, 1.2),
  },
  subtitle: {
    fontSize: Fonts.size.bodySmall,
    marginTop: vs(2),
  },
  addIconButton: {
    width: s(42),
    height: s(42),
    borderRadius: Radius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskRow: {
    minHeight: vs(82),
    borderRadius: Radius.lg,
    borderWidth: 1,
    paddingHorizontal: s(14),
    paddingVertical: vs(12),
    marginBottom: vs(12),
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkContainer: {
    marginRight: s(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowCopy: {
    flex: 1,
    paddingRight: s(8),
  },
  rowTitle: {
    fontSize: Fonts.size.body,
    fontWeight: Fonts.weight.bold,
    lineHeight: lineHeight(16, 1.2),
  },
  rowNotes: {
    fontSize: Fonts.size.caption,
    marginTop: vs(3),
  },
  rowMeta: {
    fontSize: Fonts.size.caption,
    marginTop: vs(4),
    textTransform: 'capitalize',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    width: s(34),
    height: s(34),
    borderRadius: Radius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncPill: {
    minHeight: vs(24),
    width: s(24),
    borderRadius: Radius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: Radius.lg,
    paddingHorizontal: s(16),
    paddingVertical: vs(28),
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: Fonts.size.bodySmall,
    marginTop: vs(8),
    marginBottom: vs(12),
  },
  emptyButton: {
    minWidth: s(120),
  },
});
