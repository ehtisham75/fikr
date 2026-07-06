import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { FolderOpen } from 'lucide-react-native';
import {
  AppContainer,
  AppFloatingButton,
  AppText,
  LoginBottomSheet,
} from '../../components';
import { getFolders } from '../../utils/storage';
import ROUTES from '../../utils/routes';
import { vs, s, icon, Fonts, Radius, lineHeight } from '../../theme/sizeMatter';
import { useTaskStore, getNextTodayTask } from '../../store/taskStore';
import { useAuthStore } from '../../store/authStore';
import {
  FolderCard,
  HomeHeader,
  TodayTaskCheck,
} from './components';

const HomeScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [folders, setFolders] = useState([]);
  const [showLoginSheet, setShowLoginSheet] = useState(false);

  const user = useAuthStore(state => state.user);
  const isLoggedIn = !!user;

  const tasks = useTaskStore(state => state.tasks);
  const loadTasks = useTaskStore(state => state.loadTasks);
  const nextTodayTask = getNextTodayTask(tasks);

  const fetchFolders = useCallback(() => {
    try {
      const loadedFolders = getFolders();
      setFolders(loadedFolders);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchFolders();
      loadTasks();
    }, [fetchFolders, loadTasks]),
  );

  const navigateToNewFolder = () => {
    if (!isLoggedIn) {
      setShowLoginSheet(true);
      return;
    }
    navigation.navigate(ROUTES.ADD_NEW_FOLDER);
  };

  const navigateToNewTask = () => {
    if (!isLoggedIn) {
      setShowLoginSheet(true);
      return;
    }
    navigation.navigate(ROUTES.ADD_NEW_TASK);
  };

  const navigateToTodayTasks = () => {
    navigation.navigate(ROUTES.TASKS);
  };

  const handleFloatingButtonPress = () => {
    if (!isLoggedIn) {
      setShowLoginSheet(true);
    }
  };

  const handleLoginPress = () => {
    navigation.navigate(ROUTES.SIGN_IN);
  };

  const listHeader = (
    <>
      <HomeHeader />
      <TodayTaskCheck
        nextTask={nextTodayTask}
        onAddTask={navigateToNewTask}
        onOpenTasks={navigateToTodayTasks}
      />
    </>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIconWrap, { backgroundColor: `${colors.primary}18` }]}>
        <FolderOpen size={icon(34)} color={colors.primary} />
      </View>
      <AppText style={styles.emptyTitle}>No folders found</AppText>
      <AppText muted style={styles.emptySubtitle}>
        Create your first folder to start tracking and organizing your daily expenses.
      </AppText>
    </View>
  );

  return (
    <AppContainer contentStyle={styles.screen}>
      <FlatList
        data={folders}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <FolderCard
            item={item}
            onPress={() => console.log('Opened folder:', item.name)}
          />
        )}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      <AppFloatingButton
        isSubButtons={isLoggedIn}
        onPress={handleFloatingButtonPress}
        subButtons={[
          {
            key: 'folder',
            label: 'New Folder',
            icon: 'FolderPlus',
            onPress: navigateToNewFolder,
          },
          {
            key: 'task',
            label: 'Add Task',
            icon: 'ListPlus',
            onPress: navigateToNewTask,
          },
        ]}
      />

      <LoginBottomSheet
        visible={showLoginSheet}
        onClose={() => setShowLoginSheet(false)}
        onLogin={handleLoginPress}
      />
    </AppContainer>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  listContent: {
    paddingHorizontal: 0,
    paddingBottom: vs(112),
    gap: vs(16),
  },
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
});

