import { StyleSheet, Text, View, ImageBackground, FlatList, Dimensions, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useFonts } from "expo-font";
import {
  Poppins_400Regular,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import { Outfit_500Medium } from "@expo-google-fonts/outfit";
import TBFamily from "../assets/firstBox1.png"
import ph from "../assets/ph.png"
import hp from "../assets/hp.png"
import ThemedBTNText from '../components/ThemedButtonText';
import { Link } from 'expo-router';

interface story {
  id: number,
  image: number,
  title: string,
  desc: string
}

const st: story[] = [{
  id: 1,
  image: TBFamily,
  title: "A Family Broken Every 15 Minutes",
  desc: "Every single day, nearly 100 Filipinos die from Tuberculosis. That is 100 families who lose a father, a mother, or a child to a silent killer."
},
{
  id: 2,
  image: ph,
  title: "Our #1 Invisible Enemy",
  desc: "Tuberculosis is the top infectious killer in the Philippines. It takes more lives than any other communicable disease, yet it often spreads unnoticed until it’s too late."
},
{
  id: 3,
  image: hp,
  title: "A Preventable Tragedy",
  desc: "The worst part? TB is curable. We built NuSuri to detect it early—so no family has to say goodbye too soon."
}];

const { width } = Dimensions.get("window");

const secondBox = () => {
  const insets = useSafeAreaInsets()
  const [index, setIndex] = useState(0);

  const [loaded] = useFonts({
    Poppins_400Regular,
    Outfit_500Medium,
    Poppins_600SemiBold,
  });

  const handleScroll = (e: any) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    setIndex(newIndex);
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={st}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
            <ImageBackground 
    style={[
      styles.container,
      {
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        width: width,
      }
    ]}
    resizeMode="stretch"
    source={item.image}
  >
    <View style={styles.littleContainer}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.text}>{item.desc}</Text>
    </View>

    {/* DOTS NOW INSIDE IMAGE */}
    <View style={styles.dotsInside}>
      {st.map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            index === i && styles.activeDot
          ]}
        />
      ))}
    </View>

    {index === 2 ? <TouchableOpacity style={styles.button}>
        <Link href={"/about"} style={{height: 20}}>
        <ThemedBTNText style={styles.buttonText}>Done</ThemedBTNText>
        </Link>
    </TouchableOpacity>: null}

  </ImageBackground>
)}
      />

      
    </View>
  );
}

export default secondBox

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center"
  },
  title: {
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 24,
    lineHeight: 45,
    letterSpacing: -1,
    top: -5,
    color: "#FFFFFF",
    marginBottom: 0
  },
  text: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
    textAlign: "center",
    paddingHorizontal: 15
  },
  littleContainer: {
    marginTop: -650
  },

  /* DOTS */
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 25,
  },
  dot: {
    height: 8,
    width: 8,
    backgroundColor: "#aaa",
    borderRadius: 50,
    marginHorizontal: 5,
  },
  activeDot: {
    width: 20,
    backgroundColor: "#fff",
  },
  dotsInside: {
  flexDirection: "row",
  justifyContent: "center",
  marginTop: 20,
},
button: {
    backgroundColor: "transparent",
    width: 370,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    top: 650,
    left: 20
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
