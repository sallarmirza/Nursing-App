// app/(tabs)/profile
import { router } from "expo-router";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PersonAvatar } from "../../components/common/PersonAvatar";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { ScreenHeader } from "../../components/common/ScreenHeader";
import { colors } from "../../theme/colors";
import useProfile from "../../hooks/nurse/useProfile";

function formatExperience(years: number | null): string {
  if (years === null) return "—";
  return years === 1 ? "1 Year" : `${years} Years`;
}

export default function ProfileScreen() {
  const { data, isLoading, isOffline, error, refetch } = useProfile();

  const details = data
    ? [
        { label: "Qualification", value: data.nurse_qualification ?? "—" },
        { label: "Designation", value: data.nurse_designation ?? "—" },
        { label: "Hospital", value: data.nurse_hospital ?? "—" },
        { label: "Experience", value: formatExperience(data.nurse_experience) },
      ]
    : [];

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top", "left", "right"]}>
      <ScreenHeader title="Profile" />

      <ScrollView
        contentContainerClassName="p-5 gap-5 pb-10"
        showsVerticalScrollIndicator={false}
      >
        {isLoading && (
          <View className="items-center mt-10">
            <ActivityIndicator size="small" color={colors.textMuted} />
          </View>
        )}

        {error && !data && (
          <View className="items-center gap-2 mt-10">
            <Text className="text-sm" style={{ color: colors.dangerAlt }}>
              {error}
            </Text>
            <PrimaryButton label="Retry" variant="outline" onPress={refetch} />
          </View>
        )}

        {data && (
          <>
            {isOffline && (
              <Text className="text-xs text-center" style={{ color: colors.textMuted }}>
                Showing saved data — offline
              </Text>
            )}

            <View className="items-center gap-1 mt-2">
              <PersonAvatar size={72} />
              <Text className="text-xl font-bold text-gray-900 mt-2">
                {data.nurse_name ?? "—"}
              </Text>
              <Text className="text-sm text-gray-500">
                {data.nurse_designation ?? "—"}
              </Text>
            </View>

            <View className="bg-white rounded-xl px-4">
              {details.map((item, index) => (
                <View
                  key={item.label}
                  className={`py-3.5 ${
                    index < details.length - 1 ? "border-b border-gray-200" : ""
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
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}