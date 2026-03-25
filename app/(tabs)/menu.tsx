import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // ✅ NEW
import CartBadge from '../../src/components/CartBadge';
import FoodItem from '../../src/components/FoodItem';
import { listenToFoodItems } from '../../src/services/food';

export default function MenuScreen() {
  const router = useRouter();
  const [foodItems, setFoodItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = listenToFoodItems((items) => {
      setFoodItems(items);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleAddToCart = (item: any) => {
    console.log('Added to cart:', item.name);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      {/* 🔥 HEADER */}
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Menu</Text>
          <Text style={styles.subtitle}>
            Discover our culinary delights
          </Text>
        </View>

        {/* 🛒 CART BUTTON WITH ICON */}
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => router.push('/(tabs)/cart')}
          activeOpacity={0.8}
        >
          <View style={styles.cartIconWrapper}>
            <Ionicons name="cart" size={22} color="#fff" />
            
            {/* 🔔 BADGE OVERLAY */}
            <View style={styles.badgeWrapper}>
              <CartBadge />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* 🍔 MENU */}
      <ScrollView
        style={styles.menuContainer}
        showsVerticalScrollIndicator={false}
      >
        {foodItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No menu items available
            </Text>
            <Text style={styles.emptySubtext}>
              Check back later for delicious options!
            </Text>
          </View>
        ) : (
          foodItems.map((item) => (
            <FoodItem
              key={item.id}
              item={item}
              onAddToCart={handleAddToCart}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },

  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerTextContainer: {
    flex: 1,
  },

  cartButton: {
    zIndex: 10,
  },

  cartIconWrapper: {
    backgroundColor: '#22c55e',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',

    // shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },

  /* 🔔 BADGE POSITION */
  badgeWrapper: {
    position: 'absolute',
    top: -5,
    right: -5,
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 5,
  },

  subtitle: {
    fontSize: 16,
    color: '#B0B0B0',
  },

  menuContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },

  emptyText: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 10,
  },

  emptySubtext: {
    fontSize: 14,
    color: '#B0B0B0',
    textAlign: 'center',
  },
});