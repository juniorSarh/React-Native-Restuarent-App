import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LandingScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restaurant App</Text>
      <Text style={styles.subtitle}>Order your favourite meals with ease</Text>

      <View style={styles.buttons}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push('/screens/login')}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.buttonOutline]} 
          onPress={() => router.push('/screens/register')}
        >
          <Text style={[styles.buttonText, styles.buttonOutlineText]}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => router.push('/screens/home')}
        >
          <Text style={styles.linkButton}>View Menu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
    color: '#666',
  },
  buttons: {
    width: '100%',
    maxWidth: 300,
    gap: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  buttonOutlineText: {
    color: '#007AFF',
  },
  linkButton: {
    color: '#007AFF',
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
