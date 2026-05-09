import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Pressable, Platform } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Lock } from 'lucide-react-native';
import {
  AppContainer,
  AppFloatingButton,
  AppIcon,
  AppText,
} from '../../components';
import { getFolders } from '../../utils/storage';
import { Fonts, Radius, icon, lineHeight, s, vs } from '../../theme/sizeMatter';

const FolderCard = ({ item, onPress }) => {
  const { colors } = useTheme();
  const cardTheme = {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    shadowColor: colors.shadow,
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        cardTheme,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.cardHeader}>
        <AppText style={styles.cardTitle} variant="heading">
          {item.name}
        </AppText>
        {item.is_locked && (
          <Lock size={icon(18)} color={colors.textSecondary} />
        )}
      </View>
      <AppText muted style={styles.cardAmount}>
        ${item.amount.toFixed(2)}
      </AppText>
    </Pressable>
  );
};

const HomeScreen = ({ navigation }) => {
  const [folders, setFolders] = useState([]);
  const { colors } = useTheme();
  const headerTitleTheme = { color: colors.primary };

  const fetchFolders = async () => {
    try {
      const loadedFolders = await getFolders();
      setFolders(loadedFolders);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  return (
    <AppContainer contentStyle={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <AppText variant="title" style={[styles.headerTitle, headerTitleTheme]}>
          Fikr
        </AppText>
        <Pressable style={styles.settingsButton}>
          <AppIcon name={'Setting'} size={icon(24)} color={colors.text} />
        </Pressable>
      </View>

      {/* Folder List */}
      <FlatList
        data={folders}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <FolderCard
            item={item}
            onPress={() => console.log('Opened folder:', item.name)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      <AppFloatingButton onPress={() => {}} />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(24),
    paddingTop: vs(16),
    paddingBottom: vs(24),
  },
  headerTitle: {
    fontSize: Fonts.size.heading,
    lineHeight: lineHeight(32, 1.25),
  },
  settingsButton: {
    padding: s(8),
  },
  listContent: {
    paddingHorizontal: s(24),
    paddingBottom: vs(100), // Make room for FAB
    gap: vs(16),
  },
  card: {
    padding: s(20),
    borderRadius: Radius.xl,
    minHeight: vs(100),
    justifyContent: 'center',
    borderWidth: 1,
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
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(8),
  },
  cardTitle: {
    fontSize: Fonts.size.headingSmall,
    lineHeight: lineHeight(22, 1.27),
  },
  cardAmount: {
    fontSize: Fonts.size.body,
  },
});
