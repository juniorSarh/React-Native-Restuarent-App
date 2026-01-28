import { Checkout } from '@/src/components/Checkout';
import { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCart } from '../../src/context/CartContext';
import { createOrder } from '../../src/services/orders';



export default function CartScreen() {
  const { items, total, clearCart, removeFromCart, updateQuantity, itemCount } = useCart();
  const [placingOrder, setPlacingOrder] = useState(false);

  const placeOrder = async () => {
    if (items.length === 0) {
      Alert.alert("Cart Empty", "Please add items to your cart first");
      return;
    }

    setPlacingOrder(true);
    try {
      await createOrder(items, total);
      clearCart();
      Alert.alert("Success", "Order placed successfully!");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setPlacingOrder(false);
    }
  };

  const renderCartItem = ({ item }: { item: any }) => {
    const { customization } = item;
    
    // Safety check for item and customization
    if (!item) return null;
    
    return (
      <View style={styles.cartItem}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemName}>{item.name || 'Unknown Item'}</Text>
          <Text style={styles.itemPrice}>R {(item.totalPrice || 0).toFixed(2)}</Text>
        </View>
        
        <View style={styles.quantityControls}>
          <TouchableOpacity 
            style={styles.quantityBtn}
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
          >
            <Text style={styles.quantityBtnText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity || 0}</Text>
          <TouchableOpacity 
            style={styles.quantityBtn}
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Text style={styles.quantityBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Customization Summary */}
        <View style={styles.customizationSummary}>
          {customization?.selectedSides?.length > 0 && (
            <Text style={styles.customizationText}>
              Sides: {customization.selectedSides.join(', ')}
            </Text>
          )}
          {customization?.selectedDrinks?.length > 0 && (
            <Text style={styles.customizationText}>
              Drinks: {customization.selectedDrinks.join(', ')}
            </Text>
          )}
          {customization?.extras?.length > 0 && (
            <Text style={styles.customizationText}>
              Extras: {customization.extras.map((e: any) => `${e.name} x${e.quantity}`).join(', ')}
            </Text>
          )}
          {customization?.removedIngredients?.length > 0 && (
            <Text style={styles.customizationText}>
              No: {customization.removedIngredients.join(', ')}
            </Text>
          )}
          {customization?.addedIngredients?.length > 0 && (
            <Text style={styles.customizationText}>
              Extra: {customization.addedIngredients.join(', ')}
            </Text>
          )}
          {customization?.specialInstructions && (
            <Text style={styles.customizationText}>
              Notes: {customization.specialInstructions}
            </Text>
          )}
        </View>

        <TouchableOpacity 
          style={styles.removeBtn}
          onPress={() => removeFromCart(item.id)}
        >
          <Text style={styles.removeBtnText}>Remove</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <Text style={styles.emptySubtext}>Add some delicious items to get started!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cart ({itemCount})</Text>
        <TouchableOpacity onPress={clearCart}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={renderCartItem}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>R {total.toFixed(2)}</Text>
        </View>

        <Checkout items={items} total={total} onSuccess={clearCart} />
      </View>
    </View>
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
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  clearText: {
    color: '#ff6b6b',
    fontSize: 14,
  },
  list: {
    flex: 1,
    padding: 20,
  },
  cartItem: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4fc3f7',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  quantityBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#444',
  },
  quantityText: {
    fontSize: 16,
    color: '#fff',
    marginHorizontal: 10,
  },
  quantityBtnText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  customizationSummary: {
    marginBottom: 10,
  },
  customizationText: {
    fontSize: 14,
    color: '#fff',
  },
  removeBtn: {
    backgroundColor: '#ff6b6b',
    padding: 10,
    borderRadius: 10,
  },
  removeBtnText: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#072a9c',
  },
  emptySubtext: {
    fontSize: 16,
    color: '#072a9c',
    marginTop: 10,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4fc3f7',
  },
  placeOrderBtn: {
    backgroundColor: '#4fc3f7',
    padding: 15,
    borderRadius: 10,
  },
  disabledBtn: {
    backgroundColor: '#666',
  },
  placeOrderText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
});