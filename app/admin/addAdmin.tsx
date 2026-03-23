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
      return Alert.alert("Error", "Fill all fields");
    }

    try {
      await registerAdmin({ email, password });
      Alert.alert("Success", "Admin created");
      router.back();
    } catch (err) {
      Alert.alert("Error", "Failed to create admin");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Admin</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
        <Text style={styles.text}>Create Admin</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#111827" },
  title: { fontSize: 22, color: "#fff", marginBottom: 20 },
  input: {
    backgroundColor: "#1f2937",
    color: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  btn: {
    backgroundColor: "#10b981",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  text: { color: "#fff" },
});