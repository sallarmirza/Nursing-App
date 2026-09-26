// app/patients/[id]
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PersonAvatar } from "../../components/common/PersonAvatar";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { ScreenHeader } from "../../components/common/ScreenHeader";
import { colors } from "../../theme/colors";
import usePatientDetail from "../../hooks/patients/usePatientDetail";

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

export default function PatientProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { patient, isLoading, error, fetchPatient } = usePatientDetail(id);

  useFocusEffect(
    useCallback(() => {
      fetchPatient();
    }, [fetchPatient])
  );

  if (isLoading && !patient) {
    return (
      <SafeAreaView 
        className="flex-1" 
        style={{ backgroundColor: colors.backgroundAlt }} 
        edges={["top", "left", "right"]}
      >
        <ScreenHeader title="Patient Profile" showBack={true} />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !patient) {
    return (
      <SafeAreaView 
        className="flex-1" 
        style={{ backgroundColor: colors.backgroundAlt }} 
        edges={["top", "left", "right"]}
      >
        <ScreenHeader title="Patient Profile" showBack={true} />
        <View className="flex-1 justify-center items-center p-5">
          <Text className="text-sm text-center" style={{ color: colors.danger }}>
            {error || "Patient not found"}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const age = calculateAge(patient.date_of_birth);

  return (
    <SafeAreaView 
      className="flex-1" 
      style={{ backgroundColor: colors.backgroundAlt }} 
      edges={["top", "left", "right"]}
    >
      <ScreenHeader
        title="Patient Profile"
        showBack={true}
        rightElement={
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="create-outline" size={22} color={colors.primary} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerClassName="p-5 gap-4 pb-10"
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-white rounded-xl p-5 items-center gap-1.5">
          <PersonAvatar size={64} />
          <Text className="text-lg font-bold" style={{ color: colors.textHeading }}>
            {patient.patient_name}
          </Text>
          <Text className="text-[13px]" style={{ color: colors.textSecondary }}>
            {age !== null ? `${age} years, ` : ""}
            {patient.patient_gender} | ID: {patient.patient_id}
          </Text>
        </View>

        <View className="flex-row gap-2.5">
          <View className="flex-1 bg-white p-3 rounded-lg items-center">
            <Text className="text-[11px]" style={{ color: colors.textSecondary }}>
              Weight
            </Text>
            <Text className="text-[15px] font-bold mt-0.5" style={{ color: colors.textHeading }}>
              {patient.patient_weight ? `${patient.patient_weight} kg` : "—"}
            </Text>
          </View>
          <View className="flex-1 bg-white p-3 rounded-lg items-center">
            <Text className="text-[11px]" style={{ color: colors.textSecondary }}>
              Height
            </Text>
            <Text className="text-[15px] font-bold mt-0.5" style={{ color: colors.textHeading }}>
              {patient.patient_height ? `${patient.patient_height} cm` : "—"}
            </Text>
          </View>
          <View className="flex-1 bg-white p-3 rounded-lg items-center">
            <Text className="text-[11px]" style={{ color: colors.textSecondary }}>
              Blood Type
            </Text>
            <Text className="text-[15px] font-bold mt-0.5" style={{ color: colors.textHeading }}>
              {patient.patient_blood_group || "—"}
            </Text>
          </View>
        </View>

        <View className="gap-2">
          <Text className="text-[14px] font-bold" style={{ color: colors.textHeading }}>
            Records
          </Text>
          <View className="bg-white rounded-xl p-3.5">
            <View className="flex-row justify-between py-2">
              <Text className="text-[13px]" style={{ color: colors.textSecondary }}>
                Ward
              </Text>
              <Text className="text-[13px] font-semibold" style={{ color: colors.textHeading }}>
                {patient.patient_ward || "—"}
              </Text>
            </View>
            <View className="h-[1px]" style={{ backgroundColor: colors.borderLight }} />

            <View className="flex-row justify-between py-2">
              <Text className="text-[13px]" style={{ color: colors.textSecondary }}>
                Vitals Recorded
              </Text>
              <Text className="text-[13px] font-semibold" style={{ color: colors.textHeading }}>
                {patient.vitals.length}
              </Text>
            </View>
            <View className="h-[1px]" style={{ backgroundColor: colors.borderLight }} />

            <View className="flex-row justify-between py-2">
              <Text className="text-[13px]" style={{ color: colors.textSecondary }}>
                Nursing Notes
              </Text>
              <Text className="text-[13px] font-semibold" style={{ color: colors.textHeading }}>
                {patient.nursing_notes.length}
              </Text>
            </View>
            <View className="h-[1px]" style={{ backgroundColor: colors.borderLight }} />

            <View className="flex-row justify-between py-2">
              <Text className="text-[13px]" style={{ color: colors.textSecondary }}>
                Medications
              </Text>
              <Text className="text-[13px] font-semibold" style={{ color: colors.textHeading }}>
                {patient.medications.length}
              </Text>
            </View>
            <View className="h-[1px]" style={{ backgroundColor: colors.borderLight }} />

            <View className="flex-row justify-between py-2">
              <Text className="text-[13px]" style={{ color: colors.textSecondary }}>
                SBAR Handovers
              </Text>
              <Text className="text-[13px] font-semibold" style={{ color: colors.textHeading }}>
                {patient.sbar_handovers.length}
              </Text>
            </View>
            <View className="h-[1px]" style={{ backgroundColor: colors.borderLight }} />

            <View className="flex-row justify-between py-2">
              <Text className="text-[13px]" style={{ color: colors.textSecondary }}>
                Dosage Calculations
              </Text>
              <Text className="text-[13px] font-semibold" style={{ color: colors.textHeading }}>
                {patient.dosage_calculations.length}
              </Text>
            </View>
            <View className="h-[1px]" style={{ backgroundColor: colors.borderLight }} />

            <View className="flex-row justify-between py-2">
              <Text className="text-[13px]" style={{ color: colors.textSecondary }}>
                Drip Calculations
              </Text>
              <Text className="text-[13px] font-semibold" style={{ color: colors.textHeading }}>
                {patient.drip_calculations.length}
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-2">
          <PrimaryButton
            label="Create Nursing Assessment"
            onPress={() =>
              router.push({
                pathname: "/notes/assessment",
                params: {
                  patientId: patient.patient_id,
                  patientName: patient.patient_name,
                },
              })
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}