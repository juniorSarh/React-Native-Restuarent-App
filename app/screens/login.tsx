import React, { useState } from 'react';
import { Alert } from 'react-native';
import {
  Box,
  Button,
  Input,
  VStack,
  Heading
} from 'native-base';
import { loginUser } from '../services/auth';
import { isEmailValid } from '../utils/validation';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and password are required');
      return;
    }

    if (!isEmailValid(email)) {
      Alert.alert('Error', 'Invalid email format');
      return;
    }

    try {
      await loginUser(email, password);
      Alert.alert('Success', 'Logged in successfully');
    } catch (err: any) {
      Alert.alert('Login Failed', err.message);
    }
  };

  return (
    <Box p="5">
      <Heading mb="5">Login</Heading>

      <VStack space={3}>
        <Input placeholder="Email" value={email} onChangeText={setEmail} />
        <Input placeholder="Password" type="password" value={password} onChangeText={setPassword} />

        <Button mt="4" onPress={handleLogin}>
          Login
        </Button>

        <Button variant="link" onPress={() => navigation.navigate('Register')}>
          Don't have an account? Register
        </Button>
      </VStack>
    </Box>
  );
}
