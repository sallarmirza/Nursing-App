// app/(tabs)/dashboard
// app/(tabs)/dashboard
import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PersonAvatar } from "../../components/common/PersonAvatar";
import { ToolCard } from "../../components/common/ToolCard";
import { colors } from "../../theme/colors";

const TOOLS = [
  {
    id: "1",
    title: "Dosage Calculator",
    subtitle: "Safe Med calculation & alerts",
    href: "/calculations/dosage",
  },
  {
    id: "2",
    title: "IV Drip Rate",
    subtitle: "Drops/min calculator",
    href: "/calculations/drip",
  },
  {
    id: "3",
    title: "Patient Records",
    subtitle: "View & Edit patient history",
    href: "/(tabs)/patients",
  },
  {
    id: "4",
    title: "Nursing Notes",
    subtitle: "Daily Digital Observations",
    href: "/(tabs)/notes",
  },
] as const;

const PATIENTS = [
  { id: "1", name: "Mr. Ahmed Ali Khan", status: "Vitals Updated" },
  { id: "2", name: "Mrs. Fatima Sana", status: "Pending Medication" },
  { id: "3", name: "Mrs. Nida Farooq", status: "Vitals Overdue", alert: true },
  {
    id: "4",
    name: "Mr. Altaf Ahmed",
    status: "Medication Overdue",
    alert: true,
  },
  { id: "5", name: "Mr. Daniyal Ali", status: "IV Bag Low", warning: true },
];

function getStatusColor(patient: (typeof PATIENTS)[number]) {
  if (patient.alert) return colors.dangerAlt;
  if (patient.warning) return colors.warning;
  return colors.textMuted;
}

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingBottom: insets.bottom + 80 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome Sarah!</Text>
            <Text style={styles.shiftText}>Morning Shift, July 15, 2026</Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
            <PersonAvatar size={40} />
          </TouchableOpacity>
        </View>

        <View style={styles.toolsList}>
          {TOOLS.map((tool) => (
            <ToolCard
              key={tool.id}
              title={tool.title}
              subtitle={tool.subtitle}
              onPress={() => router.push(tool.href as any)}
            />
          ))}
        </View>

        <View style={styles.patientsHeader}>
          <Text style={styles.sectionTitle}>Recent Patients</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/patients")}>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.patientsCard}>
          {PATIENTS.map((patient, index) => (
            <TouchableOpacity
              key={patient.id}
              style={[
                styles.patientRow,
                index < PATIENTS.length - 1 && styles.patientRowBorder,
              ]}
              onPress={() =>
                router.push({
                  pathname: "/patients/[id]" as any,
                  params: { id: patient.id },
                })
              }
            >
              <View style={styles.patientInfo}>
                <PersonAvatar size={32} />
                <Text style={styles.patientName}>{patient.name}</Text>
              </View>
              <Text
                style={[styles.statusText, { color: getStatusColor(patient) }]}
              >
                {patient.status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  shiftText: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 2,
  },
  toolsList: {
    gap: 12,
    marginBottom: 28,
  },
  patientsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  patientsCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  patientRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  patientRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  patientInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  patientName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textHeading,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
});
