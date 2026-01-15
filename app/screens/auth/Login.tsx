import { View, StyleSheet, Alert } from "react-native";
import { Input, Button, Text } from "react-native-elements";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/Firebase";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace("Home");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text h3>Login</Text>

      <Input placeholder="Email" onChangeText={setEmail} />
      <Input placeholder="Password" secureTextEntry onChangeText={setPassword} />

      <Button title="Login" onPress={login} />
      <Button type="clear" title="Register" onPress={() => navigation.navigate("Register")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
});
