import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FoodItemProps {
  item: {
    id: string;
    name: string;
    description?: string;
    price: number;
    category?: string;
    imageUrl?: string;
  };
  onAddToCart?: (item: any) => void;
}

export default function FoodItem({ item, onAddToCart }: FoodItemProps) {
  return (
    <TouchableOpacity style={styles.menuItem}>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
      ) : (
        <View style={styles.itemEmoji}>
          <Text style={styles.emojiText}>🍽️</Text>
        </View>
      )}
      
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        {item.description && (
          <Text style={styles.itemDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        {item.category && (
          <Text style={styles.itemCategory}>{item.category}</Text>
        )}
      </View>
      
      <View style={styles.itemPrice}>
        <Text style={styles.priceText}>R {item.price.toFixed(2)}</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => onAddToCart?.(item)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
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
  itemDescription: {
    fontSize: 12,
    color: '#B0B0B0',
    marginBottom: 2,
  },
  itemCategory: {
    fontSize: 12,
    color: '#B0B0B0',
    textTransform: 'capitalize',
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
