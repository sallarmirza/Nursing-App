// src/app/tw-test.tsx
import { View, Text } from "react-native";

export default function TailwindTest() {
  return (
    <View className="flex-1 items-center justify-center bg-backgroundAlt gap-4 p-6">
      <View className="w-32 h-32 bg-primary rounded-2xl items-center justify-center">
        <Text className="text-white font-bold">OK</Text>
      </View>

      <Text className="text-xl font-bold text-textPrimary">
        Tailwind is working ✅
      </Text>

      <Text className="text-sm text-textSecondary text-center">
        If this box is blue, the text is bold, and this line is gray, NativeWind is set up correctly.
      </Text>

      <View className="bg-dangerAlt px-4 py-2 rounded-full">
        <Text className="text-white text-xs">danger token check</Text>
      </View>
    </View>
  );
}