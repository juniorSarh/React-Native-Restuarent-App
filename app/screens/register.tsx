import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { registerUser } from '../../src/services/auth';
import { isEmailValid, isPhoneValid } from '../../src/utils/validation';

export default function RegisterScreen() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    contactNumber: '',
    address: '',
  });

  const validate = () => {
    if (Object.values(form).some(v => v.trim() === ''))
      return 'All fields are required';
    if (!isEmailValid(form.email))
      return 'Invalid email address';
    if (form.password.length < 6)
      return 'Password must be at least 6 characters';
    if (!isPhoneValid(form.contactNumber))
      return 'Invalid contact number';
    return null;
  };

  const handleRegister = async () => {
    const error = validate();
    if (error) return Alert.alert('Error', error);

    try {
      await registerUser(form);
      Alert.alert('Success', 'Account created');
      router.replace('/screens/home');
    } catch (err: any) {
      Alert.alert('Registration Failed', err.message);
    }
  };

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          onChangeText={v => handleChange('name', v)}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Surname"
          onChangeText={v => handleChange('surname', v)}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={v => handleChange('email', v)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={v => handleChange('password', v)}
          secureTextEntry
        />
        
        <TextInput
          style={styles.input}
          placeholder="Contact Number"
          onChangeText={v => handleChange('contactNumber', v)}
          keyboardType="phone-pad"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Address"
          onChangeText={v => handleChange('address', v)}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => router.push('/screens/login')}>
          <Text style={styles.link}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 300,
    alignSelf: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
