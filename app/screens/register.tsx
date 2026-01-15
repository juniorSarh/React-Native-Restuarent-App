import React, { useState } from 'react';
import { Alert } from 'react-native';
import { Box, Button, Input, VStack, Heading, ScrollView } from 'native-base';
import { useRouter } from 'expo-router';
import { registerUser } from '../services/auth';
import { isEmailValid, isPhoneValid } from '../utils/validation';

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    contactNumber: '',
    address: '',
  });

  const handleChange = (key: string, value: string) =>
    setForm({ ...form, [key]: value });

  const validateForm = () => {
    if (Object.values(form).some(v => v.trim() === ''))
      return 'All fields are required';
    if (!isEmailValid(form.email))
      return 'Invalid email address';
    if (form.password.length < 6)
      return 'Password must be at least 6 characters';
    if (!isPhoneValid(form.contactNumber))
      return 'Contact number must be at least 10 digits';
    return null;
  };

  const handleRegister = async () => {
    const error = validateForm();
    if (error) {
      Alert.alert('Validation Error', error);
      return;
    }

    try {
      await registerUser(form);
      Alert.alert('Success', 'Account created');
      router.replace('/screens/login');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <ScrollView>
      <Box p="6">
        <Heading mb="5">Register</Heading>

        <VStack space={3}>
          <Input placeholder="Name" onChangeText={v => handleChange('name', v)} />
          <Input placeholder="Surname" onChangeText={v => handleChange('surname', v)} />
          <Input placeholder="Email" keyboardType="email-address" onChangeText={v => handleChange('email', v)} />
          <Input placeholder="Password" type="password" onChangeText={v => handleChange('password', v)} />
          <Input placeholder="Contact Number" keyboardType="phone-pad" onChangeText={v => handleChange('contactNumber', v)} />
          <Input placeholder="Address" onChangeText={v => handleChange('address', v)} />

          <Button mt="4" onPress={handleRegister}>
            Create Account
          </Button>

          <Button variant="link" onPress={() => router.push('/screens/login')}>
            Already have an account? Login
          </Button>
        </VStack>
      </Box>
    </ScrollView>
  );
}
