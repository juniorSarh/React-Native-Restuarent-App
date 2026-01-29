import { useRouter } from "expo-router";
import { signOut, updateEmail } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { auth, db } from "../../src/config/firebase";

type UserProfile = {
  name: string;
  surname: string;
  email: string;
  contactNumber: string;
  address: string;
  cardDetails?: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
  };
  createdAt?: any;
};

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile | null>(null);

  /* =======================
     FETCH USER PROFILE
  ======================= */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          router.replace("/");
          return;
        }

        const ref = doc(db, "users", currentUser.uid);
        const snapshot = await getDoc(ref);

        if (snapshot.exists()) {
          setUser(snapshot.data() as UserProfile);
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  /* =======================
     SIGN OUT
  ======================= */
  const handleSignOut = async () => {
    await signOut(auth);
    router.replace("/");
  };

  /* =======================
     EDIT PROFILE
  ======================= */
  const handleEdit = () => {
    setFormData(user);
    setEditing(true);
  };

  const handleCancel = () => {
    setFormData(null);
    setEditing(false);
  };

  const handleSave = async () => {
    if (!formData || !auth.currentUser) return;

    try {
      // Update email if changed
      if (formData.email !== user?.email) {
        await updateEmail(auth.currentUser, formData.email);
      }

      // Update profile in Firestore
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, formData);
      
      setUser(formData);
      setFormData(null);
      setEditing(false);
      
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error: any) {
      console.error("Profile update error:", error);
      Alert.alert("Error", error.message || "Failed to update profile");
    }
  };

  const updateFormData = (field: string, value: string) => {
    if (!formData) return;
    
    if (field.startsWith('cardDetails.')) {
      const cardField = field.split('.')[1];
      setFormData({
        ...formData,
        cardDetails: {
          cardNumber: '',
          expiryDate: '',
          cvv: '',
          cardholderName: '',
          ...formData.cardDetails,
          [cardField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [field]: value
      });
    }
  };

  /* =======================
     PROFILE OPTIONS
  ======================= */
  const profileOptions = [
    {
      id: 1,
      title: "Personal Information",
      icon: "👤",
      onPress: () => router.push("/(tabs)/home"),
    },
    {
      id: 2,
      title: "Order History",
      icon: "📦",
      onPress: () => router.push("/(tabs)/orders"),
    },
    {
      id: 3,
      title: "Settings",
      icon: "⚙️",
      onPress: () => router.push("/(tabs)/home"),
    },
    {
      id: 4,
      title: "Sign Out",
      icon: "🚪",
      onPress: handleSignOut,
    },
  ];

  /* =======================
     LOADING STATE
  ======================= */
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!user) return null;

  const initials = (user.name[0] || '') + (user.surname[0] || '');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Manage your account</Text>
        {!editing && (
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.profileContainer}>
        {/* =======================
            PROFILE CARD
        ======================= */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {editing ? (
                <View style={styles.nameRow}>
                  <TextInput
                    style={styles.nameInput}
                    value={formData?.name || ''}
                    onChangeText={(value) => updateFormData('name', value)}
                    placeholder="First Name"
                  />
                  <TextInput
                    style={styles.nameInput}
                    value={formData?.surname || ''}
                    onChangeText={(value) => updateFormData('surname', value)}
                    placeholder="Last Name"
                  />
                </View>
              ) : (
                `${user.name} ${user.surname}`
              )}
            </Text>
            
            {editing ? (
              <TextInput
                style={styles.emailInput}
                value={formData?.email || ''}
                onChangeText={(value) => updateFormData('email', value)}
                placeholder="Email"
                keyboardType="email-address"
              />
            ) : (
              <Text style={styles.profileEmail}>{user.email}</Text>
            )}
            
            <Text style={styles.profileMember}>Registered user</Text>
          </View>
        </View>

        {/* =======================
            PERSONAL INFORMATION
        ======================= */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Contact Number:</Text>
            {editing ? (
              <TextInput
                style={styles.fieldInput}
                value={formData?.contactNumber || ''}
                onChangeText={(value) => updateFormData('contactNumber', value)}
                placeholder="Contact Number"
                keyboardType="phone-pad"
              />
            ) : (
              <Text style={styles.fieldValue}>{user.contactNumber || 'Not provided'}</Text>
            )}
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Address:</Text>
            {editing ? (
              <TextInput
                style={[styles.fieldInput, styles.addressInput]}
                value={formData?.address || ''}
                onChangeText={(value) => updateFormData('address', value)}
                placeholder="Address"
                multiline
                numberOfLines={3}
              />
            ) : (
              <Text style={styles.fieldValue}>{user.address || 'Not provided'}</Text>
            )}
          </View>
        </View>

        {/* =======================
            PAYMENT INFORMATION
        ======================= */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
          
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Card Number:</Text>
            {editing ? (
              <TextInput
                style={styles.fieldInput}
                value={formData?.cardDetails?.cardNumber || ''}
                onChangeText={(value) => updateFormData('cardDetails.cardNumber', value)}
                placeholder="1234 5678 9012 3456"
                keyboardType="numeric"
                maxLength={19}
              />
            ) : (
              <Text style={styles.fieldValue}>
                {user.cardDetails?.cardNumber ? `**** **** **** ${user.cardDetails.cardNumber.slice(-4)}` : 'Not provided'}
              </Text>
            )}
          </View>

          <View style={styles.cardRow}>
            <View style={styles.halfField}>
              <Text style={styles.fieldLabel}>Expiry Date:</Text>
              {editing ? (
                <TextInput
                  style={styles.fieldInput}
                  value={formData?.cardDetails?.expiryDate || ''}
                  onChangeText={(value) => updateFormData('cardDetails.expiryDate', value)}
                  placeholder="MM/YY"
                  maxLength={5}
                />
              ) : (
                <Text style={styles.fieldValue}>{user.cardDetails?.expiryDate || 'Not provided'}</Text>
              )}
            </View>

            <View style={styles.halfField}>
              <Text style={styles.fieldLabel}>CVV:</Text>
              {editing ? (
                <TextInput
                  style={styles.fieldInput}
                  value={formData?.cardDetails?.cvv || ''}
                  onChangeText={(value) => updateFormData('cardDetails.cvv', value)}
                  placeholder="123"
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                />
              ) : (
                <Text style={styles.fieldValue}>***</Text>
              )}
            </View>
          </View>

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Cardholder Name:</Text>
            {editing ? (
              <TextInput
                style={styles.fieldInput}
                value={formData?.cardDetails?.cardholderName || ''}
                onChangeText={(value) => updateFormData('cardDetails.cardholderName', value)}
                placeholder="Name on card"
              />
            ) : (
              <Text style={styles.fieldValue}>{user.cardDetails?.cardholderName || 'Not provided'}</Text>
            )}
          </View>
        </View>

        {/* =======================
            EDIT ACTIONS
        ======================= */}
        {editing && (
          <View style={styles.editActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* =======================
            QUICK ACTIONS
        ======================= */}
        {!editing && (
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => router.push("/(tabs)/orders")}
            >
              <View style={styles.optionIcon}>
                <Text style={styles.optionEmoji}>📦</Text>
              </View>
              <Text style={styles.optionTitle}>Order History</Text>
              <Text style={styles.arrowText}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionItem}
              onPress={handleSignOut}
            >
              <View style={styles.optionIcon}>
                <Text style={styles.optionEmoji}>🚪</Text>
              </View>
              <Text style={styles.optionTitle}>Sign Out</Text>
              <Text style={styles.arrowText}>›</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

/* =======================
   STYLES
======================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a1a1a" },
  header: { padding: 20, paddingTop: 60, alignItems: "center" },
  title: { fontSize: 32, fontWeight: "700", color: "#fff" },
  subtitle: { color: "#aaa" },

  profileContainer: { paddingHorizontal: 20 },
  profileCard: {
    backgroundColor: "#2a2a2a",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: "#3a3a3a",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  avatarText: { fontSize: 32, fontWeight: "700", color: "#fff" },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 20, color: "#fff", fontWeight: "700" },
  profileEmail: { color: "#bbb", marginTop: 4 },
  profileMember: { color: "#888", marginTop: 4 },

  optionsContainer: { marginBottom: 30 },
  optionItem: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  optionIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#3a3a3a",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  optionEmoji: { fontSize: 20 },
  optionTitle: { flex: 1, color: "#fff", fontWeight: "600" },
  arrowText: { color: "#aaa", fontSize: 22 },

  // Edit button styles
  editButton: {
    backgroundColor: "#4fc3f7",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },

  // Form styles
  nameRow: {
    flexDirection: "row",
    gap: 10,
  },
  nameInput: {
    flex: 1,
    backgroundColor: "#333",
    color: "#fff",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  emailInput: {
    backgroundColor: "#333",
    color: "#fff",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    marginTop: 8,
  },

  // Section styles
  section: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 15,
  },

  // Field styles
  fieldRow: {
    marginBottom: 15,
  },
  fieldLabel: {
    color: "#bbb",
    fontSize: 14,
    marginBottom: 5,
  },
  fieldValue: {
    color: "#fff",
    fontSize: 16,
  },
  fieldInput: {
    backgroundColor: "#333",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  addressInput: {
    height: 80,
    textAlignVertical: "top",
  },

  // Card styles
  cardRow: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 15,
  },
  halfField: {
    flex: 1,
  },

  // Edit actions
  editActions: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#666",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#4fc3f7",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },

  footer: { alignItems: "center", paddingVertical: 30 },
  footerText: { color: "#666" },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
  },
});
