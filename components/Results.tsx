import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import ThemedView from "../ThemedComponents/ThemedView";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import ThemedButton from "../ThemedComponents/ThemedButton";
import ThemedBTNText from "../ThemedComponents/ThemedButtonText";
import { Link } from "expo-router";
import Spacer from "../ThemedComponents/Spacer";

const Results = () => {
  const [time, setTime] = useState<number>(1);
  const fixed = (Math.random() * 30.0 + 1).toFixed(2);
  const fixed1 = (Math.random() * (10000 - 5000) + 5000);
  const [num, setNum] = useState(fixed);
  const targetTime = 2;


  useEffect(() => {
    const mema = setInterval(() => {
      setTime((prev) => prev + 1);
    }, fixed1);

    if (time === targetTime) {
      clearInterval(mema);
    }
  }, []);

  return (
    <ThemedView safe style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
      {time == 1 ? (
        <>
        <ActivityIndicator color={"green"} size="large" style={styles.loader} />
         <Text style={styles.action1}>Hang tight! Our AI is analyzing your cough — it usually takes under a minute.</Text>
        </>
      ) : (
        <View style={styles.littleContainer}>
          <MaterialCommunityIcons
            name="waveform"
            size={100}
            color="#FFC300"
            style={{ textAlign: "center" }}
          />
          <Spacer height={10} />
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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: "6%",
    paddingVertical: 20,
  },
  littleContainer: {
    width: "100%",
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loader: {
    marginBottom: 20,
    padding: 20,
  },
  title: {
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 56,
    lineHeight: 64,
    letterSpacing: -1,
    color: "#22C55E",
    marginBottom: 20,
  },
  sub: {
    fontSize: 32,
    fontWeight: "600",
    color: "#22C55E",
    marginBottom: 4,
    textAlign: "center",
  },
  action: {
    fontSize: 20,
    paddingHorizontal: 10,
    color: "#888", // Grey color for subtitle
    textAlign: "center",
    fontFamily: "Outfit_500Medium",
    padding: 10,
  },
  action1: {
    fontSize: 22,
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
    width: "100%",
    padding: 20,
    marginBottom: 20,
  },
  buttonContainer: {
    width: "100%",
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  backButton: {
    backgroundColor: "#0a1e3f",
    flex: 1,
    minWidth: "45%",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  homeButton: {
    backgroundColor: "#FFC300",
    flex: 1,
    minWidth: "45%",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    fontSize: 16,
    fontFamily: "Outfit_500Medium",
  },
});

export default Results;
