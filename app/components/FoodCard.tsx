import { View, Image, StyleSheet } from "react-native";
import { Text } from "react-native-elements";

export default function FoodCard({ food }: any) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: food.image }} style={styles.image} />
      <Text style={styles.title}>{food.name}</Text>
      <Text>R {food.price}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  image: { height: 120, borderRadius: 10 },
  title: { fontSize: 18, fontWeight: "bold" },
});
