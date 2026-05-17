import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import dayjs from 'dayjs';
import { useTheme } from '@react-navigation/native';
import { ArrowLeft, CalendarDays, CloudOff, Clock3 } from 'lucide-react-native';
import {
  AppButton,
  AppContainer,
  AppText,
  AppTextInput,
} from '../../components';
import { useTaskStore } from '../../store/taskStore';
import { showToast } from '../../utils/helper';
import {
  isMissingSupabaseTableError,
  isSupabasePolicyError,
} from '../../lib/supabaseTables';
import { Fonts, Radius, icon, lineHeight, s, vs } from '../../theme/sizeMatter';

const PRIORITIES = ['low', 'medium', 'high'];

const AddNewTaskScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const addTask = useTaskStore(state => state.addTask);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [dueTime, setDueTime] = useState(dayjs().add(1, 'hour').format('HH:mm'));
  const [priority, setPriority] = useState('medium');
  const [isSaving, setIsSaving] = useState(false);

  const previewDate = useMemo(() => {
    const parsedDate = dayjs(`${dueDate} ${dueTime}`, 'YYYY-MM-DD HH:mm');
    return parsedDate.isValid() ? parsedDate.format('dddd, MMM D [at] h:mm A') : 'Set date and time';
  }, [dueDate, dueTime]);

  const handleSave = async () => {
    const cleanTitle = title.trim();
    const cleanDate = dueDate.trim();
    const cleanTime = dueTime.trim();

    if (!cleanTitle) {
      showToast('error', 'Add a title', 'Please enter a task title.');
      return;
    }

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(cleanDate) ||
      !dayjs(cleanDate).isValid() ||
      dayjs(cleanDate).format('YYYY-MM-DD') !== cleanDate
    ) {
      showToast('error', 'Check date', 'Use YYYY-MM-DD format.');
      return;
    }

    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(cleanTime)) {
      showToast('error', 'Check time', 'Use HH:mm format.');
      return;
    }

    setIsSaving(true);

    try {
      const result = await addTask({
        title: cleanTitle,
        notes,
        due_date: cleanDate,
        due_time: cleanTime,
        priority,
      });

      if (result.offline) {
        const error = result.error;

        if (isMissingSupabaseTableError(error)) {
          showToast('error', 'Task saved offline', 'Create the tasks table in Supabase, then reopen the app to sync.');
        } else if (isSupabasePolicyError(error)) {
          showToast('error', 'Task saved offline', 'Update the tasks RLS policies in Supabase to sync.');
        } else {
          showToast('success', 'Task saved offline', 'It will sync automatically when Supabase is reachable.');
        }
      } else {
        showToast('success', 'Task added', `${cleanTitle} is on your list.`);
      }

      navigation.goBack();
    } catch (error) {
      setIsSaving(false);
      console.log(' ==== AddTask catch error 2====', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppContainer contentStyle={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Pressable onPress={navigation.goBack} style={styles.backButton}>
              <ArrowLeft size={icon(22)} color={colors.text} />
            </Pressable>
            <View style={styles.headerCopy}>
              <AppText muted style={styles.eyebrow}>New task</AppText>
              <AppText variant="heading" style={[styles.title, { color: colors.primary }]}>
                Plan the next thing
              </AppText>
            </View>
          </View>

          <View
            style={[
              styles.previewPanel,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}>
            <View style={[styles.previewIcon, { backgroundColor: `${colors.primary}18` }]}>
              <CalendarDays size={icon(22)} color={colors.primary} />
            </View>
            <View style={styles.previewCopy}>
              <AppText style={styles.previewTitle}>{previewDate}</AppText>
              <AppText muted style={styles.previewSubtitle}>
                Saved locally first, synced to Supabase when available
              </AppText>
            </View>
            <CloudOff size={icon(18)} color={colors.textSecondary} />
          </View>

          <View style={styles.form}>
            <AppTextInput
              label="Task title"
              value={title}
              onChangeText={setTitle}
              placeholder="Review invoices, call vendor..."
              returnKeyType="next"
            />
            <AppTextInput
              label="Notes"
              value={notes}
              onChangeText={setNotes}
              placeholder="Add context or details"
              multiline
              style={styles.notesInput}
              inputContainerStyle={styles.notesInputContainer}
              containerStyle={styles.notesContainer}
              textAlignVertical="top"
            />
            <View style={styles.timeRow}>
              <AppTextInput
                label="Date"
                value={dueDate}
                onChangeText={setDueDate}
                placeholder="YYYY-MM-DD"
                containerStyle={styles.timeField}
              />
              <AppTextInput
                label="Time"
                value={dueTime}
                onChangeText={setDueTime}
                placeholder="HH:mm"
                containerStyle={styles.timeField}
              />
            </View>

            <View style={styles.priorityBlock}>
              <AppText muted style={styles.fieldLabel}>Priority</AppText>
              <View style={[styles.priorityGroup, { borderColor: colors.border }]}>
                {PRIORITIES.map(item => {
                  const isActive = priority === item;

                  return (
                    <Pressable
                      key={item}
                      onPress={() => setPriority(item)}
                      style={[
                        styles.priorityOption,
                        isActive && { backgroundColor: colors.primary },
                      ]}>
                      <AppText
                        style={[
                          styles.priorityText,
                          { color: isActive ? colors.white : colors.textSecondary },
                        ]}>
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                      </AppText>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={[styles.hint, { borderColor: colors.border }]}>
              <Clock3 size={icon(17)} color={colors.textSecondary} />
              <AppText muted style={styles.hintText}>
                Tasks created offline appear on Home immediately and sync on the next successful load.
              </AppText>
            </View>

            <AppButton
              onPress={handleSave}
              disabled={isSaving}
              style={styles.saveButton}>
              {isSaving ? 'Saving...' : 'Save Task'}
            </AppButton>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppContainer>
  );
};

export default AddNewTaskScreen;

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: s(24),
    paddingTop: vs(14),
    paddingBottom: vs(42),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(18),
  },
  backButton: {
    width: s(40),
    height: s(40),
    borderRadius: Radius.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(10),
  },
  headerCopy: {
    flex: 1,
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
  previewPanel: {
    minHeight: vs(82),
    borderRadius: Radius.lg,
    borderWidth: 1,
    paddingHorizontal: s(14),
    paddingVertical: vs(12),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(22),
  },
  previewIcon: {
    width: s(42),
    height: s(42),
    borderRadius: Radius.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(12),
  },
  previewCopy: {
    flex: 1,
    paddingRight: s(10),
  },
  previewTitle: {
    fontSize: Fonts.size.body,
    fontWeight: Fonts.weight.bold,
    lineHeight: lineHeight(16, 1.2),
  },
  previewSubtitle: {
    fontSize: Fonts.size.caption,
    marginTop: vs(3),
  },
  form: {
    paddingBottom: vs(18),
  },
  notesContainer: {
    marginBottom: vs(12),
  },
  notesInput: {
    paddingTop: vs(8),
  },
  notesInputContainer: {
    minHeight: vs(88),
    alignItems: 'flex-start',
  },
  timeRow: {
    flexDirection: 'row',
    gap: s(12),
  },
  timeField: {
    flex: 1,
  },
  priorityBlock: {
    marginTop: vs(2),
    marginBottom: vs(14),
  },
  fieldLabel: {
    marginBottom: vs(6),
    fontSize: Fonts.size.small,
    fontWeight: Fonts.weight.medium,
  },
  priorityGroup: {
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: s(4),
    flexDirection: 'row',
  },
  priorityOption: {
    flex: 1,
    minHeight: vs(34),
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityText: {
    fontSize: Fonts.size.bodySmall,
    fontWeight: Fonts.weight.bold,
  },
  hint: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: Radius.md,
    paddingHorizontal: s(12),
    paddingVertical: vs(10),
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: vs(16),
  },
  hintText: {
    flex: 1,
    fontSize: Fonts.size.caption,
    lineHeight: lineHeight(12, 1.35),
    marginLeft: s(8),
  },
  saveButton: {
    marginTop: vs(4),
  },
});
