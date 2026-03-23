import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { registerAdmin } from "../../src/services/auth";
import { useRouter } from "expo-router";

export default function AddAdmin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    if (!email || !password) {
      return Alert.alert("Error", "Please fill in all fields");
    }

    try {
      await registerAdmin({ email, password });
      Alert.alert("Success", "Admin created successfully");
      router.back();
    } catch (err) {
      Alert.alert("Error", "Failed to create admin");
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
      />

      {/* 🔑 Password */}
      <Text style={styles.label}>Password</Text>
      <TextInput
        placeholder="Enter password"
        placeholderTextColor="#9ca3af"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {/* 🚀 Submit Button */}
      <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
        <Text style={styles.btnText}>Create Admin</Text>
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

  btn: {
    backgroundColor: "#22c55e",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});