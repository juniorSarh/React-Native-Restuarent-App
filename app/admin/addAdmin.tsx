import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { registerAdmin } from "../../src/services/auth";
import { useRouter } from "expo-router";

export default function AddAdmin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  // ✅ Simple validation
  const validate = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return false;
    }

    if (!email.includes("@")) {
      Alert.alert("Error", "Enter a valid email");
      return false;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      await registerAdmin({ email, password });

      Alert.alert("Success", "Admin created successfully 🎉", [
        {
          text: "OK",
          onPress: () => router.replace("/admin/dashboard"),
        },
      ]);
    } catch (err) {
      Alert.alert("Error", "Failed to create admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* 🏠 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/admin/dashboard")}>
          <Text style={styles.homeBtn}>🏠 Home</Text>
        </TouchableOpacity>
      </View>

      {/* 📌 Title */}
      <Text style={styles.title}>Create Admin</Text>
      <Text style={styles.subtitle}>
        Add a new administrator to your system
      </Text>

      {/* 📧 Email */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        placeholder="Enter admin email"
        placeholderTextColor="#9ca3af"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {/* 🔑 Password */}
      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Enter password"
          placeholderTextColor="#9ca3af"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secure}
          style={styles.passwordInput}
        />

        <TouchableOpacity onPress={() => setSecure(!secure)}>
          <Text style={styles.showText}>
            {secure ? "Show" : "Hide"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 🚀 Submit Button */}
      <TouchableOpacity
        style={[styles.btn, loading && { opacity: 0.6 }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Create Admin</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#0f172a",
  },

  header: {
    marginBottom: 20,
  },

  homeBtn: {
    color: "#38bdf8",
    fontSize: 16,
    fontWeight: "600",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 5,
  },

  subtitle: {
    fontSize: 14,
    color: "#9ca3af",
    marginBottom: 25,
  },

  label: {
    color: "#e5e7eb",
    marginBottom: 6,
    fontSize: 14,
  },

  input: {
    backgroundColor: "#1e293b",
    color: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#334155",
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 18,
    paddingRight: 10,
  },

  passwordInput: {
    flex: 1,
    color: "#fff",
    padding: 14,
  },

  showText: {
    color: "#38bdf8",
    fontWeight: "600",
  },

  btn: {
    backgroundColor: "#22c55e",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    elevation: 5,
  },

  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});