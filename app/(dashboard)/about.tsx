import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import ThemedView from "../../components/ThemedView";
import ThemedText from "../../components/ThemedText";
import hirayon from "../../assets/tbFamilyy.jpg";
import React from "react";
import Spacer from "../../components/Spacer";
import { router } from "expo-router";
import meme from "../../assets/meme.png";
import meow from "../../assets/meow.png";

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

const about = () => {
  return (
    <ThemedView style={styles.container} safe={true}>
      <ThemedText title={true} secondary={false} style={styles.title}>
        About <Text style={styles.sub}>Us</Text>
      </ThemedText>

      {aboutUs.map((a) => {
        return (
          <React.Fragment key={a.id}>
            <View style={styles.secondContainer}>
              <TouchableOpacity style={styles.littleContainer}
                onPress={() => handlePress(a.link)}
              >
                <Image source={a.image} style={styles.img} />
              </TouchableOpacity>

              <View
                style={{
                  flexDirection: "column",
                  width: 170,
                  justifyContent: "center",
                }}
              >
                <Text style={styles.text}>{a.title}</Text>
                <Text style={styles.subtitle}>
                  {a.subtitle}
                </Text>
              </View>
            </View>

            <Spacer height={10}/>
          </React.Fragment>
        );
      })}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
  secondContainer: {
    flexDirection: "row", // horizontal row
    flexWrap: "wrap", // allow items to wrap to next line
    justifyContent: "space-between", // space between items
    padding: 20,
  },
  title: {
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 32,
    lineHeight: 45,
    letterSpacing: -1,
    top: -5,
    color: "#0a1e3f",
    marginBottom: 20
  },
  sub: {
    color: "#FFC300",
  },

  littleContainer: {
    width: 180,
    height: 180,
    borderColor: "#000",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.005,
    shadowRadius: 5,
    elevation: 1,
  },
  img: {
    width: 180,
    height: 180,
    borderRadius: 15,
    objectFit: "cover",
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

export default about;
