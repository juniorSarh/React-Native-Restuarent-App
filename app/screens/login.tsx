import React, { useState } from 'react';
import { Alert } from 'react-native';
import { Box, Button, Input, VStack, Heading } from 'native-base';
import { useRouter } from 'expo-router';
import { loginUser } from '../services/auth';
import { isEmailValid } from '../utils/validation';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and password are required');
      return;
    }

    if (!isEmailValid(email)) {
      Alert.alert('Error', 'Invalid email address');
      return;
    }

    try {
      await loginUser(email, password);
      Alert.alert('Success', 'Welcome back!');
      router.replace('/screens/home');
    } catch (err: any) {
      Alert.alert('Login Failed', err.message);
    }
  };

  return (
    <Box p="6">
      <Heading mb="5">Login</Heading>

      <VStack space={3}>
        <Input placeholder="Email" value={email} onChangeText={setEmail} />
        <Input placeholder="Password" type="password" value={password} onChangeText={setPassword} />

        <Button mt="4" onPress={handleLogin}>
          Login
        </Button>

        <Button variant="link" onPress={() => router.push('/screens/register')}>
          Don’t have an account? Register
        </Button>
      </VStack>
    </Box>
  );
}
