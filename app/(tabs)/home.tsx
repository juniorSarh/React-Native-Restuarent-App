import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../src/config/firebase';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function HomeTabScreen() {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const logout = async () => router.replace('/');

  // Fetch Menu Items
  const getMenuItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'fooditems'));
      const items: any[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      return items;
    } catch (error) {
      console.error('Error fetching menu items:', error);
      return [];
    }
  };

  const handleGetMenu = async () => {
    setLoading(true);
    const items = await getMenuItems();
    setMenuItems(items);
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.brandName}>🍴 DineHub</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* HERO */}
        <View style={styles.heroSection}>
          <ImageBackground
            source={require('../../assets/images/cassidy-mills-LPTUjv9l8BE-unsplash.jpg')}
            style={styles.heroImage}
            resizeMode="cover"
          >
            <View style={styles.heroOverlay}>
              <Text style={styles.welcomeTitle}>Welcome Back!</Text>
              <Text style={styles.welcomeSubtitle}>
                Explore the finest dishes curated for you
              </Text>
              <TouchableOpacity style={styles.exploreBtn} onPress={handleGetMenu}>
                <Text style={styles.exploreBtnText}>Browse Menu 🍽️</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>

        {/* QUICK ACTIONS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            {[
              { icon: '🍽️', title: 'Browse Menu', onPress: handleGetMenu, colors: ['#22c55e', '#16a34a'] },
              { icon: '📅', title: 'Reservations', onPress: () => {}, colors: ['#3b82f6', '#2563eb'] },
              { icon: '🍷', title: 'Wine Selection', onPress: () => {}, colors: ['#f59e0b', '#d97706'] },
              { icon: '⭐', title: 'Reviews', onPress: () => {}, colors: ['#f43f5e', '#e11d48'] },
            ].map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.actionCard, { backgroundColor: item.colors[0] }]}
                onPress={item.onPress}
                activeOpacity={0.8}
              >
                <Text style={styles.actionIcon}>{item.icon}</Text>
                <Text style={styles.actionTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* MENU DISPLAY */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Menu</Text>
          {loading && <Text style={styles.loadingText}>Loading menu...</Text>}
          {menuItems.length === 0 && !loading ? (
            <Text style={styles.noMenu}>No menu items found</Text>
          ) : (
            menuItems.map((item) => (
              <View key={item.id} style={styles.menuItem}>
                {item.imageUrl && <Animated.Image source={{ uri: item.imageUrl }} style={styles.menuImage} />}
                <View style={styles.menuText}>
                  <Text style={styles.menuTitle}>{item.name}</Text>
                  <Text style={styles.menuPrice}>R {item.price}</Text>
                </View>
              </View>
            ))
          )}
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
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    alignItems: 'center',
  },

  brandName: { fontSize: 28, fontWeight: '700', color: '#fff' },

  logoutButton: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  logoutButtonText: { color: '#fff', fontWeight: '600' },

  heroSection: {
    width: width - 40,
    height: 220,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },

  heroImage: { flex: 1 },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  welcomeTitle: { color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  welcomeSubtitle: { color: '#e5e7eb', fontSize: 16, marginBottom: 15, textAlign: 'center' },

  exploreBtn: {
    backgroundColor: '#22c55e',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  exploreBtnText: { color: '#fff', fontWeight: '700' },

  section: { marginBottom: 25, paddingHorizontal: 20 },

  sectionTitle: { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 12 },

  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },

  actionCard: {
    width: '48%',
    paddingVertical: 25,
    borderRadius: 15,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  actionIcon: { fontSize: 28, marginBottom: 8, color: '#fff' },
  actionTitle: { color: '#fff', fontWeight: '600', textAlign: 'center' },

  loadingText: { color: '#9ca3af', textAlign: 'center', marginTop: 10 },
  noMenu: { color: '#9ca3af', textAlign: 'center', marginTop: 10 },

  menuItem: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 15,
    marginBottom: 12,
    overflow: 'hidden',
    alignItems: 'center',
  },

  menuImage: { width: 80, height: 80, borderRadius: 10, marginRight: 15 },

  menuText: { flex: 1 },
  menuTitle: { color: '#fff', fontWeight: '700', fontSize: 16 },
  menuPrice: { color: '#a1a1aa', marginTop: 4 },
});