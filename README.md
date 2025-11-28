# Auralis

Auralis is a React Native app built with Expo that provides voice recording, user authentication (via Supabase), and simple surveys/history functionality. It’s designed for quick prototyping and mobile-first audio workflows.

## Key features

- Expo + React Native (managed workflow)
- Supabase for authentication and backend
- Audio recording, storage, and playback
- Simple survey & recording history screens
- Themed UI components and image/assets included

## Project structure (important files)

- `app/` — Expo Router routes and screens (auth, dashboard, recorder, survey)
- `components/` — Reusable UI components (ThemedButton, ThemedTextInput, recorder UI)
- `constants/AuthProvider.tsx` — Auth context/provider using Supabase
- `lib/supabase.ts` — Supabase client wrapper
- `assets/` — Images and example media
- `package.json` — Dependencies and scripts

## Requirements

- Node.js (recommended: 18+)
- npm or Yarn
- Expo CLI (global install recommended for native runs)
- Android Studio or Xcode to run on device/emulator (optional)

This project uses Expo SDK 54 as listed in `package.json` — keep Expo CLI compatible with that SDK.

Note: The legacy global "expo-cli" package is deprecated. Use the modern `expo` tooling for local development and the EAS (Expo Application Services) toolchain for production builds. See https://docs.expo.dev/tutorial/eas/introduction/ for details.

## Environment variables

Create a `.env` (or set env vars in your CI/Dev client) with at least:

- `SUPABASE_URL` — your Supabase project URL
- `SUPABASE_ANON_KEY` — Supabase anon/public key

The app expects the Supabase client to be initialized from `lib/supabase.ts`. If you use a different secret (service key) for server-only operations, keep it out of the client bundle.

## Install & run (PowerShell)


Install dependencies:

```powershell
npm install
```

Local development (Metro):

```powershell
npx expo start
```

Run on Android or iOS simulator/device (local dev):

```powershell
npx expo run:android
npx expo run:ios
```

Web (basic):

```powershell
npm run web
```

EAS build (production / managed builds)

1. Install or use the EAS CLI (`eas-cli`). You can install globally or use `npx`:

```powershell
npm install -g eas-cli
# or
npx eas login
```

2. Configure `eas.json` (this repo already contains `eas.json`).

3. Trigger a build (example for Android):

```powershell
npx eas build -p android --profile production
```

Or for iOS:

```powershell
npx eas build -p ios --profile production
```

Follow the EAS docs linked above for credentials, signing, and submitting to stores.

## Notes for development

- Auth: `constants/AuthProvider.tsx` exposes `useAuth()` for user/session state. Ensure `SUPABASE_URL` and `SUPABASE_ANON_KEY` are available during runtime.
- Recorder: `app/recorder.tsx` and `components/recorder.tsx` contain the recording logic and UI.
- Assets: pre-bundled images exist in `assets/` for quick testing.

## Troubleshooting

- Expo SDK mismatch: If Expo complains about SDK version, ensure your global Expo CLI supports SDK 54 or upgrade the SDK in `package.json` (careful, breaking changes possible).
- Supabase auth token/refresh errors: If the client reports refresh token errors, sign out and re-authenticate. See `AuthProvider.tsx` for handling logic.
- Native build issues: Reinstall native modules and clear caches: `npx expo start -c` and rebuild the dev client if using custom native modules.

## Recommended next steps / improvements

- Add a `.env.example` file to document required env vars
- Add E2E or unit tests for recorder and auth flows
- Add CI workflow for builds and linting

## License

MIT

---

If you want, I can also:
- add a `.env.example` file
- generate a short developer `CONTRIBUTING.md` or testing harness
- or update `README` with screenshots and detailed API contract for Supabase calls

Tell me which follow-up you prefer.
