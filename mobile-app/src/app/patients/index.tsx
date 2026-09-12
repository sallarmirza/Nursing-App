// app/patients/index
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  status: "Stable" | "Critical" | "Discharged";
}

const PATIENTS_DATA: Patient[] = [
  {
    id: "1",
    name: "Maria Khan",
    age: 35,
    gender: "Female",
    status: "Stable",
  },
  {
    id: "2",
    name: "Ahmed Raza",
    age: 35,
    gender: "Male",
    status: "Critical",
  },
  {
    id: "3",
    name: "Ali Khan",
    age: 31,
    gender: "Male",
    status: "Discharged",
  },
];

export default function PatientsRecordScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPatients = PATIENTS_DATA.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getStatusColor = (status: Patient["status"]) => {
    switch (status) {
      case "Stable":
        return "#16A34A";
      case "Critical":
        return "#DC2626";
      case "Discharged":
        return "#4B5563";
      default:
        return "#4B5563";
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Patients Record</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <Ionicons name="search-outline" size={20} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Patient Name"
          placeholderTextColor="#C4B5FD"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.content}>
        {/* Section Title & Add Button */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Active Patients</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("/patients/new" as any)}
          >
            <Ionicons name="add" size={16} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add New</Text>
          </TouchableOpacity>
        </View>

        {/* Patient Cards List */}
        <FlatList
          data={filteredPatients}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
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
                <View style={styles.avatar}>
                  <Ionicons name="person" size={20} color="#A78BFA" />
                </View>
                <View>
                  <Text style={styles.patientName}>{item.name}</Text>
                  <Text style={styles.patientSubtext}>
                    {item.age} years, {item.gender}
                  </Text>
                </View>
              </View>

              <View style={styles.badge}>
                <Text
                  style={[
                    styles.badgeText,
                    { color: getStatusColor(item.status) },
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
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
  headerPlaceholder: {
    width: 32,
  },
  searchBarContainer: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#000000",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
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
    color: "#1F2937",
  },
  addButton: {
    backgroundColor: "#1D9BF0",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 4,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  listContainer: {
    gap: 12,
    paddingBottom: 24,
  },
  patientCard: {
    backgroundColor: "#FFFFFF",
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
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
  },
  patientName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
  },
  patientSubtext: {
    fontSize: 13,
    color: "#6B7280",
  },
  badge: {
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
