import { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";
import { Colors } from "../constants/Colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system/legacy";
import { Redirect, useNavigation } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "../constants/AuthProvider";

const AudioNoteScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const scheme = (colorScheme ?? "dark") as "light" | "dark";
  const theme = Colors[scheme];

  // Audio recording state
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedURI, setRecordedURI] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  // Timer state and refs
  const [elapsed, setElapsed] = useState<number>(0); // milliseconds
  const {session} = useAuth()
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  // local modal state
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const toggleModal = () => setModalVisible((v) => !v);
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  if(!session) {
    return <Redirect href={"/"}/>

  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={toggleModal} style={{ marginRight: 15 }}>
          <Ionicons
            name="information-circle-outline"
            size={24}
            color={colorScheme === "dark" ? "white" : "black"}
          />
        </Pressable>
      ),
    });
  }, [navigation, toggleModal]);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== "granted") {
          console.warn("Microphone permission not granted");
        }
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
      } catch (e) {
        console.error("Error setting up audio permissions", e);
      }
    })();
  }, []);

  // Recording options trying to target linear PCM / wav where possible
  const recordingOptions: Audio.RecordingOptions =
    // Use Expo's preset for best compatibility across platforms
    Audio.RecordingOptionsPresets.HIGH_QUALITY;

  const startRecording = async (): Promise<void> => {
    try {
      setProcessing(true);
      const { recording: createdRecording } = await Audio.Recording.createAsync(recordingOptions);
      setRecording(createdRecording);
      setIsRecording(true);
      // start timer
      setElapsed(0);
      startTimeRef.current = Date.now();
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        if (startTimeRef.current != null) {
          setElapsed(Date.now() - startTimeRef.current);
        }
      }, 500);
      setProcessing(false);
    } catch (err) {
      console.error("Failed to start recording", err);
      setProcessing(false);
    }
  };

  const resetRecording = async (): Promise<void> => {
  try {
    // Stop recording if active
    if (isRecording && recording) {
      await recording.stopAndUnloadAsync();
      setIsRecording(false);
    }

    // Delete existing file if it exists
    if (recordedURI) {
      const fileInfo = await FileSystem.getInfoAsync(recordedURI);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(recordedURI, { idempotent: true });
        console.log("Deleted file:", recordedURI);
      }
    }

    // Clear all states
    setRecording(null);
    setRecordedURI(null);
    setElapsed(0);
    setProcessing(false);
    startTimeRef.current = null;

    // Stop timer if running
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    console.log("Recording reset complete");
  } catch (err) {
    console.error("Error resetting recording:", err);
  }
};


  const stopRecording = async (): Promise<void> => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
    } catch (e) {
      console.warn("stopAndUnloadAsync threw", e);
    }
    const uri = recording.getURI();
    if (!uri) {
      console.warn("No URI returned from recording");
      setRecording(null);
      setIsRecording(false);
      setProcessing(false);
      return;
    }

    const destDir = FileSystem.documentDirectory + "assets/recordings/";
    await FileSystem.makeDirectoryAsync(destDir, { intermediates: true });

    const sourceExtMatch = uri.match(/\.[a-zA-Z0-9]+$/);
    const sourceExt = sourceExtMatch ? sourceExtMatch[0] : ".m4a";
    const fileName = `recording_${Date.now()}${sourceExt}`;
    const destPath = destDir + fileName;

    // Copy into persistent folder
    await FileSystem.copyAsync({ from: uri, to: destPath });

    console.log("Saved wav file:", destPath);
    setRecordedURI(destPath);

    // stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // keep elapsed as final duration
    setRecording(null);
    setIsRecording(false);
    setProcessing(false);
  };

  // helper to format milliseconds into MM:SS or H:MM:SS
  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, "0")}:${String(
        seconds
      ).padStart(2, "0")}`;
    }
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          backgroundColor: theme.recorderBG,
        },
      ]}
    >
      {/* Main Content */}

      <LinearGradient
        colors={[theme.recorderBG, theme.recorderBG, theme.recorderBG]}
        style={styles.mainContent}
      >
        {/* Audio Visualization Circle */}
        <View style={styles.audioVisualizationContainer}>
          <Svg width={280} height={280} style={styles.svgContainer}>
            <Defs>
              <RadialGradient id="grad1" cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                <Stop offset="100%" stopColor="#f0f0f0" stopOpacity="0.2" />
              </RadialGradient>
            </Defs>

            {/* Outer gradient circle */}
            <Circle
              cx="140"
              cy="140"
              r="130"
              fill="none"
              stroke={theme.outerCircle}
              strokeWidth="3"
              strokeDasharray="10 5"
              opacity="0.6"
            />

            {/* Inner white circle */}
            <Circle
              cx="140"
              cy="140"
              r="90"
              fill={theme.innerCircle}
              stroke="#e8e8ff"
              strokeWidth="1"
            />
          </Svg>

          {/* Microphone Icon and Timer */}
          <View style={styles.centerContent}>
            <View style={styles.microphoneContainer}>
              <LinearGradient
                colors={["#a855f7", "#ec4899"]}
                style={styles.microphoneIcon}
              >
                <MaterialCommunityIcons
                  name="microphone-outline"
                  size={24}
                  color={colorScheme == "dark" ? "#FFF" : "#000"}
                />
              </LinearGradient>
            </View>
          <Text style={[styles.timerText,{ color: colorScheme == "dark" ? "#a855f7" : "#FFFF" }]}>
              {isRecording
                ? formatTime(elapsed)
                : recordedURI
                ? "Saved"
                : formatTime(elapsed)}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        {/* Stop Button (forced stop) */}
        <TouchableOpacity
          style={styles.controlButton}
          onPress={stopRecording}
          disabled={!isRecording}
        >
          <View style={[styles.stopButton, { opacity: isRecording ? 1 : 0.5 }]}>
            <View style={styles.stopIcon} />
          </View>
        </TouchableOpacity>

        {/* Start/Stop Button */}
        <TouchableOpacity
          style={styles.mainControlButton}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <LinearGradient
            colors={["#a855f7", "#ec4899", "#f59e0b"]}
            style={styles.pauseButton}
          >
            <View style={styles.pauseIconContainer}>
              {!isRecording ? (
                <MaterialCommunityIcons name="play" size={28} color="#fff" />
              ) : (
                <View style={{ flexDirection: "row" }}>
                  <View style={[styles.pauseBar, { height: 18 }]} />
                  <View style={[styles.pauseBar, { height: 18 }]} />
                </View>
              )}
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Convert/Reset Button */}
        <TouchableOpacity
          style={styles.controlButton}
          onPress={resetRecording}
          disabled={!recordedURI || processing}
        >
          <View
            style={[styles.resetButton, { opacity: recordedURI ? 1 : 0.5 }]}
          >
            <Text style={styles.resetIcon}>{processing ? "…" : "↻"}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Simple RN Modal for About */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={toggleModal}
      >
        <View
          style={{
            flex: 1,
            paddingTop: insets.top + 20,
            backgroundColor: colorScheme =="dark"? "#0A1E3F" : "#FFFFFF" 
          }}
        >
          
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 12}}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ alignItems: "center", marginBottom: 12 }}>
            <MaterialCommunityIcons
              name="information-outline"
              size={64}
              color={theme.title}
            />
          </View>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "700",
                color: theme.text,
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              About Audio Notes
            </Text>

            <Text style={{ fontSize: 16, color: theme.text, lineHeight: 24 }}>
              Audio Notes allows you to record high-quality audio directly on
              your device.
              {"\n\n"}- Press the play button to start recording.
              {"\n"}- Press the stop button to end the recording.
              {"\n"}- You can convert recordings to WAV format for better
              compatibility.
              {"\n\n"}All recordings are saved locally on your device.
              {"\n\n"}
              <Text style={{ fontWeight: "700" }}>Before You Start</Text>
              {"\n"}- Find a quiet environment with minimal background noise.
              {"\n"}- Remove any mask or cloth that might block the sound.
              {"\n"}- Make sure your microphone is clean and unobstructed.
              {"\n"}- Sit or stand comfortably and stay relaxed.
              {"\n"}- Hold your phone 15–20 cm (6–8 inches) from your mouth.
              {"\n"}- Take a deep breath and cough naturally, as you normally
              would.
              {"\n"}- If asked for multiple coughs, pause briefly between each
              one.
              {"\n"}- Don’t force a cough — natural is best for accurate
              analysis.
              {"\n\n"}
              <Text style={{ fontWeight: "700" }}>During Recording</Text>
              {"\n"}- Avoid background noise (TV, talking, wind, traffic).
              {"\n"}- Don’t cover your microphone with your hand.
              {"\n"}- Avoid whispering, throat clearing, or fake coughs.
              {"\n\n"}
              <Text style={{ fontWeight: "700" }}>Tips for Best Accuracy</Text>
              {"\n"}- Record when you're experiencing real symptoms (dry or wet
              cough).
              {"\n"}- If unsure, repeat the recording in a quieter place.
              {"\n"}- Avoid recording while eating, drinking, or immediately
              after exercise.
            </Text>
          </ScrollView>
          <View style={{ padding: 20 }}>
            <Pressable
              onPress={toggleModal}
              style={{
                alignSelf: "center",
                paddingVertical: 12,
                paddingHorizontal: 30,
                backgroundColor: theme.button2,
                borderRadius: 10,
                width: 250
              }}
            >
              <Text style={{ color: colorScheme == "dark"? "#000" : "#FFFF", fontWeight: "600", fontSize: 18,textAlign: "center" }}>
                Close
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    fontSize: 28,
    color: "#333",
    fontWeight: "300",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  menuIcon: {
    fontSize: 20,
    color: "#333",
    fontWeight: "bold",
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  audioVisualizationContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  svgContainer: {
    position: "absolute",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  microphoneContainer: {
    marginBottom: 20,
  },
  microphoneIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  micIcon: {
    fontSize: 24,
  },
  timerText: {
    fontSize: 32,
    fontWeight: "300",
    letterSpacing: 2,
  },
  bottomControls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 40,
  },
  controlButton: {
    marginHorizontal: 30,
  },
  stopButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  stopIcon: {
    width: 14,
    height: 14,
    backgroundColor: "#666",
    borderRadius: 2,
  },
  mainControlButton: {
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  pauseButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  pauseIconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  pauseBar: {
    width: 4,
    height: 18,
    backgroundColor: "#fff",
    borderRadius: 2,
    marginHorizontal: 2,
  },
  resetButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  resetIcon: {
    fontSize: 20,
    color: "#666",
    fontWeight: "bold",
  },
});

export default AudioNoteScreen;
