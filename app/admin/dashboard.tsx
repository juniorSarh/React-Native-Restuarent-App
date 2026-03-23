import { useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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

        const ordersSnap = await getDocs(collection(db, "orders"));
        let revenue = 0;

        ordersSnap.forEach((doc) => {
          revenue += doc.data().totalAmount || 0;
        });

        const usersSnap = await getDocs(collection(db, "users"));

        setStats({
          orders: ordersSnap.size,
          revenue,
          users: usersSnap.size,
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
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🔝 Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Welcome Admin 👋</Text>
          <Text style={styles.title}>Dashboard</Text>
        </View>

        <View style={styles.headerActions}>
          {/* 👤 Profile */}
          <TouchableOpacity
            onPress={() => router.push("/admin/adminProfile")}
            style={styles.profileBtn}
          >
            <Text style={styles.profileText}>👤</Text>
          </TouchableOpacity>

          {/* 🚪 Logout */}
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* 📊 Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Orders</Text>
            <Text style={styles.cardValue}>{stats.orders}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>Revenue</Text>
            <Text style={styles.cardValue}>
              R {stats.revenue.toFixed(2)}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>Users</Text>
            <Text style={styles.cardValue}>{stats.users}</Text>
          </View>
        </View>

        {/* ⚡ Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/admin/foodItems")}
          >
            <Text style={styles.actionText}>🍔 Manage Menu</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/admin/orders")}
          >
            <Text style={styles.actionText}>📦 View Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>👥 Manage Users</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/admin/addAdmin")}
          >
            <Text style={styles.actionText}>➕ Add Admin</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
  },

  welcome: {
    color: "#9ca3af",
    fontSize: 14,
  },

  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  profileBtn: {
    backgroundColor: "#1e293b",
    padding: 10,
    borderRadius: 10,
  },

  profileText: {
    fontSize: 18,
  },

  logoutButton: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "600",
  },

  content: {
    padding: 20,
  },

  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },

  card: {
    backgroundColor: "#1e293b",
    flex: 1,
    marginHorizontal: 5,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  cardLabel: {
    color: "#9ca3af",
    marginBottom: 6,
  },

  cardValue: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  actionsSection: {
    marginTop: 10,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
  },

  actionButton: {
    backgroundColor: "#1e293b",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },

  actionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});