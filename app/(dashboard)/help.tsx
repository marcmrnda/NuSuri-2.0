import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Alert,
} from "react-native";
import React from "react";
import ThemedView from "../../components/ThemedView";
import ThemedText from "../../components/ThemedText";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import Spacer from "../../components/Spacer";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";


interface Contact {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  link: string;
}

interface Help {
  id: number;
  title: string;
  icon: string;
  link: string;
}

const handlePress = (url?: string) => {
  if (url) {
    Linking.openURL(url).catch((err) => Alert.alert("Couldn't open URL:", err));
  }
};

const handlePress1 = (url?:string) => {
    if(url) {
        router.navigate(url)
    }
}

const contact: Contact[] = [
  {
    id: 1,
    title: "Call us",
    subtitle: "We are here to help you 24/7. Reach out anytime!",
    icon: "phone-alt",
    link: "tel:+639912600667",
  },
  {
    id: 2,
    title: "Email us",
    subtitle: "Send us an email and we'll get back to you ASAP.",
    icon: "voicemail",
    link: "mailto:marcmrnda@gmail.com",
  },
  {
    id: 3,
    title: "Visit our Facebook Page",
    subtitle: "Come visit our Facebook Page to contact us effortlessly.",
    icon: "facebook",
    link: "https://www.facebook.com/NuSuriPH",
  },
];

const helpTopics: Help[] = [
  {
    id: 1,
    title: "How to use",
    icon: "info-circle",
    link: "/home",
  },
  {
    id: 2,
    title: "FAQ",
    icon: "question-circle",
    link: "/home",
  },
];

const legalInfo: Help[] = [
  {
    id: 1,
    title: "Terms of Service",
    icon: "file-alt",
    link: "https://drive.google.com/file/d/1lhEuCxaQ_6gJ96W0YJ67rfYj2lQ3-sz_/view?usp=sharing",
  },
  {
    id: 2,
    title: "Privacy Policy",
    icon: "shield-alt",
    link: "https://drive.google.com/file/d/1Gq38Dhw4RIratJqXETyqhmmg3Zv0h_uM/view?usp=sharing",
  },
];

const HelpPage = () => {
  return (
    <ThemedView style={style.container} safe={true}>

      <ThemedText title={true} secondary={false} style={style.text}>
        Help <Text style={style.subtext}>&</Text> Support
      </ThemedText>

      <Text style={style.subtext1}>Guidelines</Text>

      {helpTopics.map((ack) => {
        return (
          <React.Fragment key={ack.id}>
            <TouchableOpacity style={style.littleContainer1}
            onPress={() => handlePress1(ack.link)}>
              <View style={style.iconContainer}>
                <FontAwesome5 name={ack.icon} size={24} color="#0a1e3f" />
              </View>

              <View style={style.textContainer}>
                <Text style={style.title}>{ack.title}</Text>
              </View>

              <Ionicons name="chevron-forward" size={24} color="#ccc" />
            </TouchableOpacity>

            <Spacer height={15} />
          </React.Fragment>
        );
      })}

      <Text style={style.subtext2}>Support</Text>

      {contact.map((arf) => {
        return (
          <React.Fragment key={arf.id}>
            <TouchableOpacity style={style.littleContainer} onPress={() => handlePress(arf.link)}>
              <View style={style.iconContainer}>
                <FontAwesome5 name={arf.icon} size={24} color="#0a1e3f" />
              </View>

              <View style={style.textContainer}>
                <Text style={style.title}>{arf.title}</Text>
                <Text style={style.subtitle}>{arf.subtitle}</Text>
              </View>

              <Ionicons name="chevron-forward" size={24} color="#ccc" />
            </TouchableOpacity>

            <Spacer height={15} />
          </React.Fragment>
        );
      })}

      <Text style={style.subtext3}>Legal & Information</Text>

      {legalInfo.map((meow) => {
        return (
          <React.Fragment key={meow.id}>
            <TouchableOpacity style={style.littleContainer2} onPress={() => handlePress(meow.link)}>
              <View style={style.iconContainer}>
                <FontAwesome5 name={meow.icon} size={24} color="#0a1e3f" />
              </View>

              <View style={style.textContainer}>
                <Text style={style.title}>{meow.title}</Text>
              </View>

              <Ionicons name="chevron-forward" size={24} color="#ccc" />
            </TouchableOpacity>

            <Spacer height={15} />
          </React.Fragment>
        );
      })}
    </ThemedView>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 28,
    lineHeight: 45,
    letterSpacing: -1,
    width: 290,
    top: -240,
    color: "#0a1e3f",
    marginTop: 400,
  },
  subtext: {
    color: "#FFC300",
  },
  subtext1: {
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
    lineHeight: 25,
    letterSpacing: -1,
    width: 290,
    top: -200,
    left: -140,
    color: "#FFC300",
    marginTop: -20
  },
  subtext2: {
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
    lineHeight: 25,
    letterSpacing: -1,
    width: 290,
    top: -185,
    left: -150,
    color: "#FFC300"
  },
  subtext3: {
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
    lineHeight: 25,
    letterSpacing: -1,
    width: 290,
    top: -170,
    left: -100,
    color: "#FFC300"
  },
  littleContainer: {
    flexDirection: "row", // Aligns items horizontally
    alignItems: "center", // Centers vertically
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12, // Rounded corners
    marginHorizontal: 16,
    // simplistic shadow for iOS/Android
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    top: -175,
  },
  littleContainer1: {
    flexDirection: "row", // Aligns items horizontally
    alignItems: "center", // Centers vertically
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12, // Rounded corners
    marginHorizontal: 16,
    // simplistic shadow for iOS/Android
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    top: -185,
  },
  littleContainer2: {
    flexDirection: "row", // Aligns items horizontally
    alignItems: "center", // Centers vertically
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12, // Rounded corners
    marginHorizontal: 16,
    // simplistic shadow for iOS/Android
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    top: -155,
  },
  iconContainer: {
    marginRight: 16, // Space between icon and text
  },
  textContainer: {
    flex: 1, // Takes up remaining space pushing arrow to right
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "#888", // Grey color for subtitle
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default HelpPage;
