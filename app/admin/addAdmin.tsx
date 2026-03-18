import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { addAdmin } from "../../src/services/admin";

export default function AddAdmin() {
  const router = useRouter();
  const [uid, setUid] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin"); // default role

  const handleSubmit = async () => {
    if (!uid || !email || !password) {
      return Alert.alert("Error", "Please fill all fields");
    }

    try {
      await addAdmin(uid, email, password, role);
      Alert.alert("Success", "Admin created successfully!");
      setUid("");
      setEmail("");
      setPassword("");
      setRole("admin");
      router.back(); // return to dashboard
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to create admin");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Admin</Text>

      <TextInput
        placeholder="User UID"
        value={uid}
        onChangeText={setUid}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        placeholder="Role"
        value={role}
        onChangeText={setRole}
        style={styles.input}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Create Admin</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#111827" },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 20 },
  input: {
    backgroundColor: "#1f2937",
    color: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: "#10b981",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontWeight: "bold" },
});