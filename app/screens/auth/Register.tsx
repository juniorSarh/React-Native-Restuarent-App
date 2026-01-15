import { View, StyleSheet, Alert } from "react-native";
import { Input, Button, Text } from "react-native-elements";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../services/Firebase";

export default function RegisterScreen({ navigation }: any) {
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    card: "",
  });

  const register = async () => {
    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      await setDoc(doc(db, "users", res.user.uid), {
        ...form,
        uid: res.user.uid,
        role: "user",
      });

      navigation.replace("Home");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text h3>Register</Text>

      <Input placeholder="Name" onChangeText={(v) => setForm({ ...form, name: v })} />
      <Input placeholder="Surname" onChangeText={(v) => setForm({ ...form, surname: v })} />
      <Input placeholder="Email" onChangeText={(v) => setForm({ ...form, email: v })} />
      <Input placeholder="Password" secureTextEntry onChangeText={(v) => setForm({ ...form, password: v })} />
      <Input placeholder="Contact Number" onChangeText={(v) => setForm({ ...form, phone: v })} />
      <Input placeholder="Address" onChangeText={(v) => setForm({ ...form, address: v })} />
      <Input placeholder="Card Details (Fake)" onChangeText={(v) => setForm({ ...form, card: v })} />

      <Button title="Register" onPress={register} />
      <Button type="clear" title="Go to Login" onPress={() => navigation.navigate("Login")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
});
