import React, { useCallback, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    RefreshControl,
    StyleSheet,
    View,
} from 'react-native';
import dayjs from 'dayjs';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { CalendarDays, WalletCards } from 'lucide-react-native';
import {
    AppButton,
    AppContainer,
    AppText,
    AppTextInput,
} from '../../components';
import { supabase } from '../../lib/supabase';
import {
    BUDGETS_SELECT_COLUMNS,
    SUPABASE_TABLES,
    isMissingSupabaseTableError,
    isSupabasePolicyError,
} from '../../lib/supabaseTables';
import { Fonts, Radius, icon, lineHeight, s, vs } from '../../theme/sizeMatter';
import { showToast } from '../../utils/helper';

const formatAmount = amount => `$${Number(amount || 0).toFixed(2)}`;

const getCurrentUserId = async () => {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user?.id) {
        throw error || new Error('Please log in to manage budgets.');
    }

    return data.user.id;
};

const BudgetItem = ({ item }) => {
    const { colors } = useTheme();

    return (
        <View
            style={[
                styles.budgetItem,
                {
                    backgroundColor: colors.card,
                    borderColor: colors.cardBorder,
                    shadowColor: colors.shadow,
                },
            ]}>
            <View style={[styles.budgetIconWrap, { backgroundColor: `${colors.primary}14` }]}>
                <WalletCards size={icon(18)} color={colors.primary} />
            </View>
            <View style={styles.budgetDetails}>
                <AppText numberOfLines={1} style={styles.budgetTitle}>
                    {item.title}
                </AppText>
                <AppText muted style={styles.budgetDate}>
                    {dayjs(item.created_at).format('MMM D, YYYY')}
                </AppText>
            </View>
            <AppText style={[styles.budgetAmount, { color: colors.primary }]}>
                {formatAmount(item.amount)}
            </AppText>
        </View>
    );
};

const BudgetHeader = ({
    amount,
    colors,
    isBudgetTableMissing,
    isLoading,
    isSaving,
    onAmountChange,
    onSave,
    onTitleChange,
    monthLabel,
    title,
    todayLabel,
}) => (
    <View>
        <View style={styles.header}>
            <View>
                <AppText muted style={styles.headerEyebrow}>
                    Monthly budget
                </AppText>
                <AppText variant="heading" style={[styles.headerTitle, { color: colors.primary }]}>
                    Add your monthly budget
                </AppText>
                <AppText muted style={styles.headerSubtitle}>
                    for this current month
                </AppText>
            </View>
        </View>

        <View
            style={[
                styles.datePanel,
                {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                },
            ]}>
            <View style={[styles.dateIcon, { backgroundColor: `${colors.primary}20` }]}>
                <CalendarDays size={icon(20)} color={colors.primary} />
            </View>
            <View>
                <AppText style={styles.todayText}>{todayLabel}</AppText>
                <AppText muted style={styles.monthText}>{monthLabel}</AppText>
            </View>
        </View>

        <View style={styles.form}>
            <AppTextInput
                label="Title"
                value={title}
                onChangeText={onTitleChange}
                placeholder="Food, rent, travel..."
                returnKeyType="next"
            />
            <AppTextInput
                label="Amount"
                value={amount}
                onChangeText={onAmountChange}
                placeholder="0.00"
                keyboardType="decimal-pad"
                returnKeyType="done"
            />
            <AppButton
                onPress={onSave}
                disabled={isSaving}
                style={styles.saveButton}>
                {isSaving ? 'Saving...' : 'Save Budget'}
            </AppButton>
            {isBudgetTableMissing && (
                <View style={[styles.setupNotice, { borderColor: colors.warning }]}>
                    <AppText style={[styles.setupNoticeTitle, { color: colors.warning }]}>
                        Budget table setup required
                    </AppText>
                    <AppText muted style={styles.setupNoticeText}>
                        Create the budgets table in Supabase SQL Editor once, then save again.
                    </AppText>
                </View>
            )}
        </View>

        <View style={styles.sectionHeader}>
            <AppText style={styles.sectionTitle}>Recently added</AppText>
            {isLoading && <ActivityIndicator size="small" color={colors.primary} />}
        </View>
    </View>
);

const BudgetFooter = ({ colors, monthLabel, totalBudget }) => (
    <View style={styles.footer}>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.totalRow}>
            <View>
                <AppText muted style={styles.totalLabel}>Total budget for this month</AppText>
                <AppText style={styles.totalMonth}>{monthLabel}</AppText>
            </View>
            <AppText style={[styles.totalAmount, { color: colors.primary }]}>
                {formatAmount(totalBudget)}
            </AppText>
        </View>
    </View>
);

