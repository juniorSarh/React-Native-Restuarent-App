import { View, FlatList, Image, StyleSheet } from "react-native";
import { Text, Card } from "react-native-elements";

const FOOD = [
  {
    id: "1",
    name: "Beef Burger",
    price: 89.99,
    category: "Burgers",
    image: "https://via.placeholder.com/150",
  },
  {
    id: "2",
    name: "Chicken Wings",
    price: 59.99,
    category: "Starters",
    image: "https://via.placeholder.com/150",
  },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text h3>Menu</Text>

      <FlatList
        data={FOOD}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text h4>{item.name}</Text>
            <Text>R {item.price}</Text>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10 },
  image: { height: 120, borderRadius: 10 },
});
