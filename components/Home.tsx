import {
  StyleSheet,
  useColorScheme,
  View,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import ThemedView from "../ThemedComponents/ThemedView";
import ThemedImage from "../ThemedComponents/ThemedImage";
import ThemedText from "../ThemedComponents/ThemedText";
import { useFonts } from "expo-font";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import { Outfit_500Medium, Outfit_300Light } from "@expo-google-fonts/outfit";
import ThemedButton from "../ThemedComponents/ThemedButton";
import { Colors } from "../constants/Colors";
import { Link } from "expo-router";
import { useState } from "react";


const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const theme = colorScheme ? Colors[colorScheme] : Colors.dark;
  const [loaded] = useFonts({
    Poppins_400Regular,
    Outfit_500Medium,
    Poppins_600SemiBold,
    Outfit_300Light,
    Poppins_500Medium,
  });

  if (!loaded) return null;

  if (loading) {
    return (
      <View style={styles.anotherContainer}>
        <ActivityIndicator size="large" color={theme.button2} />
      </View>
    );
  }

  return (
    <ThemedView safe style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText title={false} secondary={true} style={styles.disclaimerText}>
          Disclaimer: This app provides screening information only and is not a
          substitute for professional medical advice or diagnosis. Consult a
          doctor for any health concerns.
        </ThemedText>
        <ThemedImage style={styles.img} resizeMode="contain" />

        <ThemedText secondary={false} title={false} style={styles.text1}>
          Start recording your cough to assess your tuberculosis risk and take
          immediate action.
        </ThemedText>

        <ThemedButton style={styles.button1}>
          <Link href="/survey" style={styles.buttonLink}>
            New Recordings
          </Link>
        </ThemedButton>
      </ScrollView>
    </ThemedView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: "6%",
    paddingVertical: 20,
    gap: 20,
  },
  disclaimerText: {
    width: "100%",
    fontFamily: "Outfit_500Medium",
    fontSize: 14,
    lineHeight: 20,
    color: "#FFC300",
    textAlign: "center",
  },
  img: {
    width: "100%",
    aspectRatio: 0,
    objectFit: "contain",
  },
  text1: {
    fontFamily: "Outfit_300Light",
    fontSize: 18,
    lineHeight: 28,
    letterSpacing: -1,
    textAlign: "center",
    textAlignVertical: "center",
    width: "100%",
    color: "#FFC300",
  },
  button1: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 18,
    backgroundColor: "#FFC300",
  },
  buttonLink: {
    width: "100%",
    color: "#FFF",
    fontFamily: "Poppins_500Medium",
    fontSize: 15,
    textAlign: "center",
  },
  anotherContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
});
