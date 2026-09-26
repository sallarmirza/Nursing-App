// app/(tabs)/patients/index
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

function calculateAge(dateOfBirth: string | null): number | null {
  if (!dateOfBirth) return null;
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

export default function PatientsRecordScreen() {
  const { patients, isLoading, error, fetchPatients } = usePatientList();

  // Refetch every time this screen comes into focus (e.g. after adding a patient)
  useFocusEffect(
    useCallback(() => {
      fetchPatients();
    }, [fetchPatients])
  );

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.backgroundAlt }}
      edges={["top", "left", "right"]}
    >
      <ScreenHeader title="Patients Record" />

      <ScrollView
        contentContainerClassName="px-5 pt-5 pb-10"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchPatients} />
        }
      >
        <View className="flex-row items-center justify-between mb-4">
          <Text
            className="text-[15px] font-bold"
            style={{ color: colors.textHeading }}
          >
            My Active Patients
          </Text>
          <TouchableOpacity
            className="py-[6px] px-3 rounded-md"
            style={{ backgroundColor: colors.primary }}
            onPress={() => router.push("/patients/new" as any)}
          >
            <Text className="text-white text-[13px] font-semibold">
              + Add New
            </Text>
          </TouchableOpacity>
        </View>

        {isLoading && patients.length === 0 && (
          <ActivityIndicator size="small" color={colors.primary} />
        )}

        {error && (
          <Text
            className="text-[13px] mb-3"
            style={{ color: colors.dangerAlt }}
          >
            {error}
          </Text>
        )}

        {!isLoading && !error && patients.length === 0 && (
          <Text
            className="text-sm text-center mt-5"
            style={{ color: colors.textSecondary }}
          >
            No patients yet.
          </Text>
        )}

        <View className="gap-3">
          {patients.map((item) => {
            const age = calculateAge(item.date_of_birth);
            return (
              <TouchableOpacity
                key={item.patient_id}
                className="bg-white rounded-xl px-4 py-[14px] flex-row items-center justify-between"
                activeOpacity={0.7}
                onPress={() =>
                  router.push({
                    pathname: "/patients/[id]" as any,
                    params: { id: item.patient_id },
                  })
                }
              >
                <View className="flex-row items-center gap-3">
                  <PersonAvatar size={36} />
                  <View>
                    <Text
                      className="text-base font-bold mb-[2px]"
                      style={{ color: colors.textHeading }}
                    >
                      {item.patient_name}
                    </Text>
                    <Text
                      className="text-[13px]"
                      style={{ color: colors.textSecondary }}
                    >
                      {age !== null
                        ? `${age} years, ${item.patient_gender}`
                        : item.patient_gender}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}