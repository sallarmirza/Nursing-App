// app/notes/_layout
import { Stack } from "expo-router";

export default function NotesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="assessment" />
      <Stack.Screen name="history" />
      <Stack.Screen name="sbar" />
      <Stack.Screen name="soap" />
    </Stack>
  );
}
