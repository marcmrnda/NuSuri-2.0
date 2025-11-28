import {
  StyleSheet,
  useColorScheme,
  View,
  ActivityIndicator,
} from "react-native";
import ThemedView from "../../components/ThemedView";
import ThemedImage from "../../components/ThemedImage";
import ThemedText from "../../components/ThemedText";
import { useFonts } from "expo-font";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import { Outfit_500Medium, Outfit_300Light } from "@expo-google-fonts/outfit";
import Spacer from "../../components/Spacer";
import ThemedButton from "../../components/ThemedButton";
import { Colors } from "../../constants/Colors";
import { Link, router } from "expo-router";
import { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";

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
    <ThemedView safe={true} style={styles.container}>
      <ThemedText title={false} secondary={true} style={styles.disclaimerText}>
                        Disclaimer: This app provides screening information only and is not a substitute for professional medical advice or diagnosis. Consult a doctor for any health concerns.
                    </ThemedText>
      <ThemedImage style={styles.img} />

      <Spacer height={12.5} />

      <ThemedText secondary={false} title={false} style={styles.text1}>
        Start recording your cough to assess your tuberculosis risk and take
        immediate action.
      </ThemedText>

      <ThemedButton
        style={[styles.button1, { backgroundColor: "#FFC300" }]}
      >
        <Link
          href={"/recorder"}
          style={{
            color: "#FFF",
            fontFamily: "Poppins_500Medium",
            fontSize: 15,
          }}
        >
          New Recordings
        </Link>
      </ThemedButton>
    </ThemedView>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  disclaimerText: {
        fontFamily: "Outfit_500Medium",
        fontSize: 14,
        lineHeight: 18,
        color: "#FFC300", // Making it red for emphasis, adjust as needed
        textAlign: 'center',
        maxWidth: 310,
        marginTop: -70,
        top: -150
    },
  title: {
    fontFamily: "Outfit_500Medium",
    fontSize: 35,
    lineHeight: 35,
    letterSpacing: -1,
    height: 100,
    marginTop: -7,
  },
  img: {
    marginTop: -75,
    marginBottom: -175,
    width: 450,
    height: 350,
    marginVertical: 10,
    objectFit: "contain",

  },
  text: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    lineHeight: 24,
    letterSpacing: -1,
    marginTop: -63,
    width: 140,
  },
  text1: {
    fontFamily: "Outfit_300Light",
    fontSize: 18,
    lineHeight: 28,
    letterSpacing: -1,
    textAlign: "center",
    textAlignVertical: "center",
    width: 300,
    marginTop: 50,
    color: "#FFC300"
  },
  button1: {
    width: 350,
    height: 63,
    justifyContent: "center",
    alignItems: "center",
    top: 220,
  },
  anotherContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
});
