import { useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { db } from "../../src/config/firebase";
import { checkIsAdmin } from "../../src/services/admin";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ orders: 0, revenue: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const guard = async () => {
      const isAdmin = await checkIsAdmin();
      if (!isAdmin) {
        router.replace("/(tabs)/home");
      }
    };
    guard();
  }, []);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const isAdmin = await checkIsAdmin();
        if (!isAdmin) return;

        // Get orders
        const ordersSnap = await getDocs(collection(db, "orders"));
        let revenue = 0;
        ordersSnap.forEach(doc => {
          revenue += doc.data().totalAmount || 0;
        });

        // Get users
        const usersSnap = await getDocs(collection(db, "users"));

        setStats({ 
          orders: ordersSnap.size, 
          revenue,
          users: usersSnap.size
        });
      } catch (error) {
        console.error("Error loading admin stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const handleLogout = () => {
    router.replace("/screens/login");
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
        <Text style={styles.title}>Admin Dashboard</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsGrid}>
          <View style={styles.card}>
            <Text style={styles.label}>Total Orders</Text>
            <Text style={styles.value}>{stats.orders}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Revenue</Text>
            <Text style={styles.value}>R {stats.revenue.toFixed(2)}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Total Users</Text>
            <Text style={styles.value}>{stats.users}</Text>
          </View>
        </View>

        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push("/admin/foodItems")}>
            <Text style={styles.actionText}>Manage Menu</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push("/admin/orders")}>
            <Text style={styles.actionText}>View Orders</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>Manage Users</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#121212", 
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#1a1a1a',
  },
  title: { 
    color: "#fff", 
    fontSize: 26, 
    fontWeight: "700" 
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsGrid: {
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#1f1f1f",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  label: { 
    color: "#aaa",
    fontSize: 14,
    marginBottom: 8,
  },
  value: { 
    color: "#fff", 
    fontSize: 24, 
    fontWeight: "700" 
  },
  actionsSection: {
    marginTop: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
