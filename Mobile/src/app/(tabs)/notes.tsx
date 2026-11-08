// app/(tabs)/notes
import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PersonAvatar } from "../../components/common/PersonAvatar";
import { ScreenHeader } from "../../components/common/ScreenHeader";
import { colors } from "../../theme/colors";
import usePatientList from "../../hooks/patients/usePatientList";

export default function NursingNotesScreen() {
  const { patients, isLoading, error, fetchPatients } = usePatientList();

  useFocusEffect(
    useCallback(() => {
      fetchPatients();
    }, [fetchPatients])
  );

  return (
    <SafeAreaView
      className="flex-1 bg-gray-50"
      edges={["top", "left", "right"]}
    >
      <ScreenHeader
        title="Nursing Notes"
        rightElement={<PersonAvatar size={36} />}
      />

      <ScrollView
        contentContainerClassName="p-5 gap-4 pb-10"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchPatients} />
        }
      >
        {error && (
          <Text className="text-[13px]" style={{ color: colors.dangerAlt }}>
            {error}
          </Text>
        )}

        {isLoading && patients.length === 0 && (
          <ActivityIndicator size="small" color={colors.primary} />
        )}

        {!isLoading && !error && patients.length === 0 && (
          <Text className="text-sm text-center mt-5" style={{ color: colors.textSecondary }}>
            No patients assigned yet.
          </Text>
        )}

        {patients.length > 0 && (
          <View className="rounded-2xl bg-white px-4 py-2">
            {patients.map((item, index) => (
              <TouchableOpacity
                key={item.patient_id}
                className={`flex-row items-center justify-between py-3.5 ${
                  index < patients.length - 1 ? "border-b border-gray-200" : ""
                }`}
                onPress={() =>
                  router.push({
                    pathname: "/notes/history",
                    params: {
                      patientId: item.patient_id,
                      patientName: item.patient_name,
                    },
                  })
                }
              >
                <View className="flex-row items-center gap-3 flex-1">
                  <PersonAvatar size={28} />
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-gray-900" numberOfLines={1}>
                      {item.patient_name}
                    </Text>
                    {item.ward ? (
                      <Text className="text-xs text-gray-500 mt-0.5">
                        {item.ward}
                      </Text>
                    ) : null}
                  </View>
                </View>
                <Text className="text-xs font-semibold text-gray-400 ml-2">
                  Notes →
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
