// // app/notes/sbar

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SbarHandoverScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  // Form State
  const [situation, setSituation] = useState(
    "Problem: Sudden Drop in BP (90/50) & Patient is restless, etc....",
  );
  const [background, setBackground] = useState(
    "Admission Diagnosis, Past Medical History, Recent Procedures/Labs, Current Medications etc",
  );
  const [spo2, setSpo2] = useState("");
  const [temp, setTemp] = useState("");

  const [med1Name, setMed1Name] = useState("");
  const [med1Dose, setMed1Dose] = useState("");
  const [med2Name, setMed2Name] = useState("");
  const [med2Dose, setMed2Dose] = useState("");

  const [ivMedName, setIvMedName] = useState("");
  const [ivMedDose, setIvMedDose] = useState("");

  const handleSubmit = () => {
    setModalVisible(true);
  };

  const handleNavigateDashboard = () => {
    setModalVisible(false);
    router.replace("/(tabs)/dashboard");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
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

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Patient Card */}
        <View style={styles.patientCard}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={20} color="#A78BFA" />
          </View>
          <View style={styles.patientDetails}>
            <Text style={styles.patientName}>Maria Khan</Text>
            <Text style={styles.patientSubtext}>35 years, Female</Text>
            <Text style={styles.patientMeta}>
              ID: 123XYZ | 35 Years, F | 65kg
            </Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>Stable</Text>
          </View>
        </View>

        {/* Situation */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Situation</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={3}
            value={situation}
            onChangeText={setSituation}
            placeholderTextColor="#C4B5FD"
          />
        </View>

        {/* Background */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Background</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={3}
            value={background}
            onChangeText={setBackground}
            placeholderTextColor="#C4B5FD"
          />
        </View>

        {/* SpO2 & Temp Vitals Row */}
        <View style={styles.vitalsRow}>
          <TextInput
            style={styles.vitalInput}
            placeholder="SpO2"
            placeholderTextColor="#C4B5FD"
            value={spo2}
            onChangeText={setSpo2}
          />
          <TextInput
            style={styles.vitalInput}
            placeholder="Temp (°F)"
            placeholderTextColor="#C4B5FD"
            value={temp}
            onChangeText={setTemp}
          />
        </View>

        {/* Current Medications */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Current Medications</Text>

          <View style={styles.medRow}>
            <TextInput
              style={styles.medNameInput}
              placeholder="Name"
              placeholderTextColor="#C4B5FD"
              value={med1Name}
              onChangeText={setMed1Name}
            />
            <View style={styles.divider} />
            <TextInput
              style={styles.medDoseInput}
              placeholder="Dose"
              placeholderTextColor="#C4B5FD"
              value={med1Dose}
              onChangeText={setMed1Dose}
            />
          </View>

          <View style={styles.medRow}>
            <TextInput
              style={styles.medNameInput}
              placeholder="Name"
              placeholderTextColor="#C4B5FD"
              value={med2Name}
              onChangeText={setMed2Name}
            />
            <View style={styles.divider} />
            <TextInput
              style={styles.medDoseInput}
              placeholder="Dose"
              placeholderTextColor="#C4B5FD"
              value={med2Dose}
              onChangeText={setMed2Dose}
            />
          </View>
        </View>

        {/* Current IV Medications */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Current IV Medications</Text>

          <View style={styles.medRow}>
            <TextInput
              style={styles.medNameInput}
              placeholder="Name"
              placeholderTextColor="#C4B5FD"
              value={ivMedName}
              onChangeText={setIvMedName}
            />
            <View style={styles.divider} />
            <TextInput
              style={styles.medDoseInput}
              placeholder="Dose"
              placeholderTextColor="#C4B5FD"
              value={ivMedDose}
              onChangeText={setIvMedDose}
            />
          </View>
        </View>

        {/* Submit Action */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Handover</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Success Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Handover Submitted</Text>
            <Text style={styles.modalSubtitle}>
              Report for Maria Khan has been Successfully Recorded
            </Text>

            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={48} color="#FFFFFF" />
            </View>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleNavigateDashboard}
            >
              <Text style={styles.modalButtonText}>Dashboard</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    width: 28,
  },
  container: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
  patientCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  patientDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000000",
  },
  patientSubtext: {
    fontSize: 12,
    color: "#6B7280",
  },
  patientMeta: {
    fontSize: 10,
    color: "#9CA3AF",
  },
  statusBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 11,
    color: "#16A34A",
    fontWeight: "600",
  },
  formGroup: {
    gap: 6,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: "#4B5563",
  },
  textArea: {
    minHeight: 64,
    textAlignVertical: "top",
  },
  vitalsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  vitalInput: {
    width: "42%",
    height: 44,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 14,
    color: "#000000",
  },
  medRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    height: 44,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  medNameInput: {
    flex: 1,
    fontSize: 14,
    color: "#000000",
  },
  divider: {
    width: 1,
    height: "60%",
    backgroundColor: "#E5E7EB",
    marginHorizontal: 12,
  },
  medDoseInput: {
    flex: 1,
    fontSize: 14,
    color: "#000000",
  },
  submitButton: {
    height: 48,
    backgroundColor: "#1D9BF0",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 8,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 13,
    color: "#4B5563",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 20,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  modalButton: {
    width: "60%",
    height: 44,
    backgroundColor: "#1D9BF0",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
