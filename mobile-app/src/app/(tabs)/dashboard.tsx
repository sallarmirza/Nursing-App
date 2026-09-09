import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

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
];

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
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome Sarah!</Text>
            <Text style={styles.shiftText}>Morning Shift, July 15, 2026</Text>
          </View>
          <Link href="/(tabs)/profile" asChild>
            <TouchableOpacity style={styles.avatarContainer}>
              <Ionicons name="person" size={24} color="#A78BFA" />
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.toolsList}>
          {TOOLS.map((tool) => (
            <Link key={tool.id} href={tool.href as any} asChild>
              <TouchableOpacity style={styles.toolCard}>
                <View style={styles.toolTextContainer}>
                  <Text style={styles.toolTitle}>{tool.title}</Text>
                  <Text style={styles.toolSubtitle}>{tool.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#2C3E50" />
              </TouchableOpacity>
            </Link>
          ))}
        </View>

        <View style={styles.patientsHeader}>
          <Text style={styles.sectionTitle}>Recent Patients</Text>
          <Link href="/(tabs)/patients" asChild>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.patientsCard}>
          {PATIENTS.map((patient, index) => (
            <Link
              key={patient.id}
              href={`/patients/${patient.id}` as any}
              asChild
            >
              <TouchableOpacity
                style={[
                  styles.patientRow,
                  index < PATIENTS.length - 1 && styles.patientRowBorder,
                ]}
              >
                <View style={styles.patientInfo}>
                  <View style={styles.patientAvatar}>
                    <Ionicons name="person" size={18} color="#A78BFA" />
                  </View>
                  <Text style={styles.patientName}>{patient.name}</Text>
                </View>
                <Text
                  style={[styles.statusText, { color: patient.statusColor }]}
                >
                  {patient.status}
                </Text>
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F3F3",
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 24,
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
