import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { loginUser } from './services/auth'

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await loginUser(email, password);
      Alert.alert('Success', 'Logged in successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>

      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={inputStyle} />
      <TextInput placeholder="Password" value={password} secureTextEntry onChangeText={setPassword} style={inputStyle} />

      <Button title="Login" onPress={handleLogin} />
      <Text style={{ marginTop: 15 }} onPress={() => navigation.navigate('Register')}>
        Don't have an account? Register
      </Text>
    </View>
  );
}

const inputStyle = {
  borderWidth: 1,
  borderColor: '#ccc',
  padding: 10,
  marginBottom: 10,
  borderRadius: 5,
};
