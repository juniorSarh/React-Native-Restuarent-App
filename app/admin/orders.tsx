import { router } from 'expo-router';
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../src/config/firebase';

type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    return onSnapshot(collection(db, "orders"), snap => {
      const data: any[] = [];
      snap.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
      // Sort by createdAt (newest first)
      setOrders(data.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis()));
    });
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: newStatus,
        updatedAt: new Date()
      });
      Alert.alert("Success", `Order status updated to ${newStatus}`);
    } catch (error) {
      Alert.alert("Error", "Failed to update order status");
    }
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return 'Unknown time';
    const date = timestamp.toDate();
    return date.toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#ff9800';
      case 'preparing': return '#2196f3';
      case 'ready': return '#4caf50';
      case 'completed': return '#9e9e9e';
      case 'cancelled': return '#f44336';
      default: return '#666';
    }
  };

  const renderOrderItem = ({ item }: { item: any }) => {
    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderId}>Order #{item.id.slice(-8)}</Text>
            <Text style={styles.orderTime}>{formatTimestamp(item.createdAt)}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status?.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.orderContent}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer</Text>
            <Text style={styles.customerText}>User ID: {item.userId?.slice(-8) || 'Unknown'}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Items</Text>
            {item.items?.map((cartItem: any, index: number) => (
              <View key={index} style={styles.orderItem}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName}>{cartItem.name} x{cartItem.quantity}</Text>
                  <Text style={styles.itemPrice}>R {cartItem.totalPrice.toFixed(2)}</Text>
                </View>
                
                {/* Customization Details */}
                {cartItem.customization && (
                  <View style={styles.customizationDetails}>
                    {cartItem.customization.selectedSides?.length > 0 && (
                      <Text style={styles.customText}>
                        Sides: {cartItem.customization.selectedSides.join(', ')}
                      </Text>
                    )}
                    {cartItem.customization.selectedDrinks?.length > 0 && (
                      <Text style={styles.customText}>
                        Drinks: {cartItem.customization.selectedDrinks.join(', ')}
                      </Text>
                    )}
                    {cartItem.customization.extras?.length > 0 && (
                      <Text style={styles.customText}>
                        Extras: {cartItem.customization.extras.map((e: any) => e.name + ' x' + e.quantity).join(', ')}
                      </Text>
                    )}
                    {cartItem.customization.removedIngredients?.length > 0 && (
                      <Text style={styles.customText}>
                        No: {cartItem.customization.removedIngredients.join(', ')}
                      </Text>
                    )}
                    {cartItem.customization.addedIngredients?.length > 0 && (
                      <Text style={styles.customText}>
                        Extra: {cartItem.customization.addedIngredients.join(', ')}
                      </Text>
                    )}
                    {cartItem.customization.specialInstructions && (
                      <Text style={styles.customText}>
                        Notes: {cartItem.customization.specialInstructions}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            ))}
          </View>

          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalAmount}>R {item.totalAmount?.toFixed(2) || '0.00'}</Text>
          </View>
        </View>

        {/* Status Update Buttons */}
        <View style={styles.actionButtons}>
          {item.status === 'pending' && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.preparingBtn]}
              onPress={() => updateOrderStatus(item.id, 'preparing')}
            >
              <Text style={styles.actionBtnText}>Start Preparing</Text>
            </TouchableOpacity>
          )}
          
          {item.status === 'preparing' && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.readyBtn]}
              onPress={() => updateOrderStatus(item.id, 'ready')}
            >
              <Text style={styles.actionBtnText}>Mark Ready</Text>
            </TouchableOpacity>
          )}
          
          {item.status === 'ready' && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.completedBtn]}
              onPress={() => updateOrderStatus(item.id, 'completed')}
            >
              <Text style={styles.actionBtnText}>Complete Order</Text>
            </TouchableOpacity>
          )}
          
          {(item.status === 'pending' || item.status === 'preparing') && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.cancelBtn]}
              onPress={() => updateOrderStatus(item.id, 'cancelled')}
            >
              <Text style={styles.actionBtnText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.push("/admin/dashboard")}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Orders Management</Text>
        <Text style={styles.subtitle}>{orders.length} active orders</Text>
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No orders yet</Text>
          <Text style={styles.emptySubtext}>Orders will appear here when customers place them</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  backBtn: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  backText: {
    color: '#4fc3f7',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  list: {
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#B0B0B0',
    textAlign: 'center',
  },
  orderCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  orderTime: {
    fontSize: 12,
    color: '#B0B0B0',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  orderContent: {
    marginBottom: 15,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  customerText: {
    fontSize: 12,
    color: '#B0B0B0',
  },
  orderItem: {
    backgroundColor: '#1f1f1f',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4fc3f7',
  },
  customizationDetails: {
    marginTop: 5,
  },
  customText: {
    fontSize: 11,
    color: '#B0B0B0',
    marginBottom: 2,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4fc3f7',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  preparingBtn: {
    backgroundColor: '#2196f3',
  },
  readyBtn: {
    backgroundColor: '#4caf50',
  },
  completedBtn: {
    backgroundColor: '#9e9e9e',
  },
  cancelBtn: {
    backgroundColor: '#f44336',
  },
});
