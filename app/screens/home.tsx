import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to tabs/home after successful authentication
    const timer = setTimeout(() => {
      router.replace('/(tabs)/home');
    }, 100);
    
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
