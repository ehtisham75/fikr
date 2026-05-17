import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { ArrowLeft, FolderPlus, Lock } from 'lucide-react-native';
import {
  AppButton,
  AppContainer,
  AppText,
  AppTextInput,
} from '../../components';
import { getFolders, saveFolders } from '../../utils/storage';
import { showToast } from '../../utils/helper';
import { Fonts, Radius, icon, lineHeight, s, vs } from '../../theme/sizeMatter';

const AddNewFolderScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [isLocked, setIsLocked] = useState(false);

  const handleSave = () => {
    const cleanName = name.trim();
    const numericAmount = Number(amount.replace(/,/g, '') || 0);

    if (!cleanName) {
      showToast('error', 'Add a name', 'Please enter a folder name.');
      return;
    }

    if (!Number.isFinite(numericAmount) || numericAmount < 0) {
      showToast('error', 'Check amount', 'Please enter a valid amount.');
      return;
    }

    const nextFolder = {
      id: `folder-${Date.now()}`,
      name: cleanName,
      amount: numericAmount,
      is_locked: isLocked,
    };

    saveFolders([nextFolder, ...getFolders()]);
    showToast('success', 'Folder created', `${cleanName} is ready.`);
    navigation.goBack();
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
              <AppText muted style={styles.eyebrow}>New folder</AppText>
              <AppText variant="heading" style={[styles.title, { color: colors.primary }]}>
                Organize a space
              </AppText>
            </View>
          </View>

          <View
            style={[
              styles.previewPanel,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}>
            <View style={[styles.previewIcon, { backgroundColor: `${colors.primary}18` }]}>
              <FolderPlus size={icon(22)} color={colors.primary} />
            </View>
            <View style={styles.previewCopy}>
              <AppText style={styles.previewTitle}>
                {name.trim() || 'Untitled folder'}
              </AppText>
              <AppText muted style={styles.previewSubtitle}>
                ${Number(amount.replace(/,/g, '') || 0).toFixed(2)}
              </AppText>
            </View>
          </View>

          <AppTextInput
            label="Folder name"
            value={name}
            onChangeText={setName}
            placeholder="Groceries, personal, subscriptions..."
          />
          <AppTextInput
            label="Starting amount"
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            keyboardType="decimal-pad"
          />

          <Pressable
            onPress={() => setIsLocked(current => !current)}
            style={[
              styles.lockRow,
              { borderColor: colors.border, backgroundColor: colors.card },
            ]}>
            <View style={[styles.lockIcon, { backgroundColor: `${colors.primary}18` }]}>
              <Lock size={icon(18)} color={colors.primary} />
            </View>
            <View style={styles.lockCopy}>
              <AppText style={styles.lockTitle}>Lock folder</AppText>
              <AppText muted style={styles.lockSubtitle}>
                Keep this folder marked as private
              </AppText>
            </View>
            <View
              style={[
                styles.toggle,
                {
                  backgroundColor: isLocked ? colors.primary : colors.border,
                },
              ]}>
              <View
                style={[
                  styles.toggleKnob,
                  {
                    backgroundColor: colors.white,
                    transform: [{ translateX: isLocked ? s(18) : 0 }],
                  },
                ]}
              />
            </View>
          </Pressable>

          <AppButton onPress={handleSave} style={styles.saveButton}>
            Save Folder
          </AppButton>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppContainer>
  );
};

export default AddNewFolderScreen;

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
    minHeight: vs(78),
    borderRadius: Radius.lg,
    borderWidth: 1,
    paddingHorizontal: s(14),
    paddingVertical: vs(12),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(20),
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
  },
  previewTitle: {
    fontSize: Fonts.size.body,
    fontWeight: Fonts.weight.bold,
  },
  previewSubtitle: {
    fontSize: Fonts.size.bodySmall,
    marginTop: vs(2),
  },
  lockRow: {
    borderWidth: 1,
    borderRadius: Radius.lg,
    paddingHorizontal: s(14),
    paddingVertical: vs(12),
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(4),
  },
  lockIcon: {
    width: s(36),
    height: s(36),
    borderRadius: Radius.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(12),
  },
  lockCopy: {
    flex: 1,
    paddingRight: s(10),
  },
  lockTitle: {
    fontSize: Fonts.size.body,
    fontWeight: Fonts.weight.bold,
  },
  lockSubtitle: {
    fontSize: Fonts.size.caption,
    marginTop: vs(2),
  },
  toggle: {
    width: s(44),
    height: vs(26),
    borderRadius: Radius.round,
    padding: s(3),
  },
  toggleKnob: {
    width: s(20),
    height: s(20),
    borderRadius: Radius.round,
  },
  saveButton: {
    marginTop: vs(18),
  },
});
