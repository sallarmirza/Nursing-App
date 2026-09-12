// app/(tabs)/dashboard

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  {
    id: "1",
    name: "Mr. Ahmed Ali Khan",
    status: "Vitals Updated",
    statusColor: "#8E8D8A",
  },
  {
    id: "2",
    name: "Mrs. Fatima Sana",
    status: "Pending Medication",
    statusColor: "#8E8D8A",
  },
  {
    id: "3",
    name: "Mrs. Nida Farooq",
    status: "Vitals Overdue",
    statusColor: "#EF4444",
  },
  {
    id: "4",
    name: "Mr. Altaf Ahmed",
    status: "Medication Overdue",
    statusColor: "#EF4444",
  },
  {
    id: "5",
    name: "Mr. Daniyal Ali",
    status: "IV Bag Low",
    statusColor: "#84CC16",
  },
];

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
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={() => router.push("/(tabs)/profile")}
          >
            <Ionicons name="person" size={24} color="#A78BFA" />
          </TouchableOpacity>
        </View>

        <View style={styles.toolsList}>
          {TOOLS.map((tool) => (
            <TouchableOpacity
              key={tool.id}
              style={styles.toolCard}
              onPress={() => router.push(tool.href as any)}
            >
              <View style={styles.toolTextContainer}>
                <Text style={styles.toolTitle}>{tool.title}</Text>
                <Text style={styles.toolSubtitle}>{tool.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#2C3E50" />
            </TouchableOpacity>
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
                <View style={styles.patientAvatar}>
                  <Ionicons name="person" size={18} color="#A78BFA" />
                </View>
                <Text style={styles.patientName}>{patient.name}</Text>
              </View>
              <Text style={[styles.statusText, { color: patient.statusColor }]}>
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
    backgroundColor: "#F4F3F3",
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
    color: "#000000",
  },
  shiftText: {
    fontSize: 14,
    color: "#8E8D8A",
    marginTop: 2,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
  },
  toolsList: {
    gap: 12,
    marginBottom: 28,
  },
  toolCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toolTextContainer: {
    flex: 1,
  },
  toolTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 2,
  },
  toolSubtitle: {
    fontSize: 13,
    color: "#8E8D8A",
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
    color: "#6B7280",
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
  },
  patientsCard: {
    backgroundColor: "#FFFFFF",
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
    borderBottomColor: "#E5E7EB",
  },
  patientInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  patientAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  patientName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
});
