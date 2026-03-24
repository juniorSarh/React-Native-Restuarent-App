import { useRouter } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import {
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  TextInput,
} from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../src/config/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOut } from "firebase/auth";
import { auth } from "../../src/config/firebase";

const { width } = Dimensions.get('window');

export default function HomeTabScreen() {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const logout = async () => {
  await signOut(auth);
};

  // Fetch Menu
  const getMenuItems = async () => {
    const querySnapshot = await getDocs(collection(db, 'fooditems'));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  const handleGetMenu = async () => {
    setLoading(true);
    const items = await getMenuItems();
    setMenuItems(items);
    setFilteredItems(items);
    setLoading(false);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  };

  // 🔍 Search filter
  useEffect(() => {
    const filtered = menuItems.filter((item) =>
      item.name?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [search]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.brandName}>🍴 The DineHub</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* HERO */}
        <View style={styles.heroSection}>
          <ImageBackground
            source={require('../../assets/images/cassidy-mills-LPTUjv9l8BE-unsplash.jpg')}
            style={styles.heroImage}
          >
            <View style={styles.heroOverlay}>
              <Text style={styles.welcomeTitle}>Welcome Back 👋</Text>
              <Text style={styles.welcomeSubtitle}>
                Discover amazing meals curated for you
              </Text>
              <TouchableOpacity style={styles.exploreBtn} onPress={handleGetMenu}>
                <Text style={styles.exploreBtnText}>Browse Menu</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>

        {/* 🔍 SEARCH */}
        <View style={styles.section}>
          <TextInput
            placeholder="Search food..."
            placeholderTextColor="#9ca3af"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        {/* 📊 QUICK STATS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{menuItems.length}</Text>
              <Text style={styles.statLabel}>Menu Items</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>⭐ 4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        </View>

        {/* ⚡ QUICK ACTIONS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#22c55e' }]} onPress={handleGetMenu}>
              <Text style={styles.actionIcon}>🍽️</Text>
              <Text style={styles.actionTitle}>Browse Menu</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#3b82f6' }]} onPress={() => router.push('/(tabs)/orders')}>
              <Text style={styles.actionIcon}>📦</Text>
              <Text style={styles.actionTitle}>My Orders</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#f59e0b' }]} onPress={() => router.push('/(tabs)/profile')}>
              <Text style={styles.actionIcon}>👤</Text>
              <Text style={styles.actionTitle}>Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#f43f5e' }]} onPress={() => router.push('/(tabs)/home')}>
              <Text style={styles.actionIcon}>⭐</Text>
              <Text style={styles.actionTitle}>Reviews</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 🍔 MENU */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Menu</Text>

          {loading && <Text style={styles.loadingText}>Loading menu...</Text>}

          {!loading && filteredItems.length === 0 && (
            <Text style={styles.noMenu}>No items found</Text>
          )}

          <Animated.View style={{ opacity: fadeAnim }}>
            {filteredItems.map((item) => (
              <View key={item.id} style={styles.menuItem}>
                {item.imageUrl && (
                  <Animated.Image source={{ uri: item.imageUrl }} style={styles.menuImage} />
                )}
                <View style={styles.menuText}>
                  <Text style={styles.menuTitle}>{item.name}</Text>
                  <Text style={styles.menuPrice}>R {item.price}</Text>
                </View>
              </View>
            ))}
          </Animated.View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },

  brandName: { fontSize: 26, fontWeight: '700', color: '#fff' },

  logoutButton: {
    backgroundColor: '#1e293b',
    padding: 10,
    borderRadius: 10,
  },
  menuText: {
    flex: 1,
  },

  logoutButtonText: { color: '#fff' },

  heroSection: {
    height: 220,
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },

  heroImage: { flex: 1 },

  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  welcomeTitle: { color: '#fff', fontSize: 26, fontWeight: '700' },
  welcomeSubtitle: { color: '#e5e7eb', marginBottom: 10 },

  exploreBtn: {
    backgroundColor: '#22c55e',
    padding: 12,
    borderRadius: 20,
  },

  exploreBtnText: { color: '#fff', fontWeight: '700' },

  section: { paddingHorizontal: 20, marginBottom: 20 },

  sectionTitle: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 10 },

  searchInput: {
    backgroundColor: '#1e293b',
    color: '#fff',
    padding: 12,
    borderRadius: 10,
  },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },

  statCard: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 12,
    width: '48%',
    alignItems: 'center',
  },

  statNumber: { color: '#22c55e', fontSize: 18, fontWeight: '700' },
  statLabel: { color: '#9ca3af' },

  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },

  actionCard: {
    width: '48%',
    padding: 20,
    borderRadius: 15,
    marginBottom: 10,
    alignItems: 'center',
  },

  actionIcon: { fontSize: 24 },
  actionTitle: { color: '#fff', marginTop: 5 },

  menuItem: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },

  menuImage: { width: 70, height: 70, borderRadius: 10, marginRight: 10 },

  menuTitle: { color: '#fff', fontWeight: '700' },
  menuPrice: { color: '#9ca3af' },

  loadingText: { color: '#9ca3af', textAlign: 'center' },
  noMenu: { color: '#9ca3af', textAlign: 'center' },
});