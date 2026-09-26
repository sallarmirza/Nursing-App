// src/app/_layout
import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
// import "../global.css";
import "./global.css";
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
