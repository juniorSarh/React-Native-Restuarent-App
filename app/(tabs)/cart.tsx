import { useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
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
      total += 25;
    });

    item.customization.extras.forEach(e => {
      total += e.quantity * 10;
    });

    return total * item.quantity;
  };

  const cartTotal = items.reduce((sum, i) => sum + calculateItemTotal(i), 0);

  // ✅ Quantity Handlers
  const increaseQty = (item: CartItem) => {
    updateCartItem(item.cartItemId, {
      ...item,
      quantity: item.quantity + 1,
    });
  };

  const decreaseQty = (item: CartItem) => {
    if (item.quantity === 1) {
      removeFromCart(item.cartItemId);
    } else {
      updateCartItem(item.cartItemId, {
        ...item,
        quantity: item.quantity - 1,
      });
    }
  };

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        {/* Image */}
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={{ color: '#94a3b8' }}>No Image</Text>
          </View>
        )}

        {/* Info */}
        <View style={styles.info}>
          <View style={styles.header}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>
              R {calculateItemTotal(item).toFixed(2)}
            </Text>
          </View>

          {/* Description */}
          {item.description && (
            <Text style={styles.description} numberOfLines={2}>
              {item.description}
            </Text>
          )}

          {/* Quantity Controls */}
          <View style={styles.qtyRow}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => decreaseQty(item)}
            >
              <Text style={styles.qtyBtnText}>−</Text>
            </TouchableOpacity>

            <Text style={styles.qtyNumber}>{item.quantity}</Text>

            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => increaseQty(item)}
            >
              <Text style={styles.qtyBtnText}>＋</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Customization */}
      <View style={styles.customization}>
        {item.customization.selectedDrinks.length > 0 && (
          <Text style={styles.customText}>
            🥤 {item.customization.selectedDrinks.join(', ')}
          </Text>
        )}

        {item.customization.extras.length > 0 && (
          <Text style={styles.customText}>
            ➕{' '}
            {item.customization.extras
              .map(e => `${e.id} x${e.quantity}`)
              .join(', ')}
          </Text>
        )}

        {item.customization.specialInstructions && (
          <Text style={styles.customText}>
            📝 {item.customization.specialInstructions}
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
      <Text style={styles.title}>🛒 Your Cart</Text>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🧺</Text>
          <Text style={styles.empty}>Your cart is empty</Text>
          <Text style={styles.emptySub}>Add items to get started</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={i => i.cartItemId}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 140 }}
          />

          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.total}>R {cartTotal.toFixed(2)}</Text>
            </View>

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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0f172a',
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#f8fafc',
    marginTop: 25,
  },

  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
  },

  emptyIcon: {
    fontSize: 50,
  },

  empty: {
    color: '#cbd5f5',
    fontSize: 16,
    fontWeight: '600',
  },

  emptySub: {
    color: '#64748b',
    marginTop: 4,
  },

  card: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
  },

  row: {
    flexDirection: 'row',
    gap: 12,
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },

  placeholder: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },

  info: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  name: {
    color: '#f1f5f9',
    fontWeight: '700',
  },

  price: {
    color: '#38bdf8',
    fontWeight: '700',
  },

  description: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 4,
  },

  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 10,
  },

  qtyBtn: {
    backgroundColor: '#334155',
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  qtyBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  qtyNumber: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  customization: {
    marginTop: 10,
  },

  customText: {
    color: '#94a3b8',
    fontSize: 12,
  },

  actions: {
    flexDirection: 'row',
    marginTop: 14,
    gap: 10,
  },

  editBtn: {
    flex: 1,
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: 'center',
  },

  removeBtn: {
    flex: 1,
    backgroundColor: '#ef4444',
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: 'center',
  },

  btnText: {
    color: '#fff',
    fontWeight: '600',
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#020617',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  totalLabel: {
    color: '#94a3b8',
  },

  total: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '700',
  },
});