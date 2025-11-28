import { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
  PermissionsAndroid,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";
import { Colors } from "../constants/Colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AudioRecord from 'react-native-audio-record';
import RNFS from 'react-native-fs';
import { useNavigation } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import AudioSession from 'react-native-audio-session';

// NEW: Import the modern Audio Player hook
import { useAudioPlayer } from 'expo-audio';

const AudioNoteScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const scheme = (colorScheme ?? "dark") as "light" | "dark";
  const theme = Colors[scheme];

  // Audio recording state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const isRecordingRef = useRef<boolean>(false);
  const [recordedURI, setRecordedURI] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [isIoTConnected, setIsIoTConnected] = useState<boolean>(false);

  // NEW: Initialize Audio Player Hook
  // This hook automatically manages the player instance for the recorded file
  const player = useAudioPlayer(recordedURI ? { uri: recordedURI } : null);

  // Modal States
  const [reviewModalVisible, setReviewModalVisible] = useState<boolean>(false);
  const [aboutModalVisible, setAboutModalVisible] = useState<boolean>(false);
  const toggleAboutModal = () => setAboutModalVisible((v) => !v);
  
  // Timer state and refs
  const [elapsed, setElapsed] = useState<number>(0);
  const [countdown, setCountdown] = useState<number>(0);
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoStopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={toggleAboutModal} style={{ marginRight: 15 }}>
          <Ionicons
            name="information-circle-outline"
            size={24}
            color={colorScheme === "dark" ? "white" : "black"}
          />
        </Pressable>
      ),
    });
  }, [navigation, toggleAboutModal]);

  useEffect(() => {
    const setupAudioEnvironment = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            {
              title: 'Microphone Permission',
              message: 'This app needs access to your microphone.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) return;
        } catch (err) {
          console.error('Permission error:', err);
          return;
        }
      }

      let sampleRate = 44100; 
      
      // currentRoute is not part of the exposed TypeScript type for AudioSession;
      // check for it at runtime and call via `any` to avoid type errors.
      if (AudioSession && typeof (AudioSession as any).currentRoute === "function") {
        try {
          const currentRoute = await (AudioSession as any).currentRoute();
          const isBluetooth = currentRoute?.outputs?.some((out: any) => 
            out.type === 'BluetoothA2DP' || 
            out.type === 'BluetoothHFP' || 
            out.type === 'BluetoothLE'
          );

          setIsIoTConnected(!!isBluetooth);
          if (isBluetooth) sampleRate = 16000;
        } catch (e) {
          console.log("Audio Session check skipped", e);
        }
      }

      const options = {
        sampleRate: sampleRate,
        channels: 1,
        bitsPerSample: 16,
        audioSource: 6,
        wavFile: 'audio_recording.wav'
      };

      AudioRecord.init(options);
    };

    setupAudioEnvironment();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      if (autoStopTimeoutRef.current) clearTimeout(autoStopTimeoutRef.current);
    };
  }, []);

  // --- RECORDING LOGIC ---
  const initiateRecordingSequence = () => {
    if (recordedURI) setRecordedURI(null);
    setCountdown(3);
    
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(countdownIntervalRef.current!);
          startRecording(); 
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
  };

  const startRecording = async (): Promise<void> => {
    try {
      setProcessing(true);
      isRecordingRef.current = true;
      setIsRecording(true);
      
      AudioRecord.start();
      
      setElapsed(0);
      startTimeRef.current = Date.now();
      if (timerRef.current) clearInterval(timerRef.current);
      
      timerRef.current = setInterval(() => {
        if (startTimeRef.current != null) {
          const now = Date.now();
          const diff = now - startTimeRef.current;
          
          if (diff >= 5000) {
             setElapsed(5000);
             if (isRecordingRef.current) stopRecording(); 
          } else {
             setElapsed(diff);
          }
        }
      }, 50);

      if (autoStopTimeoutRef.current) clearTimeout(autoStopTimeoutRef.current);
      autoStopTimeoutRef.current = setTimeout(() => {
        setElapsed(5000); 
        stopRecording();
      }, 5000);

      setProcessing(false);
    } catch (err) {
      console.error("Failed to start recording", err);
      setProcessing(false);
      isRecordingRef.current = false;
      setIsRecording(false);
    }
  };

  const stopRecording = async (): Promise<void> => {
    if (autoStopTimeoutRef.current) {
        clearTimeout(autoStopTimeoutRef.current);
        autoStopTimeoutRef.current = null;
    }

    if (!isRecordingRef.current) return;

    try {
      setProcessing(true);
      
      const audioFile = await AudioRecord.stop();
      
      isRecordingRef.current = false;
      setIsRecording(false);

      if (!audioFile) {
        setProcessing(false);
        return;
      }

      const destDir = `${RNFS.DocumentDirectoryPath}/assets/recordings/`;
      const dirExists = await RNFS.exists(destDir);
      if (!dirExists) {
        await RNFS.mkdir(destDir);
      }

      const fileName = `recording_${Date.now()}.wav`;
      const destPath = `${destDir}${fileName}`;
      
      await RNFS.moveFile(audioFile, destPath);
      setRecordedURI(destPath); 

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      setProcessing(false);
      setElapsed(5000);
      
      // Auto-open review modal
      setTimeout(() => {
          setReviewModalVisible(true);
      }, 300);

    } catch (err) {
      console.error("Error stopping recording:", err);
      isRecordingRef.current = false;
      setIsRecording(false);
      setProcessing(false);
    }
  };

  const handleMainButtonPress = () => {
    if (countdown > 0) return; 

    if (isRecording) {
      stopRecording();
    } else if (recordedURI) {
      setReviewModalVisible(true);
    } else {
      initiateRecordingSequence();
    }
  };

  // --- REVIEW LOGIC ---
  const handleTogglePreview = () => {
      if (player.playing) {
          player.pause();
      } else {
          player.play();
      }
  };

  const handleRetake = () => {
      if (player.playing) player.pause();
      setReviewModalVisible(false);
      initiateRecordingSequence();
  };

  const handleConfirm = () => {
      if (player.playing) player.pause();
      setReviewModalVisible(false);
      navigation.navigate('results', { uri: recordedURI });
  };

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    if (totalSeconds >= 5) return "00:05";
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2,"0")}`;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: theme.recorderBG }]}>
      <LinearGradient colors={[theme.recorderBG, theme.recorderBG, theme.recorderBG]} style={styles.mainContent}>
        
        {/* Visualization */}
        <View style={styles.audioVisualizationContainer}>
          <Svg width={280} height={280} style={styles.svgContainer}>
            <Defs>
              <RadialGradient id="grad1" cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                <Stop offset="100%" stopColor="#f0f0f0" stopOpacity="0.2" />
              </RadialGradient>
            </Defs>
            <Circle cx="140" cy="140" r="130" fill="none" stroke={isIoTConnected ? "#00FF00" : "#FFC300"} strokeWidth="3" strokeDasharray="10 5" opacity="0.6" />
            <Circle cx="140" cy="140" r="90" fill={isIoTConnected ? "#00FF00" : "#FFC300"} stroke="#e8e8ff" strokeWidth="1" />
          </Svg>

          <View style={styles.centerContent}>
            <Text style={[styles.timerText, { color: colorScheme == "dark" ? "#a855f7" : "#FFFF" }, countdown > 0 && { fontSize: 60, fontWeight: "bold" }]}>
              {countdown > 0 ? countdown : isRecording ? formatTime(elapsed) : recordedURI ? "Done" : "Ready"}
            </Text>
            {isIoTConnected && !isRecording && !countdown && !recordedURI && (
                <Text style={{color: theme.text, fontSize: 12, marginTop: 5}}>
                    <MaterialCommunityIcons name="bluetooth" /> IoT Device Connected
                </Text>
            )}
          </View>
        </View>
      </LinearGradient>

      {/* Main Control Button */}
      <View style={styles.bottomControls}>
        <TouchableOpacity style={styles.mainControlButton} onPress={handleMainButtonPress} disabled={processing}>
          <LinearGradient colors={isRecording ? ["#ef4444", "#dc2626"] : ["#a855f7", "#ec4899", "#f59e0b"]} style={styles.pauseButton}>
            <View style={styles.pauseIconContainer}>
              {countdown > 0 ? (
                 <MaterialCommunityIcons name="timer-sand" size={40} color="#fff" />
              ) : isRecording ? (
                 <View style={styles.stopIconSquare} />
              ) : recordedURI ? (
                 <MaterialCommunityIcons name="check" size={40} color="#fff" />
              ) : (
                 <MaterialCommunityIcons name="microphone" size={40} color="#fff" />
              )}
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* REVIEW MODAL */}
      <Modal visible={reviewModalVisible} transparent animationType="fade" onRequestClose={() => setReviewModalVisible(false)}>
         <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colorScheme === 'dark' ? '#1f2937' : 'white' }]}>
                <Text style={[styles.modalTitle, { color: theme.title }]}>Review Recording</Text>
                
                {/* Play/Stop Button using Expo Audio Player */}
                <TouchableOpacity 
                    onPress={handleTogglePreview}
                    style={styles.previewButton}
                >
                    <Ionicons 
                        name={player.playing ? "stop-circle" : "play-circle"} 
                        size={64} 
                        color="#a855f7" 
                    />
                    <Text style={{ color: theme.text, marginTop: 5 }}>
                        {player.playing ? "Stop Preview" : "Play Recording"}
                    </Text>
                </TouchableOpacity>

                <View style={styles.modalButtonsRow}>
                    <TouchableOpacity onPress={handleRetake} style={[styles.modalButton, { backgroundColor: '#ef4444', marginRight: 10 }]}>
                        <Text style={styles.modalButtonText}>Retake</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={handleConfirm} style={[styles.modalButton, { backgroundColor: '#22c55e' }]}>
                        <Text style={styles.modalButtonText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </View>
         </View>
      </Modal>

      {/* About Modal */}
      <Modal visible={aboutModalVisible} animationType="slide" onRequestClose={toggleAboutModal}>
        <View style={{ flex: 1, paddingTop: insets.top + 20, backgroundColor: colorScheme == "dark" ? "#0A1E3F" : "#FFFFFF" }}>
          <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 12 }}>
            <View style={{ alignItems: "center", marginBottom: 12 }}>
              <MaterialCommunityIcons name="information-outline" size={64} color={theme.title} />
            </View>
            <Text style={{ fontSize: 22, fontWeight: "700", color: "#FFC300", marginBottom: 12, textAlign: "center" }}>
              About Audio Notes
            </Text>
            <Text style={{ fontSize: 16, color: "#FFC300", lineHeight: 24 }}>
              Record your cough for analysis.
              {"\n\n"}1. Press Mic.
              {"\n"}2. Wait for countdown.
              {"\n"}3. Record (Max 5s).
              {"\n"}4. Listen to preview.
              {"\n"}5. Submit if satisfied.
            </Text>
          </ScrollView>
          <View style={{ padding: 20 }}>
            <Pressable onPress={toggleAboutModal} style={{ alignSelf: "center", paddingVertical: 12, paddingHorizontal: 30, backgroundColor: theme.button2, borderRadius: 10, width: 250 }}>
              <Text style={{ color: colorScheme == "dark" ? "#012f59" : "#FFFF", fontWeight: "600", fontSize: 18, textAlign: "center" }}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  mainContent: { flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 50 },
  audioVisualizationContainer: { position: "relative", justifyContent: "center", alignItems: "center" },
  svgContainer: { position: "absolute" },
  centerContent: { justifyContent: "center", alignItems: "center", zIndex: 1, height: 100 },
  timerText: { fontSize: 32, fontWeight: "300", letterSpacing: 2, textAlign: "center" },
  bottomControls: { flexDirection: "row", justifyContent: "center", alignItems: "center", paddingHorizontal: 40, paddingVertical: 60 },
  mainControlButton: { elevation: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4.65 },
  pauseButton: { width: 100, height: 100, borderRadius: 50, justifyContent: "center", alignItems: "center" },
  pauseIconContainer: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
  stopIconSquare: { width: 30, height: 30, backgroundColor: "#fff", borderRadius: 4 },
  
  // Review Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', padding: 25, borderRadius: 20, alignItems: 'center', elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  previewButton: { alignItems: 'center', marginBottom: 25 },
  modalButtonsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  modalButton: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  modalButtonText: { color: 'white', fontWeight: '600', fontSize: 16 }
});

export default AudioNoteScreen;