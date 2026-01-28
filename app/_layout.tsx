import { Stack } from 'expo-router';
import { CartProvider } from '../src/context/CartContext';
import {PaystackProvider} from "react-native-paystack-webview";


const paystackPublicKey = 'pk_test_745afea5d10e39659b36a024d451e440b55396c0'; // Replace with your Paystack public key`
export default function RootLayout() {
  return (
    <CartProvider>
      <PaystackProvider publicKey={paystackPublicKey}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="screens/login" />
        <Stack.Screen name="screens/register" />
        <Stack.Screen name="screens/home" />
        <Stack.Screen name="admin/dashboard" />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </PaystackProvider>
  </CartProvider>
  );
}
