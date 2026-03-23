import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../../src/config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function AdminProfile() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");

  const uid = auth.currentUser?.uid;

  // 📥 Load admin data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (!uid) return;

        const docRef = doc(db, "admins", uid);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          const data = snap.data();
          setName(data.name || "");
          setSurname(data.surname || "");
          setEmail(data.email || "");
        }
      } catch (error) {
        console.log("Profile error:", error);
        Alert.alert("Error", "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // 💾 Save profile
  const handleSave = async () => {
    if (!name || !surname) {
      return Alert.alert("Error", "Name and surname required");
    }

    try {
      setSaving(true);

      const docRef = doc(db, "admins", uid!);

      await updateDoc(docRef, {
        name,
        surname,
      });

      Alert.alert("Success", "Profile updated ✅");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // 🚪 Logout
  const handleLogout = async () => {
    await auth.signOut();
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
        {/* <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backBtn}>⬅ Back</Text>
        </TouchableOpacity> */}

        <TouchableOpacity onPress={() => router.replace("/admin/dashboard")}>
          <Text style={styles.homeBtn}>🏠 Home</Text>
        </TouchableOpacity>
      </View>

      {/* 👤 Avatar */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {name?.charAt(0) || "A"}
        </Text>
      </View>

      {/* 📄 Info */}
      <Text style={styles.title}>Admin Profile</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholder="Enter name"
        placeholderTextColor="#9ca3af"
      />

      <Text style={styles.label}>Surname</Text>
      <TextInput
        value={surname}
        onChangeText={setSurname}
        style={styles.input}
        placeholder="Enter surname"
        placeholderTextColor="#9ca3af"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        editable={false}
        style={[styles.input, { opacity: 0.6 }]}
      />

      {/* 💾 Save */}
      <TouchableOpacity
        style={[styles.saveBtn, saving && { opacity: 0.6 }]}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveText}>Save Changes</Text>
        )}
      </TouchableOpacity>

      {/* 🚪 Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 20,
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
    marginBottom: 20,
    marginTop: 50,
  },

  backBtn: {
    color: "#38bdf8",
    fontWeight: "600",
  },

  homeBtn: {
    color: "#22c55e",
    fontWeight: "600",
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1e293b",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 15,
  },

  avatarText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },

  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },

  label: {
    color: "#e5e7eb",
    marginBottom: 6,
    marginTop: 10,
  },

  input: {
    backgroundColor: "#1e293b",
    color: "#fff",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },

  saveBtn: {
    backgroundColor: "#22c55e",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },

  saveText: {
    color: "#fff",
    fontWeight: "600",
  },

  logoutBtn: {
    marginTop: 15,
    backgroundColor: "#ef4444",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  logoutText: {
    color: "#fff",
    fontWeight: "600",
  },
});