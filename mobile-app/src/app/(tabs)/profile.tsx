// app/(tabs)/profile
import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PersonAvatar } from "../../components/common/PersonAvatar";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { ScreenHeader } from "../../components/common/ScreenHeader";
import { colors } from "../../theme/colors";

const NURSE = {
  name: "Sarah Ahmed",
  qualification: "BSN, RN",
  designation: "Staff Nurse",
  hospital: "Ibadat International Hospital",
  experience: "5 Years",
  shift: "Morning Shift",
};

const DETAILS: { label: string; value: string }[] = [
  { label: "Qualification", value: NURSE.qualification },
  { label: "Designation", value: NURSE.designation },
  { label: "Hospital", value: NURSE.hospital },
  { label: "Experience", value: NURSE.experience },
  { label: "Current Shift", value: NURSE.shift },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top", "left", "right"]}>
      <ScreenHeader title="Profile" />

      <ScrollView
        contentContainerClassName="p-5 gap-5 pb-10"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center gap-1 mt-2">
          <PersonAvatar size={72} />
          <Text className="text-xl font-bold text-gray-900 mt-2">
            {NURSE.name}
          </Text>
          <Text className="text-sm text-gray-500">{NURSE.designation}</Text>
        </View>

        <View className="bg-white rounded-xl px-4">
          {DETAILS.map((item, index) => (
            <View
              key={item.label}
              className={`py-3.5 ${
                index < DETAILS.length - 1 ? "border-b border-gray-200" : ""
              }`}
            >
              <Text className="text-xs text-gray-500 mb-0.5">
                {item.label}
              </Text>
              <Text className="text-[15px] font-semibold text-gray-900">
                {item.value}
              </Text>
            </View>
          ))}
        </View>

        <PrimaryButton
          label="Edit Profile"
          variant="outline"
          onPress={() => router.push("/(auth)/staff-profile")}
          style={{ marginTop: 4 }}
        />

        <PrimaryButton
          label="Log Out"
          onPress={() => router.replace("/(auth)/login")}
          style={{ backgroundColor: colors.dangerAlt }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}