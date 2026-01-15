import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView } from 'react-native';
import { registerUser } from './services/auth'

export default function RegisterScreen({ navigation }: any) {
  const [form, setForm] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    contactNumber: '',
    address: '',
  });

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleRegister = async () => {
    try {
      if (Object.values(form).some(v => v.trim() === '')) {
        Alert.alert('Error', 'All fields are required');
        return;
      }

      await registerUser(form);
      Alert.alert('Success', 'Account created');
      navigation.navigate('Login');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Register</Text>

      <TextInput placeholder="Name" onChangeText={v => handleChange('name', v)} style={inputStyle} />
      <TextInput placeholder="Surname" onChangeText={v => handleChange('surname', v)} style={inputStyle} />
      <TextInput placeholder="Email" keyboardType="email-address" onChangeText={v => handleChange('email', v)} style={inputStyle} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={v => handleChange('password', v)} style={inputStyle} />
      <TextInput placeholder="Contact Number" keyboardType="phone-pad" onChangeText={v => handleChange('contactNumber', v)} style={inputStyle} />
      <TextInput placeholder="Address" onChangeText={v => handleChange('address', v)} style={inputStyle} />

      <Button title="Register" onPress={handleRegister} />
      <Text style={{ marginTop: 15 }} onPress={() => navigation.navigate('Login')}>
        Already have an account? Login
      </Text>
    </ScrollView>
  );
}

const inputStyle = {
  borderWidth: 1,
  borderColor: '#ccc',
  padding: 10,
  marginBottom: 10,
  borderRadius: 5,
};
