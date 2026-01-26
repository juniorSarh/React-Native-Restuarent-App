import { Stack } from 'expo-router';
import { CartProvider } from '../src/context/CartContext';

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="screens/login" />
        <Stack.Screen name="screens/register" />
        <Stack.Screen name="screens/home" />
        <Stack.Screen name="admin/dashboard" />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </CartProvider>
  );
}
