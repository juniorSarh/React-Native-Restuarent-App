import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();

  const profileOptions = [
    { id: 1, title: 'Personal Information', icon: '👤', onPress: () => {} },
    { id: 2, title: 'Order History', icon: '📦', onPress: () => {} },
    { id: 3, title: 'Payment Methods', icon: '💳', onPress: () => {} },
    { id: 4, title: 'Addresses', icon: '📍', onPress: () => {} },
    { id: 5, title: 'Notifications', icon: '🔔', onPress: () => {} },
    { id: 6, title: 'Settings', icon: '⚙️', onPress: () => {} },
    { id: 7, title: 'Help & Support', icon: '💬', onPress: () => {} },
    { id: 8, title: 'Sign Out', icon: '🚪', onPress: () => router.replace('/') },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Manage your account</Text>
      </View>

      <ScrollView style={styles.profileContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>John Doe</Text>
            <Text style={styles.profileEmail}>john.doe@example.com</Text>
            <Text style={styles.profileMember}>Member since 2024</Text>
          </View>
        </View>

        <View style={styles.optionsContainer}>
          {profileOptions.map((option) => (
            <TouchableOpacity key={option.id} style={styles.optionItem} onPress={option.onPress}>
              <View style={styles.optionIcon}>
                <Text style={styles.optionEmoji}>{option.icon}</Text>
              </View>
              <Text style={styles.optionTitle}>{option.title}</Text>
              <View style={styles.optionArrow}>
                <Text style={styles.arrowText}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Restaurant App v1.0.0</Text>
          <Text style={styles.footerSubtext}>© 2024 All rights reserved</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
  },
  profileContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: '#3a3a3a',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: '#B0B0B0',
    marginBottom: 5,
  },
  profileMember: {
    fontSize: 14,
    color: '#999',
  },
  optionsContainer: {
    marginBottom: 30,
  },
  optionItem: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  optionIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#3a3a3a',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionEmoji: {
    fontSize: 20,
  },
  optionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  optionArrow: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 20,
    color: '#B0B0B0',
    fontWeight: '300',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#666',
  },
});
