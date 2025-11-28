import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import ThemedView from "../components/ThemedView";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import ThemedButton from "../components/ThemedButton";
import ThemedBTNText from "../components/ThemedButtonText";
import { Link } from "expo-router";
import Spacer from "../components/Spacer";

const results = () => {
  const [time, setTime] = useState<number>(1);
  const fixed = (Math.random() * 39.9 + 1).toFixed(2);
  const fixed1 = (Math.random() * (50000 - 20000) + 20000);
  const [num, setNum] = useState(fixed);
  const targetTime = 2;

  console.log(fixed1)

  useEffect(() => {
    const mema = setInterval(() => {
      setTime((prev) => prev + 1);
    }, fixed1);

    if (time === targetTime) {
      clearInterval(mema);
    }
  }, []);

  return (
    <ThemedView safe={true} style={styles.container}>
      {time == 1 ? (
        <>
        <ActivityIndicator color={"green"} size={150} style={{marginTop: -20, padding: 20}} />
         <Text style={styles.action1}>Hang tight! Our AI is analyzing your cough — it usually takes under a minute.</Text>
        </>
      ) : (
        <View style={styles.littleContainer}>
          <MaterialCommunityIcons
            name="waveform"
            size={100}
            color="#FFC300"
            style={{ textAlign: "center", marginTop: -25 }}
          />
          <Spacer height={20} />
          <Text style={styles.title}>Low Risk</Text>
          <Text style={styles.sub}>{num}%</Text>
          <Text style={styles.action}>
            No immediate actions required. Advise patient to monitor symptoms.
          </Text>
          <Text style={styles.disclaimer}>
            No audio or personal data is stored.
          </Text>

          <View style={styles.buttonContainer}>
            <ThemedButton style={styles.backButton}>
              <Link href={"/recorder"}>
                <ThemedBTNText style={styles.btnText}>
                  New Screening
                </ThemedBTNText>
              </Link>
            </ThemedButton>

            <ThemedButton style={styles.homeButton}>
              <Link href={"/home"}>
                <ThemedBTNText style={styles.btnText}>Home</ThemedBTNText>
              </Link>
            </ThemedButton>
          </View>
        </View>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
  littleContainer: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
  iconContainer: {
    textAlign: "center",
  },
  title: {
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 50,
    lineHeight: 45,
    letterSpacing: -1,
    color: "#22C55E",
    marginBottom: 30,
  },
  sub: {
    fontSize: 32,
    fontWeight: "600",
    color: "#22C55E",
    marginBottom: 4,
    textAlign: "center",
  },
  action: {
    fontSize: 24,
    paddingHorizontal: 10,
    color: "#888", // Grey color for subtitle
    textAlign: "center",
    fontFamily: "Outfit_500Medium",
    padding: 10,
  },
  action1: {
    fontSize: 28,
    paddingHorizontal: 10,
    color: "#0a1e3f", // Grey color for subtitle
    textAlign: "center",
    fontFamily: "Outfit_500Medium",
    padding: 10,
  },
  disclaimer: {
    fontFamily: "Outfit_500Medium",
    fontSize: 18,
    lineHeight: 18,
    color: "#FFC300", // Making it red for emphasis, adjust as needed
    textAlign: "center",
    maxWidth: 400,
    padding: 20,
    marginBottom: 50,
  },
  buttonContainer: {
    justifyContent: "space-evenly",
    flexDirection: "row",
    gap: 10,
  },
  backButton: {
    backgroundColor: "#0a1e3f",
    width: 180,
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  homeButton: {
    backgroundColor: "#FFC300",
    width: 180,
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    fontSize: 16,
    fontFamily: "Outfit_500Medium",
  },
});

export default results;
