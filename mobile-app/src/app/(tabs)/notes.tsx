// app/(tabs)/notes

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface PatientNote {
  id: string;
  name: string;
  status: string;
  statusType: "success" | "pending" | "alert" | "warning";
}

export default function NursingNotesScreen() {
  const notesList: PatientNote[] = [
    {
      id: "1",
      name: "Mr. Ahmed Ali Khan",
      status: "Vitals Updated",
      statusType: "success",
    },
    {
      id: "2",
      name: "Mrs. Fatima Sana",
      status: "Pending Medication",
      statusType: "pending",
    },
    {
      id: "3",
      name: "Mrs. Nida Farooq",
      status: "Vitals Overdue",
      statusType: "alert",
    },
    {
      id: "4",
      name: "Mr. Altaf Ahmed",
      status: "Medication Overdue",
      statusType: "alert",
    },
    {
      id: "5",
      name: "Mr. Daniyal Ali",
      status: "IV Bag Low",
      statusType: "warning",
    },
  ];

  const getStatusColor = (type: PatientNote["statusType"]) => {
    switch (type) {
      case "success":
        return "#9CA3AF";
      case "pending":
        return "#9CA3AF";
      case "alert":
        return "#EF4444";
      case "warning":
        return "#84CC16";
      default:
        return "#6B7280";
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Row */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Nursing Notes</Text>
            <Text style={styles.headerSubtitle}>
              Morning Shift, July 15, 2026
            </Text>
          </View>
          <View style={styles.avatarBadge}>
            <Ionicons name="person" size={20} color="#A78BFA" />
          </View>
        </View>

        {/* Patient Notes Card */}
        <View style={styles.cardContainer}>
          {notesList.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.patientRow,
                index < notesList.length - 1 && styles.rowBorder,
              ]}
              onPress={() =>
                router.push({
                  pathname: "/notes/sbar",
                  params: { patientId: item.id, name: item.name },
                })
              }
            >
              <View style={styles.leftContent}>
                <View style={styles.rowAvatar}>
                  <Ionicons name="person" size={16} color="#A78BFA" />
                </View>
                <Text style={styles.patientName}>{item.name}</Text>
              </View>

              <Text
                style={[
                  styles.statusText,
                  { color: getStatusColor(item.statusType) },
                ]}
              >
                {item.status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* See All Action */}
        <TouchableOpacity style={styles.seeAllButton}>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>

        {/* Notes History Button */}
        <TouchableOpacity
          style={styles.historyButton}
          onPress={() => router.push("/notes/history")}
        >
          <Text style={styles.historyButtonText}>Notes History</Text>
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
  container: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  avatarBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
  },
  cardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  patientRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rowAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
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
  seeAllButton: {
    alignSelf: "flex-end",
    paddingVertical: 4,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#000000",
  },
  historyButton: {
    height: 50,
    backgroundColor: "#1D9BF0",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  historyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
