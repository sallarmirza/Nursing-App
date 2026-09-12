// app/(tabs)/patients/index
import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PersonAvatar } from "../../components/common/PersonAvatar";
import { ScreenHeader } from "../../components/common/ScreenHeader";
import { StatusBadge } from "../../components/common/StatusBadge";
import { colors } from "../../theme/colors";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  status: "Stable" | "Critical" | "Discharged";
}

const PATIENTS_DATA: Patient[] = [
  { id: "1", name: "Maria Khan", age: 35, gender: "Female", status: "Stable" },
  { id: "2", name: "Ahmed Raza", age: 35, gender: "Male", status: "Critical" },
  { id: "3", name: "Ali Khan", age: 31, gender: "Male", status: "Discharged" },
];

const STATUS_TONE: Record<Patient["status"], "success" | "danger" | "neutral"> =
  {
    Stable: "success",
    Critical: "danger",
    Discharged: "neutral",
  };

export default function PatientsRecordScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScreenHeader title="Patients Record" />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
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

        <View style={styles.listContainer}>
          {PATIENTS_DATA.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.patientCard}
              activeOpacity={0.7}
              onPress={() =>
                router.push({
                  pathname: "/patients/[id]" as any,
                  params: { id: item.id },
                })
              }
            >
              <View style={styles.patientInfo}>
                <PersonAvatar size={36} />
                <View>
                  <Text style={styles.patientName}>{item.name}</Text>
                  <Text style={styles.patientSubtext}>
                    {item.age} years, {item.gender}
                  </Text>
                </View>
              </View>

              <StatusBadge
                label={item.status}
                tone={STATUS_TONE[item.status]}
              />
            </TouchableOpacity>
          ))}
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
});
