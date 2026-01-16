import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function MenuScreen() {
  const menuItems = [
    { id: 1, name: 'Margherita Pizza', price: '$12.99', category: 'Pizza', emoji: '🍕' },
    { id: 2, name: 'Caesar Salad', price: '$8.99', category: 'Salads', emoji: '🥗' },
    { id: 3, name: 'Pasta Carbonara', price: '$14.99', category: 'Pasta', emoji: '🍜' },
    { id: 4, name: 'Grilled Salmon', price: '$18.99', category: 'Seafood', emoji: '🐟' },
    { id: 5, name: 'Chocolate Cake', price: '$6.99', category: 'Desserts', emoji: '🍰' },
    { id: 6, name: 'Cocktail Special', price: '$10.99', category: 'Drinks', emoji: '🍹' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Menu</Text>
        <Text style={styles.subtitle}>Discover our culinary delights</Text>
      </View>

      <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
        {menuItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.menuItem}>
            <View style={styles.itemEmoji}>
              <Text style={styles.emojiText}>{item.emoji}</Text>
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemCategory}>{item.category}</Text>
            </View>
            <View style={styles.itemPrice}>
              <Text style={styles.priceText}>{item.price}</Text>
            </View>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  menuItem: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  itemEmoji: {
    width: 50,
    height: 50,
    backgroundColor: '#3a3a3a',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  emojiText: {
    fontSize: 24,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  itemCategory: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  itemPrice: {
    marginRight: 15,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  addButton: {
    width: 30,
    height: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    lineHeight: 18,
  },
});
