import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Root Entry Point */}
      <Stack.Screen name="index" />

      {/* Auth Stack Group */}
      <Stack.Screen name="(auth)" />

      {/* Main App Tabs Group */}
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
