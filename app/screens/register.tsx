import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { registerUser } from '../../src/services/auth';
import { isEmailValid, isPhoneValid } from '../../src/utils/validation';

const { width, height } = Dimensions.get('window');

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
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.brandName}>Restaurant</Text>
          <Text style={styles.brandTagline}>Premium Dining Experience</Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.title}>Join Our Community</Text>
          <Text style={styles.subtitle}>Create your account to start your culinary journey</Text>

          <View style={styles.form}>
            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfInput]}>
                <TextInput
                  style={styles.input}
                  placeholder="First Name"
                  placeholderTextColor="#999"
                  onChangeText={v => handleChange('name', v)}
                />
              </View>
              
              <View style={[styles.inputContainer, styles.halfInput]}>
                <TextInput
                  style={styles.input}
                  placeholder="Last Name"
                  placeholderTextColor="#999"
                  onChangeText={v => handleChange('surname', v)}
                />
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#999"
                onChangeText={v => handleChange('email', v)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                onChangeText={v => handleChange('password', v)}
                secureTextEntry
              />
            </View>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor="#999"
                onChangeText={v => handleChange('contactNumber', v)}
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Home Address"
                placeholderTextColor="#999"
                onChangeText={v => handleChange('address', v)}
              />
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={handleRegister}>
              <Text style={styles.primaryButtonText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/screens/login')}>
            <Text style={styles.linkText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 40,
    minHeight: height,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 30,
  },
  brandName: {
    fontSize: 42,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  brandTagline: {
    fontSize: 12,
    color: '#E0E0E0',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginTop: 5,
  },
  formSection: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  form: {
    width: '100%',
    maxWidth: 350,
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  halfInput: {
    width: '48%',
  },
  inputContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  input: {
    padding: 18,
    fontSize: 16,
    color: '#FFFFFF',
    backgroundColor: 'transparent',
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginTop: 10,
  },
  primaryButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  footerText: {
    color: '#B0B0B0',
    fontSize: 14,
    marginBottom: 10,
  },
  linkText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
