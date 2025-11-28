import { StyleSheet, View, Animated, Image, Text } from "react-native"; // 💥 Import Animated
import ThemedText from "../components/ThemedText";
import ThemedView from "../components/ThemedView";
import Spacer from "../components/Spacer";
import ThemedImage from "../components/ThemedImage";
import { useFonts } from "expo-font";
import {
  Poppins_400Regular,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import { Outfit_500Medium } from "@expo-google-fonts/outfit";
import ThemedButton from "../components/ThemedButton";
import { Link, Redirect } from "expo-router";
import { useColorScheme } from "react-native";
import { Colors } from "../constants/Colors";
import { useEffect, useRef } from "react"; // 💥 Import useEffect and useRef
import Nusuri from "../assets/geh.png";
import hirayon from "../assets/hirayon.png";
import iconics from "../assets/iconics.png"
import ThemedBTNText from "../components/ThemedButtonText";
import { LinearGradient } from "expo-linear-gradient";

const HomeMema = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme ? Colors[colorScheme] : Colors.dark;
  const [loaded] = useFonts({
    Poppins_400Regular,
    Outfit_500Medium,
    Poppins_600SemiBold,
  });

  // 💥 NEW: Animated Value for Opacity 💥
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, // Animate to opacity: 1
      duration: 1000, // 1000 milliseconds = 1 second
      useNativeDriver: true, // Use native driver for performance
    }).start(); // Start the animation
  }, [fadeAnim]); // Run this effect once when the component mounts

  if (!loaded) return null;

  return (
    <ThemedView safe={true} style={styles.container}>
      <LinearGradient
      colors={['#e6f0fa', '#ffffff']} // light blue to white
      start={{ x: 0.5, y: 0 }} // top center
      end={{ x: 0.5, y: 1 }}   // bottom center
      style={styles.background}
    />
      <View style={styles.littleContainer}>
        <ThemedImage style={styles.img} />
      </View>

      <View style={styles.littleContainer1}>
        <Image source={hirayon} style={styles.img2} />
      </View>

      <View style={styles.littleContainer2}>
        <Image source={Nusuri} style={styles.img1} />
      </View>

      <View style={styles.littleContainer3}>
        <ThemedText title={false} secondary={false} style={styles.text1} adjustsFontSizeToFit>
          Simplifying Screening, Prioritizing Speeding{" "}
          <Text style={styles.title}>Recovery.</Text>
        </ThemedText>
      </View>

      <View style={styles.littleContainer4}>
        <ThemedText title={false} secondary={false} style={styles.text2}>
          Just Cough, and we take it from there—screening, triage, and faster
          care made simple.
        </ThemedText>
      </View>

       <View style={styles.littleContainer5}>
       <Image source={iconics} style={styles.img3}/>
      </View>


      <ThemedButton style={styles.button}>
        
        <Link href={"/home"} style={{height: 20}}>
        <ThemedBTNText style={styles.buttonText}>Kickstart Triage!</ThemedBTNText>
        </Link>
      </ThemedButton>
        
    </ThemedView>
  );
};

export default HomeMema;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  title: {
    color: "#FFC300",
  },
  img: {
    width: 130,
    height: 350,
    marginVertical: 10,
    objectFit: "contain",
  },
  img1: {
    width: 750,
    height: 750,
    marginTop: 30,
    objectFit: "contain",
  },
  img2: {
    width: 130,
    height: 350,
    marginTop: 30,
    objectFit: "contain",
  },
  img3: {
    width: 320,
    height: 300,
    objectFit: "contain",
  },
  disclaimerText: {
    fontFamily: "Outfit_500Medium",
    fontSize: 12,
    lineHeight: 18,
    color: "#FFC300", // Making it red for emphasis, adjust as needed
    textAlign: "center",
    maxWidth: 350,
  },
  littleContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flex: 1,
    top: -140,
    left: -120,
  },
  littleContainer1: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flex: 1,
    top: -265,
    left: 120,
  },
  littleContainer2: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    top: 20,
  },
  littleContainer3: {
    justifyContent: "center",
    alignItems: "center",
    top: 120,
  },
  littleContainer4: {
    justifyContent: "center",
    alignItems: "center",
    top: 140,
  },
   littleContainer5: {
    justifyContent: "center",
    alignItems: "center",
    top: 55
  },
  text1: {
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 36,
    lineHeight: 45,
    letterSpacing: -1,
    paddingHorizontal: 15,
    color: "#0a1e3f",
  },
  text2: {
    textAlign: "center",
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: -1,
    paddingHorizontal: 17.5,
    color: "#0a1e3f",
  },
  button: {
    backgroundColor: "#0a1e3f",
    width: 370,
    height: 70,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    top: -20
  },

  buttonText: {
    fontFamily: "Outfit_500Medium",
    fontSize: 20,
    lineHeight: 18,
    color: "white", // Making it red for emphasis, adjust as needed
    textAlign: "center",
    width: 200,
    height: 20
  },
});
