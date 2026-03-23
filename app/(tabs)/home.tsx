import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../src/config/firebase';

const { width, height } = Dimensions.get('window');

export default function HomeTabScreen() {
  const router = useRouter();

  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    router.replace('/');
  };

  // ✅ FETCH FROM COLLECTION
  const getMenuItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'fooditems'));

      const items: any[] = [];

      querySnapshot.forEach((doc) => {
        items.push({
          id: doc.id,
          ...doc.data(),
        });
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
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.brandName}>Restaurant</Text>
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
            <Text style={styles.welcomeTitle}>Welcome Back</Text>
            <Text style={styles.welcomeSubtitle}>
              Your culinary journey continues
            </Text>
          </View>
        </ImageBackground>
      </View>

      <View style={styles.content}>
        {/* QUICK ACTIONS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionCard} onPress={handleGetMenu}>
              <Text style={styles.actionIcon}>🍽️</Text>
              <Text style={styles.actionTitle}>Browse Menu</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionIcon}>📅</Text>
              <Text style={styles.actionTitle}>Reservations</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionIcon}>🍷</Text>
              <Text style={styles.actionTitle}>Wine Selection</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <Text style={styles.actionIcon}>⭐</Text>
              <Text style={styles.actionTitle}>Reviews</Text>
            </TouchableOpacity>
          </View>

          {/* ✅ LOADING */}
          {loading && (
            <Text style={{ color: '#fff', textAlign: 'center', marginTop: 10 }}>
              Loading menu...
            </Text>
          )}

          {/* ✅ MENU DISPLAY */}
          <View style={{ marginTop: 20 }}>
            {menuItems.length === 0 && !loading ? (
              <Text style={{ color: '#9ca3af', textAlign: 'center' }}>
                No menu items found
              </Text>
            ) : (
              menuItems.map((item) => (
                <View key={item.id} style={styles.menuItem}>
                  <Text style={styles.menuTitle}>{item.name}</Text>
                  <Text style={styles.menuPrice}>R{item.price}</Text>
                </View>
              ))
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
  },

  brandName: {
    fontSize: 28,
    color: '#fff',
  },

  logoutButton: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 10,
  },

  logoutButtonText: {
    color: '#fff',
  },

  heroSection: {
    height: 200,
    margin: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },

  heroImage: { flex: 1 },

  heroOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  welcomeTitle: { color: '#fff', fontSize: 28 },
  welcomeSubtitle: { color: '#ccc' },

  content: { padding: 20 },

  section: { marginBottom: 30 },

  sectionTitle: { color: '#fff', fontSize: 22 },

  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  actionCard: {
    width: '48%',
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },

  actionIcon: { fontSize: 28 },
  actionTitle: { color: '#fff' },

  menuItem: {
    backgroundColor: '#1f2937',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
  },

  menuTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  menuPrice: {
    color: '#9ca3af',
  },
});