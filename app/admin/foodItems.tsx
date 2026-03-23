import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
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
  const [modalVisible, setModalVisible] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [available, setAvailable] = useState(true);
  const [image, setImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    return listenToFoodItems(setFoods);
  }, []);

  const openModal = () => setModalVisible(true);
  const closeModal = () => {
    setModalVisible(false);
    resetForm();
  };

  const resetForm = () => {
    setEditing(null);
    setName("");
    setDescription("");
    setPrice("");
    setCategory("");
    setAvailable(true);
    setImage(null);
    setImageUrl("");
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageUrl("");
    }
  };

  const saveFood = async () => {
    if (!name || !price) {
      return Alert.alert("Error", "Name and price required");
    }

    let finalImageUrl = editing?.imageUrl || "";

    if (image && image !== editing?.imageUrl) {
      try {
        finalImageUrl = await uploadImage(image, `food/${Date.now()}.jpg`);
      } catch {
        Alert.alert("Image upload failed, saving without image");
      }
    } else if (imageUrl) {
      finalImageUrl = imageUrl;
    }

    const payload = {
      name,
      description,
      price: Number(price),
      category,
      available,
      imageUrl: finalImageUrl,
    };

    try {
      if (editing) {
        await updateFoodItem(editing.id, payload);
      } else {
        await addFoodItem(payload);
      }

      closeModal();
      Alert.alert("Success", "Saved successfully 🎉");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const editFood = (item: any) => {
    setEditing(item);
    setName(item.name);
    setDescription(item.description);
    setPrice(item.price.toString());
    setCategory(item.category);
    setAvailable(item.available);
    setImage(item.imageUrl);
    setImageUrl(item.imageUrl || "");
    openModal();
  };

  return (
    <View style={styles.container}>
      {/* 🔝 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>⬅ Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Food Manager</Text>
      </View>

      {/* ➕ Add Button */}
      <TouchableOpacity style={styles.addBtn} onPress={openModal}>
        <Text style={styles.addText}>＋</Text>
      </TouchableOpacity>

      {/* 📋 List */}
      <FlatList
        data={foods}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.imageUrl && (
              <Image source={{ uri: item.imageUrl }} style={styles.img} />
            )}

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>R {item.price}</Text>
            </View>

            <TouchableOpacity onPress={() => editFood(item)}>
              <Text style={styles.edit}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
  onPress={() => {
    Alert.alert(
      "Confirm",
      "Are you sure you want to delete this item?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteFoodItem(item.id) },
      ]
    );
  }}
>
  <Text style={styles.delete}>Delete</Text>
</TouchableOpacity>
          </View>
        )}
      />

      {/* 🧾 MODAL FORM */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>
            {editing ? "Edit Food" : "Add Food"}
          </Text>

          <TextInput placeholder="Name" style={styles.input} value={name} onChangeText={setName} />
          <TextInput placeholder="Description" style={styles.input} value={description} onChangeText={setDescription} />
          <TextInput placeholder="Price" style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" />
          <TextInput placeholder="Category" style={styles.input} value={category} onChangeText={setCategory} />

          {/* <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
            <Text style={{ color: "#fff" }}>Pick Image</Text>
          </TouchableOpacity> */}

          <TextInput
            placeholder="Or Image URL"
            style={styles.input}
            value={imageUrl}
            onChangeText={(t) => {
              setImageUrl(t);
              setImage(null);
            }}
          />

          {(image || imageUrl) && (
            <Image source={{ uri: image || imageUrl }} style={styles.preview} />
          )}

          <TouchableOpacity style={styles.saveBtn} onPress={saveFood}>
            <Text style={{ color: "#fff" }}>
              {editing ? "Update" : "Save"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={closeModal}>
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a", padding: 20 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  back: { color: "#38bdf8", marginRight: 10 },

  title: { color: "#fff", fontSize: 24, fontWeight: "700" },

  addBtn: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#22c55e",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  addText: { color: "#fff", fontSize: 30 },

  card: {
    flexDirection: "row",
    backgroundColor: "#1e293b",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: "center",
  },

  img: { width: 60, height: 60, borderRadius: 10, marginRight: 10 },

  name: { color: "#fff", fontWeight: "700" },

  price: { color: "#9ca3af" },

  edit: { color: "#38bdf8", marginRight: 10 },

  delete: { color: "#ef4444" },

  modal: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 20,
    paddingTop: 60,
  },

  modalTitle: {
    color: "#fff",
    fontSize: 22,
    marginBottom: 20,
    fontWeight: "700",
  },

  input: {
    backgroundColor: "#1e293b",
    color: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },

  imageBtn: {
    backgroundColor: "#334155",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },

  preview: { width: 100, height: 100, borderRadius: 10 },

  saveBtn: {
    backgroundColor: "#22c55e",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  cancel: {
    color: "#ef4444",
    textAlign: "center",
    marginTop: 15,
  },
});