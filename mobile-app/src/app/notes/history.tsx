// app/notes/history
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface HistoryItem {
  id: string;
  name: string;
  ageGender: string;
  patientId: string;
  subDetails: string;
  status: "Draft" | "Completed";
}

export default function NotesHistoryScreen() {
  const [selectedFilter, setSelectedFilter] = useState<
    "Today" | "Yesterday" | "Week" | "Month"
  >("Today");

  const filterOptions: Array<"Today" | "Yesterday" | "Week" | "Month"> = [
    "Today",
    "Yesterday",
    "Week",
    "Month",
  ];

  const historyList: HistoryItem[] = [
    {
      id: "1",
      name: "Maria Khan",
      ageGender: "35 years, Female",
      patientId: "123XYZ",
      subDetails: "35 Years, F | 65kg",
      status: "Draft",
    },
    {
      id: "2",
      name: "Mr. Ahmed Ali Khan",
      ageGender: "35 years, Male",
      patientId: "123XYZ",
      subDetails: "35 Years, F | 65kg",
      status: "Completed",
    },
    {
      id: "3",
      name: "Mrs. Fatima Sana",
      ageGender: "35 years, Female",
      patientId: "123XYZ",
      subDetails: "35 Years, F | 65kg",
      status: "Completed",
    },
    {
      id: "4",
      name: "Mr. Altaf Ahmed",
      ageGender: "35 years, male",
      patientId: "123XYZ",
      subDetails: "35 Years, F | 65kg",
      status: "Draft",
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Bar */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="#000000" />
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>Notes History</Text>
            <Text style={styles.headerSubtitle}>
              Morning Shift, July 15, 2026
            </Text>
          </View>

          <View style={styles.avatarBadge}>
            <Ionicons name="person" size={20} color="#A78BFA" />
          </View>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          {filterOptions.map((filter) => {
            const isActive = selectedFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                style={[styles.filterPill, isActive && styles.activeFilterPill]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterText,
                    isActive && styles.activeFilterText,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* History Cards List */}
        <View style={styles.listContainer}>
          {historyList.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: "/notes/sbar",
                  params: { patientId: item.patientId, name: item.name },
                })
              }
            >
              <View style={styles.cardHeader}>
                <View style={styles.leftRow}>
                  <View style={styles.rowAvatar}>
                    <Ionicons name="person" size={16} color="#A78BFA" />
                  </View>
                  <View>
                    <Text style={styles.patientName}>{item.name}</Text>
                    <Text style={styles.patientSubtitle}>{item.ageGender}</Text>
                  </View>
                </View>

                {/* Status Badge */}
                <View
                  style={[
                    styles.badge,
                    item.status === "Draft"
                      ? styles.badgeDraft
                      : styles.badgeCompleted,
                  ]}
                >
                  <Text
                    style={[
                      styles.badgeText,
                      item.status === "Draft"
                        ? styles.badgeTextDraft
                        : styles.badgeTextCompleted,
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.subDetailsText}>
                  ID: {item.patientId} | {item.subDetails}
                </Text>
                <Text style={styles.viewLink}>View</Text>
              </View>
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
    backgroundColor: "#F3EFEF",
  },
  container: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  backButton: {
    padding: 4,
  },
  titleContainer: {
    flex: 1,
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 1,
  },
  avatarBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
  },
  filterPill: {
    flex: 1,
    height: 32,
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  activeFilterPill: {
    backgroundColor: "#1D9BF0",
  },
  filterText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#374151",
  },
  activeFilterText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  listContainer: {
    gap: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  leftRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  rowAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
  },
  patientName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
  },
  patientSubtitle: {
    fontSize: 12,
    color: "#6B7280",
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeDraft: {
    backgroundColor: "#E5E7EB",
  },
  badgeCompleted: {
    backgroundColor: "#DCFCE7",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  badgeTextDraft: {
    color: "#EF4444",
  },
  badgeTextCompleted: {
    color: "#166534",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 4,
  },
  subDetailsText: {
    fontSize: 11,
    color: "#6B7280",
  },
  viewLink: {
    fontSize: 11,
    fontWeight: "600",
    color: "#374151",
  },
});
