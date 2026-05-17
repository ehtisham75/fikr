import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  AppContainer,
  AppFloatingButton,
} from '../../components';
import { getFolders } from '../../utils/storage';
import ROUTES from '../../utils/routes';
import { vs } from '../../theme/sizeMatter';
import { useTaskStore, getNextTodayTask } from '../../store/taskStore';
import {
  FolderCard,
  HomeHeader,
  TodayTaskCheck,
} from './components';

const HomeScreen = ({ navigation }) => {
  const [folders, setFolders] = useState([]);
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
    navigation.navigate(ROUTES.ADD_NEW_FOLDER);
  };

  const navigateToNewTask = () => {
    navigation.navigate(ROUTES.ADD_NEW_TASK);
  };

  const navigateToTodayTasks = () => {
    navigation.navigate(ROUTES.TASKS);
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
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      <AppFloatingButton
        isSubButtons
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
});
