import React, { useCallback, useState } from 'react';
import {
    FlatList,
    Keyboard,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    View,
} from 'react-native';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { ArrowLeft, Plus, Receipt, Trash2 } from 'lucide-react-native';
import {
    AppButton,
    AppContainer,
    AppKeyboardAvoidingView,
    AppText,
    AppTextInput,
} from '../../components';
import { useFolderStore } from '../../store/folderStore';
import { showToast } from '../../utils/helper';
import { Fonts, Radius, icon, lineHeight, s, vs } from '../../theme/sizeMatter';

const FolderDetailsScreen = ({ navigation, route }) => {
    const { colors } = useTheme();
    const folder = route.params?.folder;

    const expenses = useFolderStore(state => state.expenses);
    const storeLoadExpenses = useFolderStore(state => state.loadExpenses);
    const storeAddExpense = useFolderStore(state => state.addExpense);
    const storeDeleteExpense = useFolderStore(state => state.deleteExpense);
    const isSaving = useFolderStore(state => state.isSaving);

    const [totalAmount, setTotalAmount] = useState(folder?.amount ?? 0);

    // ─── Add-expense modal state ────────────────────────
    const [modalVisible, setModalVisible] = useState(false);
    const [newAmount, setNewAmount] = useState('');
    const [newNote, setNewNote] = useState('');

    // ─── Load expenses on focus ────────────────────────
    useFocusEffect(
        useCallback(() => {
            if (!folder?.id) return;
            storeLoadExpenses(folder.id).then(loaded => {
                setTotalAmount(loaded.reduce((sum, e) => sum + Number(e.amount || 0), 0));
            });
        }, [folder?.id, storeLoadExpenses]),
    );

    // ─── Handlers ──────────────────────────────────────
    const handleAddExpense = async () => {
        Keyboard.dismiss();
        const parsed = Number(newAmount.replace(/,/g, ''));
        if (!Number.isFinite(parsed) || parsed <= 0) {
            showToast('error', 'Invalid amount', 'Please enter a valid amount.');
            return;
        }

        try {
            await storeAddExpense(folder.id, {
                amount: parsed,
                note: newNote.trim() || 'Untitled expense',
            });

            setNewAmount('');
            setNewNote('');
            setModalVisible(false);

            const updated = useFolderStore.getState().expenses;
            setTotalAmount(updated.reduce((sum, e) => sum + Number(e.amount || 0), 0));
            showToast('success', 'Expense added', `$${parsed.toFixed(2)} recorded.`);
        } catch (error) {
            showToast('error', 'Could not save', error.message || 'Please try again.');
        }
    };

    const handleDeleteExpense = async expenseId => {
        try {
            await storeDeleteExpense(folder.id, expenseId);
            const updated = useFolderStore.getState().expenses;
            setTotalAmount(updated.reduce((sum, e) => sum + Number(e.amount || 0), 0));
            showToast('success', 'Removed', 'Expense deleted.');
        } catch (error) {
            showToast('error', 'Could not delete', error.message || 'Please try again.');
        }
    };

    // ─── Formatters ────────────────────────────────────
    const formatDate = iso => {
        const d = new Date(iso);
        return d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    // ─── Render helpers ────────────────────────────────
    const renderExpenseItem = ({ item }) => (
        <View
            style={[
                styles.expenseRow,
                { backgroundColor: colors.card, borderColor: colors.cardBorder },
            ]}>
            <View style={styles.expenseContent}>
                <AppText style={styles.expenseNote} numberOfLines={1}>
                    {item.note}
                </AppText>
                <AppText muted style={styles.expenseDate}>
                    {formatDate(item.date)}
                </AppText>
            </View>
            <AppText style={[styles.expenseAmount, { color: colors.primary }]}>
                ${item.amount.toFixed(2)}
            </AppText>
            <Pressable
                onPress={() => handleDeleteExpense(item.id)}
                hitSlop={10}
                style={({ pressed }) => [
                    styles.deleteButton,
                    { backgroundColor: `${colors.error}14` },
                    pressed && { opacity: 0.6 },
                ]}>
                <Trash2 size={icon(16)} color={colors.error} />
            </Pressable>
        </View>
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <View
                style={[styles.emptyIconWrap, { backgroundColor: `${colors.primary}18` }]}>
                <Receipt size={icon(34)} color={colors.primary} />
            </View>
            <AppText style={styles.emptyTitle}>No expenses yet</AppText>
            <AppText muted style={styles.emptySubtitle}>
                Tap the + button to record your first expense in this folder.
            </AppText>
        </View>
    );

    const listHeader = (
        <>
            {/* ─── Header ────────────────────────────────────── */}
            <View style={styles.header}>
                <Pressable onPress={navigation.goBack} style={styles.backButton}>
                    <ArrowLeft size={icon(22)} color={colors.text} />
                </Pressable>
                <View style={styles.headerCopy}>
                    <AppText muted style={styles.eyebrow}>Folder</AppText>
                    <AppText variant="heading" style={[styles.title, { color: colors.primary }]}>
                        {folder?.name ?? 'Untitled'}
                    </AppText>
                </View>
            </View>

            {/* ─── Total card ────────────────────────────────── */}
            <View
                style={[
                    styles.totalCard,
                    { backgroundColor: colors.card, borderColor: colors.cardBorder },
                ]}>
                <AppText muted style={styles.totalLabel}>Total spent</AppText>
                <AppText style={[styles.totalValue, { color: colors.text }]}>
                    ${totalAmount.toFixed(2)}
                </AppText>
                <AppText muted style={styles.totalCount}>
                    {expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'}
                </AppText>
            </View>

            {/* ─── Section label ─────────────────────────────── */}
            {expenses.length > 0 && (
                <AppText muted style={styles.sectionLabel}>Recent expenses</AppText>
            )}
        </>
    );

    // ─── Screen ────────────────────────────────────────
    return (
        <AppContainer contentStyle={styles.screen}>
            <FlatList
                data={expenses}
                keyExtractor={item => item.id}
                renderItem={renderExpenseItem}
                ListHeaderComponent={listHeader}
                ListEmptyComponent={renderEmpty}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </AppContainer>
    );
};

export default FolderDetailsScreen;

const styles = StyleSheet.create({
    screen: {
        paddingHorizontal: 0,
        paddingTop: 0,
    },
    listContent: {
        paddingHorizontal: s(24),
        paddingTop: vs(14),
        paddingBottom: vs(112),
        gap: vs(10),
    },

    // Header
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

    // Total card
    totalCard: {
        borderRadius: Radius.xl,
        borderWidth: 1,
        paddingHorizontal: s(20),
        paddingVertical: vs(18),
        marginBottom: vs(10),
        ...Platform.select({
            ios: {
                shadowOffset: { width: 0, height: vs(4) },
                shadowOpacity: 0.05,
                shadowRadius: s(10),
            },
            android: { elevation: 3 },
        }),
    },
    totalLabel: {
        fontSize: Fonts.size.caption,
        fontWeight: Fonts.weight.bold,
        textTransform: 'uppercase',
        marginBottom: vs(4),
    },
    totalValue: {
        fontSize: Fonts.size.heading,
        fontWeight: Fonts.weight.extraBold,
        lineHeight: lineHeight(30, 1.2),
    },
    totalCount: {
        fontSize: Fonts.size.caption,
        marginTop: vs(4),
    },

    // Section
    sectionLabel: {
        fontSize: Fonts.size.caption,
        fontWeight: Fonts.weight.bold,
        textTransform: 'uppercase',
        marginTop: vs(8),
    },

    // Expense row
    expenseRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: Radius.lg,
        borderWidth: 1,
        paddingHorizontal: s(16),
        paddingVertical: vs(14),
    },
    expenseContent: {
        flex: 1,
        marginRight: s(12),
    },
    expenseNote: {
        fontSize: Fonts.size.body,
        fontWeight: Fonts.weight.semiBold,
    },
    expenseDate: {
        fontSize: Fonts.size.caption,
        marginTop: vs(2),
    },
    expenseAmount: {
        fontSize: Fonts.size.body,
        fontWeight: Fonts.weight.bold,
        marginRight: s(12),
    },
    deleteButton: {
        width: s(34),
        height: s(34),
        borderRadius: Radius.round,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Empty state
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: s(32),
        paddingVertical: vs(40),
        marginTop: vs(20),
    },
    emptyIconWrap: {
        width: s(72),
        height: s(72),
        borderRadius: Radius.round,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: vs(16),
    },
    emptyTitle: {
        fontSize: Fonts.size.subtitle,
        fontWeight: Fonts.weight.bold,
        marginBottom: vs(8),
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: Fonts.size.bodySmall,
        lineHeight: lineHeight(18, 1.3),
        textAlign: 'center',
    },

    // FAB
    fab: {
        position: 'absolute',
        bottom: vs(32),
        right: s(24),
        width: s(56),
        height: s(56),
        borderRadius: Radius.round,
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                shadowOffset: { width: 0, height: vs(6) },
                shadowOpacity: 0.25,
                shadowRadius: s(12),
            },
            android: { elevation: 6 },
        }),
    },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: Radius.xl,
        borderTopRightRadius: Radius.xl,
        paddingBottom: vs(16),
        maxHeight: '80%',
    },
    modalInner: {
        paddingHorizontal: s(24),
        paddingTop: vs(12),
        paddingBottom: vs(24),
    },
    modalHandle: {
        width: s(40),
        height: vs(4),
        borderRadius: Radius.round,
        backgroundColor: '#D1D5DB',
        alignSelf: 'center',
        marginBottom: vs(18),
    },
    modalTitle: {
        fontSize: Fonts.size.headingSmall,
        lineHeight: lineHeight(22, 1.27),
        marginBottom: vs(16),
    },
    modalButton: {
        marginTop: vs(12),
    },
});