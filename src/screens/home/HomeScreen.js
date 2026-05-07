import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Pressable, Platform, useColorScheme } from 'react-native';
import { Settings, Plus, Lock } from 'lucide-react-native';
import { AppScreen, AppText } from '../../components';
import COLORS from '../../theme/colors';
import { getFolders } from '../../utils/storage';

const FolderCard = ({ item, onPress }) => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Pressable 
      onPress={onPress} 
      style={({ pressed }) => [
        styles.card,
        isDarkMode ? styles.cardDark : styles.cardLight,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.cardHeader}>
        <AppText style={styles.cardTitle} variant="heading">{item.name}</AppText>
        {item.is_locked && <Lock size={18} color={COLORS.text.gray} />}
      </View>
      <AppText muted style={styles.cardAmount}>${item.amount.toFixed(2)}</AppText>
    </Pressable>
  );
};

const HomeScreen = ({ navigation }) => {
  const [folders, setFolders] = useState([]);
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    // Load from MMKV
    const loadedFolders = getFolders();
    setFolders(loadedFolders);
  }, []);

  return (
    <AppScreen contentStyle={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <AppText variant="title" style={styles.headerTitle}>Fikr</AppText>
        <Pressable style={styles.settingsButton}>
          <Settings size={24} color={isDarkMode ? COLORS.text.white : COLORS.text.black} />
        </Pressable>
      </View>

      {/* Folder List */}
      <FlatList
        data={folders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FolderCard 
            item={item} 
            onPress={() => console.log('Opened folder:', item.name)} 
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      <Pressable 
        style={({ pressed }) => [
          styles.fab,
          pressed && styles.fabPressed,
        ]}
        onPress={() => console.log('Create folder pressed')}
      >
        <Plus size={32} color={COLORS.text.white} />
      </Pressable>
    </AppScreen>
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
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    lineHeight: 40,
    color: COLORS.primary,
  },
  settingsButton: {
    padding: 8,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 100, // Make room for FAB
    gap: 16,
  },
  card: {
    padding: 20,
    borderRadius: 20,
    minHeight: 100,
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardLight: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  cardDark: {
    backgroundColor: COLORS.secondary,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 22,
    lineHeight: 28,
  },
  cardAmount: {
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  fabPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },
});
