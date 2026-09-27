LINGOCAT FRONTEND SRC v2

This src folder is designed for the current Expo Router + TypeScript project.
Main changes in this iteration:
- proper Android/iOS safe areas at top and bottom
- bottom tab bar respects Samsung navigation inset
- Android back from the main tabs exits the app instead of walking back into auth screens
- polished Duolingo-style dark UI across Learn, Lesson, Profile, League, Quests, Shop and Settings
- profile editing, password change and account delete use the existing v1.1 backend
- original Lingocat mascot component (no Duo owl asset)
- original local sound effects: tap, correct, wrong and lesson-complete
- sound effects can be switched on/off from Settings
- react-native SafeAreaView deprecation removed

REQUIRED PACKAGES OUTSIDE SRC:
  npx expo install expo-audio react-native-safe-area-context @expo/vector-icons

Because expo-audio is native, run one Android rebuild after installing it:
  adb reverse tcp:3000 tcp:3000
  adb reverse tcp:8081 tcp:8081
  npx expo run:android --device

For normal JS/TS changes afterwards:
  npx expo start --dev-client -c

Keep mobile/.env:
  EXPO_PUBLIC_API_URL=http://127.0.0.1:3000/api/v1
