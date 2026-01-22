import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../../src/config/firebase";

type UserProfile = {
  name: string;
  surname: string;
  email: string;
  contactNumber: string;
  address: string;
  createdAt?: any;
};

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  /* =======================
     FETCH USER PROFILE
  ======================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          router.replace("/");
          return;
        }

        const ref = doc(db, "users", currentUser.uid);
        const snapshot = await getDoc(ref);

        if (snapshot.exists()) {
          setUser(snapshot.data() as UserProfile);
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  /* =======================
     SIGN OUT
  ======================= */
  const handleSignOut = async () => {
    await signOut(auth);
    router.replace("/");
  };

  /* =======================
     PROFILE OPTIONS
  ======================= */
  const profileOptions = [
    {
      id: 1,
      title: "Personal Information",
      icon: "👤",
      onPress: () => router.push("/(tabs)/home"),
    },
    {
      id: 2,
      title: "Order History",
      icon: "📦",
      onPress: () => router.push("/(tabs)/cart"),
    },
    {
      id: 3,
      title: "Settings",
      icon: "⚙️",
      onPress: () => router.push("/(tabs)/home"),
    },
    {
      id: 4,
      title: "Sign Out",
      icon: "🚪",
      onPress: handleSignOut,
    },
  ];

  /* =======================
     LOADING STATE
  ======================= */
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!user) return null;

  const initials = `${user.name[0]}${user.surname[0]}`;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Manage your account</Text>
      </View>

      <ScrollView style={styles.profileContainer}>
        {/* =======================
            PROFILE CARD
        ======================= */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {user.name} {user.surname}
            </Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
            <Text style={styles.profileMember}>Registered user</Text>
          </View>
        </View>

        {/* =======================
            OPTIONS
        ======================= */}
        <View style={styles.optionsContainer}>
          {profileOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionItem}
              onPress={option.onPress}
            >
              <View style={styles.optionIcon}>
                <Text style={styles.optionEmoji}>{option.icon}</Text>
              </View>
              <Text style={styles.optionTitle}>{option.title}</Text>
              <Text style={styles.arrowText}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Restaurant App v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

/* =======================
   STYLES
======================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a1a1a" },
  header: { padding: 20, paddingTop: 60, alignItems: "center" },
  title: { fontSize: 32, fontWeight: "700", color: "#fff" },
  subtitle: { color: "#aaa" },

  profileContainer: { paddingHorizontal: 20 },
  profileCard: {
    backgroundColor: "#2a2a2a",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: "#3a3a3a",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  avatarText: { fontSize: 32, fontWeight: "700", color: "#fff" },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 20, color: "#fff", fontWeight: "700" },
  profileEmail: { color: "#bbb", marginTop: 4 },
  profileMember: { color: "#888", marginTop: 4 },

  optionsContainer: { marginBottom: 30 },
  optionItem: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  optionIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#3a3a3a",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  optionEmoji: { fontSize: 20 },
  optionTitle: { flex: 1, color: "#fff", fontWeight: "600" },
  arrowText: { color: "#aaa", fontSize: 22 },

  footer: { alignItems: "center", paddingVertical: 30 },
  footerText: { color: "#666" },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
  },
});
