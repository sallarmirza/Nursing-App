// app/(tabs)/patients/index
import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
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
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScreenHeader title="Patients Record" />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchPatients} />
        }
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Active Patients</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("/patients/new" as any)}
          >
            <Text style={styles.addButtonText}>+ Add New</Text>
          </TouchableOpacity>
        </View>

        {isLoading && patients.length === 0 && (
          <ActivityIndicator size="small" color={colors.primary} />
        )}

        {error && <Text style={styles.errorText}>{error}</Text>}

        {!isLoading && !error && patients.length === 0 && (
          <Text style={styles.emptyText}>No patients yet.</Text>
        )}

        <View style={styles.listContainer}>
          {patients.map((item) => {
            const age = calculateAge(item.date_of_birth);
            return (
              <TouchableOpacity
                key={item.patient_id}
                style={styles.patientCard}
                activeOpacity={0.7}
                onPress={() =>
                  router.push({
                    pathname: "/patients/[id]" as any,
                    params: { id: item.patient_id },
                  })
                }
              >
                <View style={styles.patientInfo}>
                  <PersonAvatar size={36} />
                  <View>
                    <Text style={styles.patientName}>
                      {item.patient_name}
                    </Text>
                    <Text style={styles.patientSubtext}>
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textHeading,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "600",
  },
  listContainer: {
    gap: 12,
  },
  patientCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  patientInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textHeading,
    marginBottom: 2,
  },
  patientSubtext: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  errorText: {
    color: colors.dangerAlt,
    fontSize: 13,
    marginBottom: 12,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
    marginTop: 20,
  },
});