const BudgetScreen = () => {
    const { colors } = useTheme();
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [budgets, setBudgets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isBudgetTableMissing, setIsBudgetTableMissing] = useState(false);
    const [currentDate, setCurrentDate] = useState(dayjs());

    const monthKey = currentDate.format('YYYY-MM');
    const monthLabel = currentDate.format('MMMM YYYY');
    const todayLabel = currentDate.format('dddd, MMMM D');

    const totalBudget = useMemo(
        () => budgets.reduce((sum, item) => sum + Number(item.amount || 0), 0),
        [budgets],
    );

    const loadBudgets = useCallback(async ({
        refreshing = false,
        targetMonthKey = monthKey,
    } = {}) => {
        if (refreshing) {
            setIsRefreshing(true);
        } else {
            setIsLoading(true);
        }

        try {
            await getCurrentUserId();
            const { data, error } = await supabase
                .from(SUPABASE_TABLES.BUDGETS)
                .select(BUDGETS_SELECT_COLUMNS)
                .eq('budget_month', targetMonthKey)
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            setIsBudgetTableMissing(false);
            setBudgets(Array.isArray(data) ? data : []);
        } catch (error) {
            console.log('Budget load error:', error);

            if (isMissingSupabaseTableError(error)) {
                setIsBudgetTableMissing(true);
                setBudgets([]);
                showToast(
                    'error',
                    'Budget table missing',
                    'Create the budgets table in Supabase SQL Editor once. After it exists, this screen will save budgets normally.',
                );
                return;
            }

            if (isSupabasePolicyError(error)) {
                showToast(
                    'error',
                    'Budget permission blocked',
                    'Run the budgets RLS policy SQL in Supabase SQL Editor.',
                );
                return;
            }

            showToast('error', 'Budget not loaded', error.message || 'Please try again.');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [monthKey]);

    useFocusEffect(
        useCallback(() => {
            const now = dayjs();
            setCurrentDate(now);
            loadBudgets({ targetMonthKey: now.format('YYYY-MM') });
        }, [loadBudgets]),
    );

    const handleSave = async () => {
        const cleanTitle = title.trim();
        const numericAmount = Number(amount.replace(/,/g, ''));

        if (!cleanTitle) {
            showToast('error', 'Add a title', 'Please enter a budget title.');
            return;
        }

        if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
            showToast('error', 'Add an amount', 'Please enter a valid amount greater than 0.');
            return;
        }

        setIsSaving(true);

        try {
            const userId = await getCurrentUserId();
            const payload = {
                user_id: userId,
                title: cleanTitle,
                amount: numericAmount,
                budget_month: monthKey,
            };

            const { data, error } = await supabase
                .from(SUPABASE_TABLES.BUDGETS)
                .insert(payload)
                .select(BUDGETS_SELECT_COLUMNS)
                .single();

            if (error) {
                throw error;
            }

            setIsBudgetTableMissing(false);
            setBudgets(currentBudgets => [data, ...currentBudgets]);
            setTitle('');
            setAmount('');
            showToast('success', 'Budget saved', `${cleanTitle} has been added.`);
        } catch (error) {
            console.log('Budget save error:', error);

            if (isMissingSupabaseTableError(error)) {
                setIsBudgetTableMissing(true);
                showToast(
                    'error',
                    'Create budgets table',
                    'Run the budgets table SQL once in Supabase SQL Editor.',
                );
                return;
            }

            if (isSupabasePolicyError(error)) {
                showToast(
                    'error',
                    'Budget permission blocked',
                    'Run the budgets RLS policy SQL in Supabase SQL Editor.',
                );
                return;
            }

            showToast('error', 'Budget not saved', error.message || 'Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const renderEmpty = () => {
        if (isLoading) {
            return null;
        }

        return (
            <View style={[styles.emptyState, { borderColor: colors.border }]}>
                <AppText muted style={styles.emptyText}>
                    No budgets added for {monthLabel} yet.
                </AppText>
            </View>
        );
    };

    const listHeader = (
        <BudgetHeader
            amount={amount}
            colors={colors}
            isBudgetTableMissing={isBudgetTableMissing}
            isLoading={isLoading}
            isSaving={isSaving}
            onAmountChange={setAmount}
            onSave={handleSave}
            onTitleChange={setTitle}
            monthLabel={monthLabel}
            title={title}
            todayLabel={todayLabel}
        />
    );

    const listFooter = (
        <BudgetFooter
            colors={colors}
            monthLabel={monthLabel}
            totalBudget={totalBudget}
        />
    );

    return (
        <AppContainer contentStyle={styles.screen}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardView}>
                <FlatList
                    data={budgets}
                    keyExtractor={item => String(item.id)}
                    renderItem={({ item }) => <BudgetItem item={item} />}
                    ListHeaderComponent={listHeader}
                    ListEmptyComponent={renderEmpty}
                    ListFooterComponent={listFooter}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={() => loadBudgets({ refreshing: true })}
                            tintColor={colors.primary}
                        />
                    }
                />
            </KeyboardAvoidingView>
        </AppContainer>
    );
};

export default BudgetScreen;

const styles = StyleSheet.create({
    screen: {
        paddingHorizontal: 0,
        paddingTop: 0,
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        paddingHorizontal: s(24),
        paddingTop: vs(14),
        paddingBottom: vs(108),
    },
    header: {
        paddingBottom: vs(18),
    },
    headerEyebrow: {
        fontSize: Fonts.size.caption,
        fontWeight: Fonts.weight.bold,
        marginBottom: vs(4),
        textTransform: 'uppercase',
    },
    headerTitle: {
        fontSize: Fonts.size.heading,
        lineHeight: lineHeight(30, 1.2),
    },
    headerSubtitle: {
        fontSize: Fonts.size.bodySmall,
        marginTop: vs(2),
    },
    datePanel: {
        minHeight: vs(70),
        borderRadius: Radius.lg,
        borderWidth: 1,
        paddingHorizontal: s(16),
        paddingVertical: vs(12),
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: vs(18),
    },
    dateIcon: {
        width: s(42),
        height: s(42),
        borderRadius: Radius.round,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: s(12),
    },
    todayText: {
        fontSize: Fonts.size.body,
        fontWeight: Fonts.weight.bold,
        lineHeight: lineHeight(16, 1.25),
    },
    monthText: {
        fontSize: Fonts.size.bodySmall,
        marginTop: vs(2),
    },
    form: {
        marginBottom: vs(22),
    },
    saveButton: {
        marginTop: vs(4),
    },
    setupNotice: {
        borderWidth: 1,
        borderRadius: Radius.md,
        marginTop: vs(12),
        paddingHorizontal: s(12),
        paddingVertical: vs(10),
    },
    setupNoticeTitle: {
        fontSize: Fonts.size.bodySmall,
        fontWeight: Fonts.weight.bold,
        lineHeight: lineHeight(14, 1.25),
    },
    setupNoticeText: {
        fontSize: Fonts.size.caption,
        marginTop: vs(3),
    },
    sectionHeader: {
        minHeight: vs(28),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: vs(10),
    },
    sectionTitle: {
        fontSize: Fonts.size.subtitle,
        fontWeight: Fonts.weight.bold,
    },
    budgetItem: {
        minHeight: vs(66),
        borderRadius: Radius.lg,
        borderWidth: 1,
        paddingHorizontal: s(14),
        paddingVertical: vs(12),
        marginBottom: vs(10),
        flexDirection: 'row',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowOffset: { width: 0, height: vs(3) },
                shadowOpacity: 0.04,
                shadowRadius: s(8),
            },
            android: {
                elevation: 2,
            },
        }),
    },
    budgetIconWrap: {
        width: s(34),
        height: s(34),
        borderRadius: Radius.round,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: s(12),
    },
    budgetDetails: {
        flex: 1,
        paddingRight: s(10),
    },
    budgetTitle: {
        fontSize: Fonts.size.body,
        fontWeight: Fonts.weight.bold,
        lineHeight: lineHeight(16, 1.2),
    },
    budgetDate: {
        fontSize: Fonts.size.caption,
        marginTop: vs(2),
    },
    budgetAmount: {
        fontSize: Fonts.size.body,
        fontWeight: Fonts.weight.extraBold,
    },
    emptyState: {
        borderWidth: 1,
        borderStyle: 'dashed',
        borderRadius: Radius.lg,
        paddingHorizontal: s(16),
        paddingVertical: vs(20),
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: vs(8),
    },
    emptyText: {
        textAlign: 'center',
        fontSize: Fonts.size.bodySmall,
    },
    footer: {
        paddingTop: vs(8),
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        marginTop: vs(8),
        marginBottom: vs(16),
    },
    totalRow: {
        minHeight: vs(58),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    totalLabel: {
        fontSize: Fonts.size.caption,
        fontWeight: Fonts.weight.bold,
        textTransform: 'uppercase',
    },
    totalMonth: {
        fontSize: Fonts.size.bodySmall,
        fontWeight: Fonts.weight.semiBold,
        marginTop: vs(2),
    },
    totalAmount: {
        fontSize: Fonts.size.headingSmall,
        fontWeight: Fonts.weight.extraBold,
    },
});
