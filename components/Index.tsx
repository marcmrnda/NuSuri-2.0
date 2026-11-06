import {
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { useFonts } from "expo-font";

import {
  Poppins_400Regular,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

import { Outfit_500Medium } from "@expo-google-fonts/outfit";

import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ThemedText from "../ThemedComponents/ThemedText";
import ThemedView from "../ThemedComponents/ThemedView";
import ThemedImage from "../ThemedComponents/ThemedImage";
import ThemedButton from "../ThemedComponents/ThemedButton";
import ThemedBTNText from "../ThemedComponents/ThemedButtonText";

import Nusuri from "../assets/geh.png";
import hirayon from "../assets/hirayon.png";
import iconics from "../assets/iconics.png";

const Index = () => {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const contentHeight = height - insets.top - insets.bottom;

  // Responsive spacing
  const spacing = Math.min(16, Math.max(6, contentHeight * 0.015));

  // Responsive side images
  const sideImageSize = Math.min(
    width * 0.24,
    contentHeight * 0.13,
    140
  );

  // Responsive main logo
  const logoSize = Math.min(
    width * 0.48,
    contentHeight * 0.22,
    260
  );

  // Responsive features image
  const featureWidth = Math.min(
    width * 0.58,
    contentHeight * 0.17,
    300
  );

  // Responsive heading
  const headingFontSize = Math.min(
    36,
    width * 0.085,
    contentHeight * 0.05
  );

  // Responsive description
  const descriptionFontSize = Math.min(
    18,
    width * 0.041,
    contentHeight * 0.025
  );

  const [loaded] = useFonts({
    Poppins_400Regular,
    Outfit_500Medium,
    Poppins_600SemiBold,
  });

  if (!loaded) return null;

  return (
    <ThemedView safe style={styles.container}>
      {/* Background */}
      <LinearGradient
        colors={["#e6f0fa", "#ffffff"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.background}
      />

      {/* Main Content */}
      <View
        style={[
          styles.content,
          {
            gap: spacing,
            paddingVertical: spacing,
          },
        ]}
      >
        {/* Brand Images */}
        <View style={styles.brandImages}>
          <ThemedImage
            style={[
              styles.sideImage,
              {
                width: sideImageSize,
                height: sideImageSize,
              },
            ]}
            resizeMode="contain"
          />

          <Image
            source={hirayon}
            style={[
              styles.sideImage,
              {
                width: sideImageSize,
                height: sideImageSize,
              },
            ]}
            resizeMode="contain"
          />
        </View>

        {/* Main Logo */}
        <Image
          source={Nusuri}
          style={[
            styles.logo,
            {
              width: logoSize,
              height: logoSize / 0.8,
            },
          ]}
          resizeMode="contain"
        />

        {/* Heading */}
        <ThemedText
          title={false}
          secondary={false}
          style={[
            styles.heading,
            {
              fontSize: headingFontSize,
              lineHeight: headingFontSize * 1.25,
            },
          ]}
        >
          Simplifying Screening, Prioritizing Speeding{" "}
          <Text style={styles.title}>Recovery.</Text>
        </ThemedText>

        {/* Description */}
        <ThemedText
          title={false}
          secondary={false}
          style={[
            styles.description,
            {
              fontSize: descriptionFontSize,
              lineHeight: descriptionFontSize * 1.45,
            },
          ]}
        >
          Just Cough, and we take it from there—screening, triage, and faster
          care made simple.
        </ThemedText>

        {/* Features */}
        <Image
          source={iconics}
          style={[
            styles.features,
            {
              width: featureWidth,
              height: featureWidth,
            },
          ]}
          resizeMode="contain"
        />

        {/* Get Started Button */}
        <ThemedButton style={styles.button}>
          <Link href="/home" style={styles.buttonLink}>
            <ThemedBTNText style={styles.buttonText}>
              Kickstart Triage!
            </ThemedBTNText>
          </Link>
        </ThemedButton>
      </View>
    </ThemedView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  background: {
    ...StyleSheet.absoluteFillObject,
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: "6%",
  },

  brandImages: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sideImage: {
    flexShrink: 0,
  },

  logo: {
    flexShrink: 0,
    transform: [{ scale: 3 }],
  },

  title: {
    color: "#FFC300",
  },

  heading: {
    width: "110%",
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
    letterSpacing: -1,
    color: "#0a1e3f",
  },

  description: {
    width: "105%",
    textAlign: "center",
    fontFamily: "Poppins_400Regular",
    letterSpacing: -0.5,
    color: "#0a1e3f",
  },

  features: {
    flexShrink: 0,
    transform: [{scale: 2}]
  },

  button: {
    width: "100%",
    backgroundColor: "#0a1e3f",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 18,
  },

  buttonLink: {
    width: "100%",
    alignItems: "center",
  },

  buttonText: {
    fontFamily: "Outfit_500Medium",
    fontSize: 20,
    color: "white",
    textAlign: "center",
  },
});