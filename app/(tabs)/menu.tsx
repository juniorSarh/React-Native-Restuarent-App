import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import FoodItem from '../../src/components/FoodItem';
import { listenToFoodItems } from '../../src/services/food';

export default function MenuScreen() {
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
    // TODO: Implement cart functionality
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
      <View style={styles.header}>
        <Text style={styles.title}>Menu</Text>
        <Text style={styles.subtitle}>Discover our culinary delights</Text>
      </View>

      <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
        {foodItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No menu items available</Text>
            <Text style={styles.emptySubtext}>Check back later for delicious options!</Text>
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
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
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
    textAlign: 'center',
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
