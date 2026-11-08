// app/patients/[id]
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
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
import useDeletePatient from "../../hooks/patients/useDeletePatient";

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
  const { deletePatient, isLoading: isDeleting, error: deleteError } = useDeletePatient();

  const handleDelete = () => {
    if (!patient) return;
    Alert.alert(
      "Delete Patient",
      `Are you sure you want to delete ${patient.patient_name}? This will permanently remove all their records.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const success = await deletePatient(patient.patient_id);
            if (success) {
              router.back();
            }
          },
        },
      ]
    );
  };

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
            {/* Ward — static, no history screen */}
            <View className="flex-row justify-between py-2">
              <Text className="text-[13px]" style={{ color: colors.textSecondary }}>
                Ward
              </Text>
              <Text className="text-[13px] font-semibold" style={{ color: colors.textHeading }}>
                {patient.patient_ward || "—"}
              </Text>
            </View>
            <View className="h-[1px]" style={{ backgroundColor: colors.borderLight }} />

            {/* Tappable record rows */}
            {(
              [
                {
                  label: "Vitals Recorded",
                  count: patient.vitals.length,
                  pathname: "/vitals/history",
                },
                {
                  label: "Nursing Notes",
                  count: patient.nursing_notes.length,
                  pathname: "/notes/history",
                },
                {
                  label: "SBAR Handovers",
                  count: patient.sbar_handovers.length,
                  pathname: "/sbar/history",
                },
                {
                  label: "Dosage Calculations",
                  count: patient.dosage_calculations.length,
                  pathname: "/calculations/dosage-history",
                },
                {
                  label: "Drip Calculations",
                  count: patient.drip_calculations.length,
                  pathname: "/calculations/drip-history",
                },
              ] as const
            ).map((row, index, arr) => (
              <TouchableOpacity
                key={row.label}
                className={`flex-row items-center justify-between py-2 ${
                  index < arr.length - 1 ? "border-b" : ""
                }`}
                style={index < arr.length - 1 ? { borderBottomColor: colors.borderLight } : undefined}
                onPress={() =>
                  router.push({
                    pathname: row.pathname as any,
                    params: {
                      patientId: patient.patient_id,
                      patientName: patient.patient_name,
                    },
                  })
                }
              >
                <Text className="text-[13px]" style={{ color: colors.textSecondary }}>
                  {row.label}
                </Text>
                <View className="flex-row items-center gap-1">
                  <Text className="text-[13px] font-semibold" style={{ color: colors.textHeading }}>
                    {row.count}
                  </Text>
                  <Ionicons name="chevron-forward" size={14} color={colors.textSecondary} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="mt-4">
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

        {deleteError && (
          <Text className="text-[13px] text-center" style={{ color: colors.danger }}>
            {deleteError}
          </Text>
        )}

        <View className="mt-2 mb-2">
          <PrimaryButton
            label={isDeleting ? "Deleting..." : "Delete Patient"}
            onPress={handleDelete}
            disabled={isDeleting}
            style={{ backgroundColor: colors.danger }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}