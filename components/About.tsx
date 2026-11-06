import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import ThemedView from "../ThemedComponents/ThemedView";
import ThemedText from "../ThemedComponents/ThemedText";
import hirayon from "../assets/tbFamilyy.jpg";
import React from "react";
import { router } from "expo-router";
import meme from "../assets/meme.png";
import meow from "../assets/meow.png";

interface StoryBook {
  id: number;
  image: number;
  title: string;
  subtitle: string;
  link: string;
}

const aboutUs: StoryBook[] = [
  {
    id: 1,
    image: hirayon,
    title: "Why We Built This?",
    subtitle:
      "Addressing the hidden crisis of Tuberculosis in the Philippines.",
    link: "/firstBox",
  },
  {
    id: 2,
    image: meme,
    title: "What is NuSuri?",
    subtitle: "Fast and simple AI-powered cough triage.",
    link: "/secondBox",
  },
  {
    id: 3,
    image: meow,
    title: "Who We Are?",
    subtitle: "The minds—engineers, mentors, dreamers—driving the code.",
    link: "/thirdBox",
  }
];

const handlePress = (url? : string) => {
    url ? router.navigate(url) : router.navigate("/about")
}

const AboutPage = () => {
  return (
    <ThemedView style={styles.container} safe>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText title secondary={false} style={styles.title}>
          About <Text style={styles.sub}>Us</Text>
        </ThemedText>

        {aboutUs.map((a) => (
          <View style={styles.secondContainer} key={a.id}>
            <TouchableOpacity
              style={styles.littleContainer}
              onPress={() => handlePress(a.link)}
              accessibilityRole="button"
              accessibilityLabel={`${a.title}: ${a.subtitle}`}
            >
              <Image source={a.image} style={styles.img} />
            </TouchableOpacity>

            <View style={styles.copy}>
              <Text style={styles.text}>{a.title}</Text>
              <Text style={styles.subtitle}>{a.subtitle}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: "5%",
    paddingVertical: 16,
    gap: 36,
  },
  secondContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  title: {
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 32,
    lineHeight: 45,
    letterSpacing: -1,
    color: "#0a1e3f",
    marginBottom: 8,
  },
  sub: {
    color: "#FFC300",
  },

  littleContainer: {
    width: "50%",
    aspectRatio: 1,
    borderColor: "#000",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.005,
    shadowRadius: 5,
    elevation: 1,
  },
  img: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
    objectFit: "cover",
  },
  copy: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
    textAlign: "left",
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "left", // Grey color for subtitle
  },
});

export default AboutPage;
