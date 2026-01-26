import { useRouter } from 'expo-router';
import {auth} from '../src/config/firebase';
import {ImageBackground, StyleSheet, Text, TouchableOpacity, View, Dimensions,} from 'react-native';


const { width, height } = Dimensions.get('window');

export default function LandingScreen() {
  const router = useRouter();
  console.log("Firebase user:", auth.currentUser);

  return (
    <>
    <ImageBackground 
      source={require('../assets/images/cassidy-mills-LPTUjv9l8BE-unsplash.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.brandName}>Restaurant</Text>
            <Text style={styles.brandTagline}>Premium Dining Experience</Text>
          </View>

          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome to</Text>
            <Text style={styles.mainTitle}>Culinary Excellence</Text>
            <Text style={styles.subtitle}>
              Discover extraordinary flavors and unforgettable moments in our elegant dining space
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.primaryButton} 
              onPress={() => router.push('/screens/login')}
            >
              <Text style={styles.primaryButtonText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.secondaryButton} 
              onPress={() => router.push('/screens/register')}
            >
              <Text style={styles.secondaryButtonText}>Create Account</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.tertiaryButton} 
              onPress={() => router.push('/(tabs)/menu')}
            >
              <Text style={styles.tertiaryButtonText}>Browse Menu</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Indulge in Excellence</Text>
            <View style={styles.dotsContainer}>
              <View style={[styles.dot, styles.activeDot]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>
        </View>
      </View>
      
    </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  brandName: {
    fontSize: 48,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  brandTagline: {
    fontSize: 14,
    color: '#E0E0E0',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginTop: 5,
  },
  welcomeSection: {
    alignItems: 'center',
    marginVertical: 40,
  },
  welcomeTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '300',
    marginBottom: 10,
  },
  mainTitle: {
    fontSize: 42,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#F0F0F0',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
    maxWidth: 350,
  },
  buttonContainer: {
    alignItems: 'center',
    gap: 20,
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 280,
  },
  primaryButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    minWidth: 280,
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },
  tertiaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 15,
    alignItems: 'center',
  },
  tertiaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'underline',
    letterSpacing: 0.5,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  footerText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '300',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 15,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  activeDot: {
    backgroundColor: '#FFFFFF',
  },
});
