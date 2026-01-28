import { useRouter } from 'expo-router';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../src/config/firebase';

type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

interface Order {
  id: string;
  userId: string;
  items: any[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus?: string;
  createdAt: any;
  updatedAt?: any;
}

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [previousStatuses, setPreviousStatuses] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    // Use a simpler query that doesn't require composite index
    const q = query(
      collection(db, "orders"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData: Order[] = snapshot.docs.map(doc => ({
        id: doc.id,
        userId: doc.data().userId,
        items: doc.data().items || [],
        totalAmount: doc.data().totalAmount || 0,
        status: doc.data().status || 'pending',
        paymentStatus: doc.data().paymentStatus,
        createdAt: doc.data().createdAt,
        updatedAt: doc.data().updatedAt,
      }));
      
      // Sort client-side by createdAt (newest first)
      ordersData.sort((a, b) => {
        const aTime = a.createdAt?.toMillis() || 0;
        const bTime = b.createdAt?.toMillis() || 0;
        return bTime - aTime;
      });
      
      // Check for status changes and show notifications
      ordersData.forEach(order => {
        const previousStatus = previousStatuses[order.id];
        const currentStatus = order.status;
        
        if (previousStatus && previousStatus !== currentStatus) {
          // Show alert for status change
          let title = '';
          let message = '';
          
          switch (currentStatus) {
            case 'preparing':
              title = '👨‍🍳 Order Started';
              message = `Order #${order.id.slice(-8)} is now being prepared!`;
              break;
            case 'ready':
              title = '✅ Order Ready!';
              message = `Order #${order.id.slice(-8)} is ready for pickup!`;
              break;
            case 'completed':
              title = '🎉 Order Completed';
              message = `Order #${order.id.slice(-8)} has been completed. Enjoy!`;
              break;
            case 'cancelled':
              title = '❌ Order Cancelled';
              message = `Order #${order.id.slice(-8)} has been cancelled.`;
              break;
          }
          
          if (title) {
            Alert.alert(title, message);
          }
        }
      });
      
      // Update previous statuses
      const newStatuses: {[key: string]: string} = {};
      ordersData.forEach(order => {
        newStatuses[order.id] = order.status;
      });
      setPreviousStatuses(newStatuses);
      
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching orders:", error);
      // Handle index error gracefully
      if (error.message.includes('requires an index')) {
        Alert.alert(
          "Database Setup Required",
          "Please create the Firestore index. Check the console for the link or contact support.",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert("Error", "Failed to load orders. Please try again.");
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [previousStatuses]);

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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '🕐 Pending';
      case 'preparing': return '👨‍🍳 Preparing';
      case 'ready': return '✅ Ready for Pickup';
      case 'completed': return '🎉 Completed';
      case 'cancelled': return '❌ Cancelled';
      default: return '📋 Unknown';
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
            <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
          </View>
        </View>

        <View style={styles.orderContent}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Items</Text>
            {item.items?.map((cartItem: any, index: number) => {
              if (!cartItem) return null;
              return (
              <View key={index} style={styles.orderItem}>
                <View style={styles.itemHeader}>
                  <Text style={styles.orderId}>
                    Order #{item.id.slice(-8)}
                  </Text>
                  <Text style={styles.itemPrice}>
                    R {(cartItem?.totalPrice || 0).toFixed(2)}
                  </Text>
                </View>
                {/* Customization Details */}
                {cartItem.customization && (
                  <View style={styles.customizationDetails}>
                    {cartItem.customization?.selectedSides?.length > 0 && (
                      <Text style={styles.customText}>
                        Sides: {cartItem.customization.selectedSides.join(', ')}
                      </Text>
                    )}
                    {cartItem.customization?.selectedDrinks?.length > 0 && (
                      <Text style={styles.customText}>
                        Drinks: {cartItem.customization.selectedDrinks.join(', ')}
                      </Text>
                    )}
                    {cartItem.customization?.extras?.length > 0 && (
                      <Text style={styles.customText}>
                        Extras: {cartItem.customization.extras.map((e: any) => e.name + ' x' + e.quantity).join(', ')}
                      </Text>
                    )}
                    {cartItem.customization?.removedIngredients?.length > 0 && (
                      <Text style={styles.customText}>
                        No: {cartItem.customization.removedIngredients.join(', ')}
                      </Text>
                    )}
                    {cartItem.customization?.addedIngredients?.length > 0 && (
                      <Text style={styles.customText}>
                        Extra: {cartItem.customization.addedIngredients.join(', ')}
                      </Text>
                    )}
                    {cartItem.customization?.specialInstructions && (
                      <Text style={styles.customText}>
                        Notes: {cartItem.customization.specialInstructions}
                      </Text>
                    )}
                  </View>
                )}
              </View>
              );
            })}
          </View>

          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalAmount}>
              R {item.totalAmount?.toFixed(2) || '0.00'}
            </Text>
          </View>

          {item.paymentStatus && (
            <View style={styles.paymentStatus}>
              <Text style={styles.paymentText}>
                Payment: {item.paymentStatus === 'paid' ? '✅ Paid' : '💳 Unpaid'}
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {item.status === 'ready' && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.completedBtn]}
              onPress={() => Alert.alert("Order Ready", "Your order is ready for pickup!")}
            >
              <Text style={styles.actionBtnText}>View Details</Text>
            </TouchableOpacity>
          )}
          
          {item.status === 'completed' && (
            <TouchableOpacity
              style={[styles.actionBtn, styles.reorderBtn]}
              onPress={() => router.push('/(tabs)/menu')}
            >
              <Text style={styles.actionBtnText}>Order Again</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Orders</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your orders...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
        <Text style={styles.subtitle}>{orders.length} orders</Text>
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No orders yet</Text>
          <Text style={styles.emptySubtext}>Place your first order to see it here!</Text>
          <TouchableOpacity
            style={styles.orderNowBtn}
            onPress={() => router.push('/(tabs)/menu')}
          >
            <Text style={styles.orderNowBtnText}>Order Now</Text>
          </TouchableOpacity>
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
  subtitle: {
    fontSize: 14,
    color: '#B0B0B0',
  },
  list: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#B0B0B0',
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
    marginBottom: 20,
  },
  orderNowBtn: {
    backgroundColor: '#4fc3f7',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  orderNowBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
    marginBottom: 10,
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
  paymentStatus: {
    marginBottom: 10,
  },
  paymentText: {
    fontSize: 12,
    color: '#B0B0B0',
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
  completedBtn: {
    backgroundColor: '#4caf50',
  },
  reorderBtn: {
    backgroundColor: '#2196f3',
  },
});
