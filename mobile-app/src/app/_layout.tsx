// src/app/_layout
import { LogBox } from "react-native";
import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import "./global.css";

// ImageBackground deprecation warning is emitted by react-native-css-interop
// (NativeWind's engine) which wraps all RN components including the deprecated
// ImageBackground. This is a library-level issue unrelated to our own code.
LogBox.ignoreLogs(["ImageBackground is deprecated"]);

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="notes" />
      </Stack>
    </AuthProvider>
  );
}
