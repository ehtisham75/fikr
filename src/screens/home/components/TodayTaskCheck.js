import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import dayjs from 'dayjs';
import { useTheme } from '@react-navigation/native';
import { CalendarCheck2, Clock3 } from 'lucide-react-native';
import { AppButton, AppText } from '../../../components';
import { Fonts, Radius, icon, lineHeight, s, vs } from '../../../theme/sizeMatter';

const priorityLabel = priority => {
  if (!priority) {
    return 'Medium';
  }

  return priority.charAt(0).toUpperCase() + priority.slice(1);
};

const TodayTaskCheck = ({ nextTask, onAddTask, onOpenTasks }) => {
  const { colors } = useTheme();
  const todayLabel = dayjs().format('dddd, MMM D');

  if (!nextTask) {
    return (
      <View
        style={[
          styles.emptyPanel,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}>
        <View style={[styles.iconWrap, { backgroundColor: `${colors.primary}18` }]}>
          <CalendarCheck2 size={icon(22)} color={colors.primary} />
        </View>
        <View style={styles.emptyCopy}>
          <AppText style={styles.panelTitle}>No tasks for today</AppText>
          <AppText muted style={styles.panelSubtitle}>{todayLabel}</AppText>
        </View>
        <AppButton onPress={onAddTask} style={styles.addButton}>
          Add Task
        </AppButton>
      </View>
    );
  }

  return (
    <Pressable
      onPress={onOpenTasks}
      style={({ pressed }) => [
        styles.taskCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        },
        pressed && styles.cardPressed,
      ]}>
      <View style={styles.taskHeader}>
        <View style={[styles.iconWrap, { backgroundColor: `${colors.primary}18` }]}>
          <Clock3 size={icon(20)} color={colors.primary} />
        </View>
        <View style={styles.taskTitleWrap}>
          <AppText muted style={styles.upNext}>Up next today</AppText>
          <AppText numberOfLines={1} style={styles.taskTitle}>
            {nextTask.title}
          </AppText>
        </View>
      </View>
      <View style={styles.taskMetaRow}>
        <AppText muted style={styles.taskMeta}>
          {dayjs(`${nextTask.due_date} ${nextTask.due_time}`).format('h:mm A')}
        </AppText>
        <View style={[styles.priorityPill, { backgroundColor: `${colors.primary}16` }]}>
          <AppText style={[styles.priorityText, { color: colors.primary }]}>
            {priorityLabel(nextTask.priority)}
          </AppText>
        </View>
      </View>
    </Pressable>
  );
};

export default TodayTaskCheck;

const styles = StyleSheet.create({
  emptyPanel: {
    minHeight: vs(86),
    borderWidth: 1,
    borderRadius: Radius.lg,
    paddingHorizontal: s(14),
    paddingVertical: vs(12),
    marginHorizontal: s(24),
    marginBottom: vs(18),
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: s(40),
    height: s(40),
    borderRadius: Radius.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(12),
  },
  emptyCopy: {
    flex: 1,
    paddingRight: s(10),
  },
  panelTitle: {
    fontSize: Fonts.size.body,
    fontWeight: Fonts.weight.bold,
    lineHeight: lineHeight(16, 1.2),
  },
  panelSubtitle: {
    fontSize: Fonts.size.caption,
    marginTop: vs(2),
  },
  addButton: {
    height: vs(34),
    paddingHorizontal: s(12),
    gap: s(6),
  },
  taskCard: {
    minHeight: vs(106),
    borderWidth: 1,
    borderRadius: Radius.lg,
    paddingHorizontal: s(16),
    paddingVertical: vs(14),
    marginHorizontal: s(24),
    marginBottom: vs(18),
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: vs(4) },
        shadowOpacity: 0.05,
        shadowRadius: s(10),
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskTitleWrap: {
    flex: 1,
  },
  upNext: {
    fontSize: Fonts.size.caption,
    fontWeight: Fonts.weight.bold,
    textTransform: 'uppercase',
  },
  taskTitle: {
    fontSize: Fonts.size.subtitle,
    fontWeight: Fonts.weight.bold,
    lineHeight: lineHeight(18, 1.2),
    marginTop: vs(2),
  },
  taskMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: vs(12),
  },
  taskMeta: {
    fontSize: Fonts.size.bodySmall,
  },
  priorityPill: {
    borderRadius: Radius.round,
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
  },
  priorityText: {
    fontSize: Fonts.size.caption,
    fontWeight: Fonts.weight.bold,
  },
});
