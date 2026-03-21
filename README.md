# 🎤 NuSuri Audio Recorder (CoughPod Integration)

This module is a specialized audio recording screen built for React Native (Expo). It is designed to capture high-quality cough audio samples for AI analysis. It features automatic **Bluetooth IoT device detection**, dynamic sample rate switching, and a strict timing workflow to ensure consistent data input for Machine Learning models.

## ✨ Key Features

  * **🎙️ Dual-Mode Recording:**
      * **High Fidelity Mode:** Uses the internal phone microphone at **44.1kHz** (16-bit) for maximum spectral resolution.
      * **IoT Mode:** Automatically detects Bluetooth Low Energy / A2DP devices and switches to **16kHz** to accommodate Bluetooth HFP bandwidth limits without crashing.
  * **⏱️ Strict Timing Workflow:**
      * **3-Second Countdown:** Gives the patient time to prepare.
      * **5-Second Limit:** Automatically cuts recording after exactly 5 seconds to standardize input length for the AI model.
  * **🎧 Integrated Review Player:**
      * Built using the modern `expo-audio` API (SDK 54+ compatible).
      * Allows users to Preview, Retake, or Submit recordings.
  * **📊 Visualization:** Real-time UI feedback using SVG circles to indicate recording status and device connection.

## 🛠 Tech Stack

  * **Framework:** React Native / Expo (Development Client required)
  * **Recording Engine:** `react-native-audio-record` (Direct PCM/WAV access)
  * **Session Management:** `react-native-audio-session` (For Bluetooth route detection)
  * **Playback:** `expo-audio` (Modern replacement for `expo-av`)
  * **Filesystem:** `react-native-fs`
  * **UI/Gradient:** `expo-linear-gradient`, `react-native-svg`

## ⚙️ Installation & Setup

**⚠️ Important:** This project uses native modules (`react-native-audio-record`). It **will not work** in the standard "Expo Go" app. You must build a **Development Client**.

### 1\. Install Dependencies

```bash
npm install react-native-audio-record react-native-fs react-native-audio-session expo-audio expo-linear-gradient react-native-svg react-native-safe-area-context
```

### 2\. Configure Permissions (Android/iOS)

Ensure your `app.json` or `app.config.js` includes the microphone permission:

```json
"android": {
  "permissions": [
    "android.permission.RECORD_AUDIO",
    "android.permission.BLUETOOTH",
    "android.permission.BLUETOOTH_CONNECT" 
  ]
},
"ios": {
  "infoPlist": {
    "NSMicrophoneUsageDescription": "NuSuri needs access to the microphone to analyze cough sounds."
  }
}
```

### 3\. Rebuild Development Client

Because we added native audio libraries, you must rebuild the native android folder:

```bash
# For Android
npx expo run:android

# For iOS
npx expo run:ios
```

## 🧠 Logic & Architecture

### The Bluetooth "Auto-Switch"

The app prevents crashes and audio distortion by detecting the input source before initialization:

1.  **Detection:** On mount, `AudioSession.currentRoute()` scans active outputs.
2.  **Logic:**
      * If `BluetoothA2DP`, `BluetoothHFP`, or `BluetoothLE` is found $\rightarrow$ **Set Sample Rate to 16,000 Hz**.
      * Else (Internal Mic) $\rightarrow$ **Set Sample Rate to 44,100 Hz**.
3.  **Result:** This ensures your IoT device connects successfully, while standard users get the highest possible quality.

### State Management (The 5-Second Timer)

To handle the strict 5-second cutoff without "Stale Closure" bugs (where the timer can't see the updated state), the app uses `useRef`:

```typescript
// Ref tracks the "real" truth of the recording state instantly
const isRecordingRef = useRef<boolean>(false);

// State handles the UI updates (rendering buttons)
const [isRecording, setIsRecording] = useState<boolean>(false);
```

## 🚀 Usage

Navigate to the screen using your router (e.g., Expo Router). The screen handles the lifecycle automatically.

1.  **Press the Gradient Mic Button.**
2.  Wait for the **3... 2... 1...** countdown.
3.  Cough into the device.
4.  Recording stops automatically at **00:05**.
5.  A Review Modal appears.
6.  Clicking **Submit** navigates to `/results` with the file URI.

## 📥 Handling Results

On your results screen, retrieve the audio file path:

```tsx
import { useLocalSearchParams } from 'expo-router';

export default function ResultsScreen() {
  const { uri } = useLocalSearchParams();
  
  // uri = "file:///data/user/0/com.nusuri.app/files/assets/recordings/recording_12345.wav"
  // Ready for Database upload if you have one!
}
```

## 🐛 Troubleshooting

  * **Error: `[TypeError: Cannot read property 'currentRoute' of undefined]`**
      * *Fix:* You haven't rebuilt the app. Run `npx expo run:android`.
  * **Warning: `Expo AV has been deprecated`**
      * *Fix:* We are using `expo-audio`. Ensure you removed `expo-av` imports.
  * **Audio is silent on playback:**
      * *Fix:* Check your volume. On iOS, toggle the ringer switch or force audio to speaker in `AudioSession`.
