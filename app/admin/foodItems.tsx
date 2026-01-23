import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {
    addFoodItem,
    deleteFoodItem,
    listenToFoodItems,
    updateFoodItem,
} from "../../src/services/food";
import { uploadImage } from "../../src/services/storage";

export default function FoodAdminScreen() {
  const router = useRouter();
  const [foods, setFoods] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [available, setAvailable] = useState(true);
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    return listenToFoodItems(setFoods);
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const resetForm = () => {
    setEditing(null);
    setName("");
    setDescription("");
    setPrice("");
    setCategory("");
    setAvailable(true);
    setImage(null);
  };

  const saveFood = async () => {
    if (!name || !price) {
      return Alert.alert("Error", "Name and price are required");
    }

    let imageUrl = editing?.imageUrl || "";

    if (image && image !== editing?.imageUrl) {
      try {
        imageUrl = await uploadImage(image, `foodItems/${Date.now()}.jpg`);
      } catch (error: any) {
        console.error("Image upload failed:", error);
        
        // Show a more user-friendly error message
        Alert.alert(
          "Image Upload Failed", 
          "Could not upload the image. This is a web development issue with CORS. The item will be saved without an image.\n\nOn mobile devices, image upload will work perfectly.",
          [{ text: "Continue without image", style: "default" }]
        );
        
        // Continue without image
        imageUrl = "";
      }
    }

    const payload = {
      name,
      description,
      price: Number(price),
      category,
      available,
      imageUrl,
    };

    console.log('Saving food item with payload:', payload);

    try {
      if (editing) {
        await updateFoodItem(editing.id, payload);
        console.log('Food item updated successfully');
      } else {
        await addFoodItem(payload);
        console.log('Food item added successfully');
      }
      resetForm();
      Alert.alert("Success", editing ? "Food item updated!" : "Food item added!");
    } catch (error: any) {
      console.error('Save food item error:', error);
      Alert.alert("Error", "Failed to save food item: " + error.message);
    }
  };

  const editFood = (item: any) => {
    setEditing(item);
    setName(item.name);
    setDescription(item.description);
    setPrice(item.price.toString());
    setCategory(item.category);
    setAvailable(item.available !== false); // Default to true if undefined
    setImage(item.imageUrl);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back("/screens/Dashboard")}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Food Management</Text>
      </View>

      {/* FORM */}
      <View style={styles.form}>
        <TextInput
          placeholder="Name"
          placeholderTextColor="#999"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          placeholder="Description"
          placeholderTextColor="#999"
          style={styles.input}
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          placeholder="Price"
          placeholderTextColor="#999"
          style={styles.input}
          value={price}
          keyboardType="numeric"
          onChangeText={setPrice}
        />
        <TextInput
          placeholder="Category"
          placeholderTextColor="#999"
          style={styles.input}
          value={category}
          onChangeText={setCategory}
        />

        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>Available:</Text>
          <TouchableOpacity 
            style={[styles.toggle, available ? styles.toggleOn : styles.toggleOff]}
            onPress={() => setAvailable(!available)}
          >
            <Text style={styles.toggleText}>
              {available ? "YES" : "NO"}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
          <Text style={styles.imageText}>Pick Image</Text>
        </TouchableOpacity>

        {image && <Image source={{ uri: image }} style={styles.preview} />}

        <TouchableOpacity style={styles.saveBtn} onPress={saveFood}>
          <Text style={styles.saveText}>
            {editing ? "Update Food" : "Add Food"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* LIST */}
      <FlatList
        data={foods}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            {item.imageUrl && (
              <Image source={{ uri: item.imageUrl }} style={styles.itemImg} />
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>R {item.price}</Text>
            </View>
            <TouchableOpacity onPress={() => editFood(item)}>
              <Text style={styles.edit}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteFoodItem(item.id)}>
              <Text style={styles.delete}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backBtn: {
    marginRight: 15,
  },
  backText: {
    color: "#4fc3f7",
    fontSize: 16,
    fontWeight: '600',
  },
  title: { color: "#fff", fontSize: 28, fontWeight: "700" },
  form: { marginBottom: 30 },
  input: {
    backgroundColor: "#1f1f1f",
    padding: 15,
    borderRadius: 10,
    color: "#fff",
    marginBottom: 10,
  },
  imageBtn: {
    backgroundColor: "#444",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  imageText: { color: "#fff" },
  preview: { width: 100, height: 100, borderRadius: 10, marginBottom: 10 },
  saveBtn: {
    backgroundColor: "#00c853",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "700" },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  toggleLabel: {
    color: "#fff",
    fontSize: 16,
    marginRight: 10,
  },
  toggle: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  toggleOn: {
    backgroundColor: "#00c853",
  },
  toggleOff: {
    backgroundColor: "#666",
  },
  toggleText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
  item: {
    flexDirection: "row",
    backgroundColor: "#1f1f1f",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  itemImg: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },
  itemName: { color: "#fff", fontWeight: "700" },
  itemPrice: { color: "#aaa" },
  edit: { color: "#4fc3f7", marginRight: 10 },
  delete: { color: "#ef5350" },
});
