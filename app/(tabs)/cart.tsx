import { useState } from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Checkout } from '../../src/components/Checkout';
import FoodCustomizationModal from '../../src/components/FoodCustomizationModal';
import { CartItem, useCart } from '../../src/context/CartContext';

export default function CartScreen() {
  const { items, removeFromCart, updateCartItem, clearCart } = useCart();
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);

  const calculateItemTotal = (item: CartItem) => {
    let total = item.basePrice;

    item.customization.selectedDrinks.forEach(() => {
      total += 25; // example drink price
    });

    item.customization.extras.forEach(e => {
      total += e.quantity * 10;
    });

    return total * item.quantity;
  };

  const cartTotal = items.reduce((sum, i) => sum + calculateItemTotal(i), 0);

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>R {calculateItemTotal(item).toFixed(2)}</Text>
      </View>

      <Text style={styles.qty}>Quantity: {item.quantity}</Text>

      {/* Customization Summary */}
      <View style={styles.customization}>
        {item.customization.selectedDrinks.length > 0 && (
          <Text style={styles.customText}>
            Drinks: {item.customization.selectedDrinks.join(', ')}
          </Text>
        )}

        {item.customization.extras.length > 0 && (
          <Text style={styles.customText}>
            Extras:{' '}
            {item.customization.extras
              .map(e => `${e.id} x${e.quantity}`)
              .join(', ')}
          </Text>
        )}

        {item.customization.specialInstructions && (
          <Text style={styles.customText}>
            Notes: {item.customization.specialInstructions}
          </Text>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => setEditingItem(item)}
        >
          <Text style={styles.btnText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.removeBtn}
          onPress={() =>
            Alert.alert('Remove item?', item.name, [
              { text: 'Cancel' },
              { text: 'Remove', onPress: () => removeFromCart(item.cartItemId) },
            ])
          }
        >
          <Text style={styles.btnText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>

      {items.length === 0 ? (
        <Text style={styles.empty}>Your cart is empty</Text>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={i => i.cartItemId}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 120 }}
          />

          <View style={styles.footer}>
            <Text style={styles.total}>Total: R {cartTotal.toFixed(2)}</Text>
            <Checkout 
              items={items} 
              total={cartTotal} 
              onSuccess={() => {
                clearCart();
              }} 
            />
          </View>
        </>
      )}

      {/* EDIT MODAL */}
      {editingItem && (
        <FoodCustomizationModal
          visible={true}
          foodItem={{
            id: editingItem.foodId,
            name: editingItem.name,
            basePrice: editingItem.basePrice,
            imageUrl: editingItem.imageUrl,
          }}
          initialData={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={(updated: Omit<CartItem, 'cartItemId'>) => {
            updateCartItem(editingItem.cartItemId, updated);
            setEditingItem(null);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#1a1a1a' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  empty: { color: '#aaa', textAlign: 'center', marginTop: 50 },

  card: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between' },
  name: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  price: { color: '#4fc3f7', fontWeight: 'bold' },
  qty: { color: '#ccc', marginTop: 5 },

  customization: { marginTop: 8 },
  customText: { color: '#aaa', fontSize: 12 },

  actions: { flexDirection: 'row', marginTop: 12, gap: 10 },
  editBtn: { flex: 1, backgroundColor: '#2196f3', padding: 10, borderRadius: 6 },
  removeBtn: { flex: 1, backgroundColor: '#f44336', padding: 10, borderRadius: 6 },
  btnText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000',
    padding: 20,
  },
  total: { color: '#fff', fontSize: 18, marginBottom: 10 },
  checkoutBtn: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 8,
  },
  checkoutText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});
