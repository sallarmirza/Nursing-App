// app/patients/[id]
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
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
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScreenHeader title="Patient Profile" showBack={true} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !patient) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScreenHeader title="Patient Profile" showBack={true} />
        <View style={styles.centered}>
          <Text style={styles.errorText}>
            {error || "Patient not found"}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const age = calculateAge(patient.date_of_birth);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
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
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <PersonAvatar size={64} />
          <Text style={styles.patientName}>{patient.patient_name}</Text>
          <Text style={styles.patientMeta}>
            {age !== null ? `${age} years, ` : ""}
            {patient.patient_gender} | ID: {patient.patient_id}
          </Text>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoTile}>
            <Text style={styles.infoTileLabel}>Weight</Text>
            <Text style={styles.infoTileValue}>
              {patient.patient_weight ? `${patient.patient_weight} kg` : "—"}
            </Text>
          </View>
          <View style={styles.infoTile}>
            <Text style={styles.infoTileLabel}>Height</Text>
            <Text style={styles.infoTileValue}>
              {patient.patient_height ? `${patient.patient_height} cm` : "—"}
            </Text>
          </View>
          <View style={styles.infoTile}>
            <Text style={styles.infoTileLabel}>Blood Type</Text>
            <Text style={styles.infoTileValue}>
              {patient.patient_blood_group || "—"}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Records</Text>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Ward</Text>
              <Text style={styles.detailValue}>
                {patient.patient_ward || "—"}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Vitals Recorded</Text>
              <Text style={styles.detailValue}>{patient.vitals.length}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Nursing Notes</Text>
              <Text style={styles.detailValue}>
                {patient.nursing_notes.length}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Medications</Text>
              <Text style={styles.detailValue}>
                {patient.medications.length}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>SBAR Handovers</Text>
              <Text style={styles.detailValue}>
                {patient.sbar_handovers.length}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Dosage Calculations</Text>
              <Text style={styles.detailValue}>
                {patient.dosage_calculations.length}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Drip Calculations</Text>
              <Text style={styles.detailValue}>
                {patient.drip_calculations.length}
              </Text>
            </View>
          </View>
        </View>

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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.backgroundAlt },
  container: { padding: 20, gap: 16, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  profileCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    gap: 6,
  },
  patientName: { fontSize: 18, fontWeight: "700", color: colors.textHeading },
  patientMeta: { fontSize: 13, color: colors.textSecondary },
  infoGrid: { flexDirection: "row", gap: 10 },
  infoTile: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  infoTileLabel: { fontSize: 11, color: colors.textSecondary },
  infoTileValue: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textHeading,
    marginTop: 2,
  },
  section: { gap: 8 },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: colors.textHeading },
  detailsCard: { backgroundColor: colors.white, borderRadius: 12, padding: 14 },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  detailLabel: { fontSize: 13, color: colors.textSecondary },
  detailValue: { fontSize: 13, fontWeight: "600", color: colors.textHeading },
  divider: { height: 1, backgroundColor: colors.borderLight },
  errorText: {
    color: colors.dangerAlt,
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});