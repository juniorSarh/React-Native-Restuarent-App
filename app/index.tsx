import { View, StyleSheet } from "react-native";
import { Button, Text } from "react-native-elements";

export default function LandingScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text h2 style={styles.title}>
        Restaurant App
      </Text>

      <Text style={styles.subtitle}>
        Order your favourite meals with ease
      </Text>

      <View style={styles.buttons}>
        <Button
          title="Login"
          onPress={() => navigation.navigate("Login")}
          buttonStyle={styles.button}
        />

        <Button
          title="Register"
          type="outline"
          onPress={() => navigation.navigate("Register")}
          buttonStyle={styles.button}
        />

        <Button
          title="View Menu"
          type="clear"
          onPress={() => navigation.navigate("Home")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundImage: './assets/images/cassidy-mills-LPTUjv9l8BE-unsplash.jpg',
  },
  title: {
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 30,
    fontSize: 16,
  },
  buttons: {
    gap: 15,
  },
  button: {
    paddingVertical: 12,
  },
});
