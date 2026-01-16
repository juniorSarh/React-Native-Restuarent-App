import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function HomeTabScreen() {
  const router = useRouter();

  const logout = async () => {
    router.replace('/');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brandName}>Restaurant</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.heroSection}>
        <ImageBackground 
          source={require('../../assets/images/cassidy-mills-LPTUjv9l8BE-unsplash.jpg')}
          style={styles.heroImage}
          resizeMode="cover"
        >
          <View style={styles.heroOverlay}>
            <Text style={styles.welcomeTitle}>Welcome Back</Text>
            <Text style={styles.welcomeSubtitle}>Your culinary journey continues</Text>
          </View>
        </ImageBackground>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Special</Text>
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Chef's Signature Dish</Text>
              <Text style={styles.cardDescription}>A masterpiece crafted with the finest ingredients and culinary expertise</Text>
              <TouchableOpacity style={styles.cardButton}>
                <Text style={styles.cardButtonText}>Order Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionCard}>
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
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            <TouchableOpacity style={styles.categoryCard}>
              <Text style={styles.categoryEmoji}>🍕</Text>
              <Text style={styles.categoryName}>Pizza</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.categoryCard}>
              <Text style={styles.categoryEmoji}>🍜</Text>
              <Text style={styles.categoryName}>Pasta</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.categoryCard}>
              <Text style={styles.categoryEmoji}>🥗</Text>
              <Text style={styles.categoryName}>Salads</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.categoryCard}>
              <Text style={styles.categoryEmoji}>🍰</Text>
              <Text style={styles.categoryName}>Desserts</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.categoryCard}>
              <Text style={styles.categoryEmoji}>🍹</Text>
              <Text style={styles.categoryName}>Cocktails</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  brandName: {
    fontSize: 32,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  heroSection: {
    height: 250,
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 30,
  },
  heroImage: {
    flex: 1,
    width: '100%',
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#E0E0E0',
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  cardContent: {
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 14,
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  cardButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cardButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginRight: 15,
    minWidth: 80,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  categoryEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
