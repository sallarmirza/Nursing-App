// app/patients/[id]

import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function PatientRecordScreen() {
  const { id } = useLocalSearchParams();

  const patient = {
    name: "Maria Khan",
    age: 35,
    gender: "Female",
    patientId: "123XYZ",
    weight: "65kg",
    status: "Stable",
  };

  const vitalsHistory = [
    {
      date: "26, Dec 2025",
      bp: "120/80",
      hr: "72",
      rr: "18",
      spo2: "98%",
      temp: "98.6°F",
    },
    {
      date: "29, Dec 2025",
      bp: "118/78",
      hr: "75",
      rr: "16",
      spo2: "99%",
      temp: "98.4°F",
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Patients Record</Text>
        <TouchableOpacity onPress={() => console.log("Discharge pressed")}>
          <Text style={styles.dischargeText}>Discharge</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Patient Info Card */}
        <View style={styles.patientCard}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={24} color="#A78BFA" />
          </View>
          <View style={styles.patientDetails}>
            <Text style={styles.patientName}>{patient.name}</Text>
            <Text style={styles.patientSubtext}>
              {patient.age} years, {patient.gender}
            </Text>
            <Text style={styles.patientMeta}>
              ID: {patient.patientId} | {patient.age} Years,
              {patient.gender.charAt(0)} | {patient.weight}
            </Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>{patient.status}</Text>
          </View>
        </View>

        {/* Quick Tools Navigation */}
        <View style={styles.toolsList}>
          <TouchableOpacity
            style={styles.toolCard}
            onPress={() => router.push("/calculations/dosage")}
          >
            <View style={styles.toolTextContainer}>
              <Text style={styles.toolTitle}>Dosage Calculator</Text>
              <Text style={styles.toolSubtitle}>
                Safe Med calculation & alerts
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#2C3E50" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolCard}
            onPress={() => router.push("/calculations/drip")}
          >
            <View style={styles.toolTextContainer}>
              <Text style={styles.toolTitle}>IV Drip Rate</Text>
              <Text style={styles.toolSubtitle}>Drops/min calculator</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#2C3E50" />
          </TouchableOpacity>
        </View>

        {/* Vitals History */}
        <View style={styles.vitalsSection}>
          <Text style={styles.sectionTitle}>Vitals History</Text>

          {vitalsHistory.map((item, index) => (
            <View key={index} style={styles.historyGroup}>
              <Text style={styles.dateText}>{item.date}</Text>

              {/* Row 1: BP, HR, RR */}
              <View style={styles.vitalsRow}>
                <View style={styles.vitalBox}>
                  <Text style={styles.vitalText}>{item.bp || "_ BP _"}</Text>
                </View>
                <View style={styles.vitalBox}>
                  <Text style={styles.vitalText}>{item.hr || "_ HR _"}</Text>
                </View>
                <View style={styles.vitalBox}>
                  <Text style={styles.vitalText}>{item.rr || "_ RR _"}</Text>
                </View>
              </View>

              {/* Row 2: SpO2, Temp */}
              <View style={[styles.vitalsRow, styles.vitalsRowCentered]}>
                <View style={styles.vitalBoxHalf}>
                  <Text style={styles.vitalText}>{item.spo2 || "SpO2"}</Text>
                </View>
                <View style={styles.vitalBoxHalf}>
                  <Text style={styles.vitalText}>
                    {item.temp || "Temp (°F)"}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* SBAR Handover Button */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/notes")}
        >
          <Text style={styles.actionButtonText}>Proceed to SBAR Handover</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3EFEF",
  },
  header: {
    height: 56,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
  },
  dischargeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
    textDecorationLine: "underline",
  },
  container: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
  patientCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  patientDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
  },
  patientSubtext: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 1,
  },
  patientMeta: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 12,
    color: "#16A34A",
    fontWeight: "600",
  },
  toolsList: {
    gap: 12,
  },
  toolCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toolTextContainer: {
    flex: 1,
  },
  toolTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 2,
  },
  toolSubtitle: {
    fontSize: 13,
    color: "#8E8D8A",
  },
  vitalsSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },
  historyGroup: {
    gap: 8,
  },
  dateText: {
    fontSize: 13,
    color: "#6B7280",
  },
  vitalsRow: {
    flexDirection: "row",
    gap: 10,
  },
  vitalsRowCentered: {
    justifyContent: "center",
  },
  vitalBox: {
    flex: 1,
    height: 44,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  vitalBoxHalf: {
    width: "48%",
    height: 44,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  vitalText: {
    fontSize: 14,
    color: "#C4B5FD",
    fontWeight: "500",
  },
  actionButton: {
    height: 50,
    backgroundColor: "#1D9BF0",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
