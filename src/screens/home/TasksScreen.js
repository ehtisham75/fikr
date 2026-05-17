import React, { useCallback, useMemo } from 'react';
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
import { CalendarDays, Clock3, Plus, WifiOff } from 'lucide-react-native';
import { AppButton, AppContainer, AppText } from '../../components';
import { useTaskStore } from '../../store/taskStore';
import ROUTES from '../../utils/routes';
import { Fonts, Radius, icon, lineHeight, s, vs } from '../../theme/sizeMatter';

const TaskListItem = ({ item }) => {
  const { colors } = useTheme();
  const dueLabel = dayjs(`${item.due_date} ${item.due_time}`).format('MMM D, h:mm A');

  return (
    <View
      style={[
        styles.taskRow,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        },
      ]}>
      <View style={[styles.rowIcon, { backgroundColor: `${colors.primary}18` }]}>
        <Clock3 size={icon(18)} color={colors.primary} />
      </View>
      <View style={styles.rowCopy}>
        <AppText numberOfLines={1} style={styles.rowTitle}>
          {item.title}
        </AppText>
        {!!item.notes && (
          <AppText muted numberOfLines={2} style={styles.rowNotes}>
            {item.notes}
          </AppText>
        )}
        <AppText muted style={styles.rowMeta}>
          {dueLabel} • {item.priority}
        </AppText>
      </View>
      {item.sync_status === 'pending' && (
        <View style={[styles.syncPill, { backgroundColor: `${colors.warning}18` }]}>
          <WifiOff size={icon(14)} color={colors.warning} />
          <AppText style={[styles.syncText, { color: colors.warning }]}>Offline</AppText>
        </View>
      )}
    </View>
  );
};

const TasksScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const tasks = useTaskStore(state => state.tasks);
  const isLoading = useTaskStore(state => state.isLoading);
  const loadTasks = useTaskStore(state => state.loadTasks);

  const sortedTasks = useMemo(() => (
    [...tasks].sort((first, second) => {
      const firstTime = `${first.due_date || ''} ${first.due_time || '00:00'}`;
      const secondTime = `${second.due_date || ''} ${second.due_time || '00:00'}`;

      return firstTime.localeCompare(secondTime);
    })
  ), [tasks]);

  const todayCount = useMemo(() => {
    const today = dayjs().format('YYYY-MM-DD');
    return tasks.filter(task => task.due_date === today).length;
  }, [tasks]);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [loadTasks]),
  );

  const navigateToAddTask = () => {
    navigation.navigate(ROUTES.ADD_NEW_TASK);
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
        renderItem={({ item }) => <TaskListItem item={item} />}
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
  rowIcon: {
    width: s(38),
    height: s(38),
    borderRadius: Radius.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(12),
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
  syncPill: {
    minHeight: vs(28),
    borderRadius: Radius.round,
    paddingHorizontal: s(8),
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
  },
  syncText: {
    fontSize: Fonts.size.caption,
    fontWeight: Fonts.weight.bold,
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
