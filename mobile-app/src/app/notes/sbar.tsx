// app/notes/sbar
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PersonAvatar } from "../../components/common/PersonAvatar";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { ScreenHeader } from "../../components/common/ScreenHeader";
import { StatusBadge } from "../../components/common/StatusBadge";
import { colors } from "../../theme/colors";

export default function SbarHandoverScreen() {
  const [modalVisible, setModalVisible] = useState(false);

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
      <ScreenHeader title="Patients Record" />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.patientCard}>
          <PersonAvatar size={36} />
          <View style={styles.patientDetails}>
            <Text style={styles.patientName}>Maria Khan</Text>
            <Text style={styles.patientSubtext}>35 years, Female</Text>
            <Text style={styles.patientMeta}>
              ID: 123XYZ | 35 Years, F | 65kg
            </Text>
          </View>
          <StatusBadge label="Stable" tone="success" />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Situation</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={3}
            value={situation}
            onChangeText={setSituation}
            placeholderTextColor={colors.placeholder}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Background</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={3}
            value={background}
            onChangeText={setBackground}
            placeholderTextColor={colors.placeholder}
          />
        </View>

        <View style={styles.vitalsRow}>
          <TextInput
            style={styles.vitalInput}
            placeholder="SpO2"
            placeholderTextColor={colors.placeholder}
            value={spo2}
            onChangeText={setSpo2}
          />
          <TextInput
            style={styles.vitalInput}
            placeholder="Temp (°F)"
            placeholderTextColor={colors.placeholder}
            value={temp}
            onChangeText={setTemp}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Current Medications</Text>

          <View style={styles.medRow}>
            <TextInput
              style={styles.medNameInput}
              placeholder="Name"
              placeholderTextColor={colors.placeholder}
              value={med1Name}
              onChangeText={setMed1Name}
            />
            <View style={styles.divider} />
            <TextInput
              style={styles.medDoseInput}
              placeholder="Dose"
              placeholderTextColor={colors.placeholder}
              value={med1Dose}
              onChangeText={setMed1Dose}
            />
          </View>

          <View style={styles.medRow}>
            <TextInput
              style={styles.medNameInput}
              placeholder="Name"
              placeholderTextColor={colors.placeholder}
              value={med2Name}
              onChangeText={setMed2Name}
            />
            <View style={styles.divider} />
            <TextInput
              style={styles.medDoseInput}
              placeholder="Dose"
              placeholderTextColor={colors.placeholder}
              value={med2Dose}
              onChangeText={setMed2Dose}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Current IV Medications</Text>

          <View style={styles.medRow}>
            <TextInput
              style={styles.medNameInput}
              placeholder="Name"
              placeholderTextColor={colors.placeholder}
              value={ivMedName}
              onChangeText={setIvMedName}
            />
            <View style={styles.divider} />
            <TextInput
              style={styles.medDoseInput}
              placeholder="Dose"
              placeholderTextColor={colors.placeholder}
              value={ivMedDose}
              onChangeText={setIvMedDose}
            />
          </View>
        </View>

        <PrimaryButton
          label="Submit Handover"
          onPress={handleSubmit}
          style={styles.submitButton}
        />
      </ScrollView>

      <Modal
        animationType="fade"
        transparent
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
              <Ionicons name="checkmark" size={48} color={colors.white} />
            </View>

            <PrimaryButton
              label="Dashboard"
              onPress={handleNavigateDashboard}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
  },
  container: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
  patientCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  patientDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  patientSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  patientMeta: {
    fontSize: 10,
    color: colors.textFaint,
  },
  formGroup: {
    gap: 6,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textHeading,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: colors.textSecondary,
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
    backgroundColor: colors.white,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 14,
    color: colors.textPrimary,
  },
  medRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 8,
    height: 44,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  medNameInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
  },
  divider: {
    width: 1,
    height: "60%",
    backgroundColor: colors.border,
    marginHorizontal: 12,
  },
  medDoseInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
  },
  submitButton: {
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%",
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    gap: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 16,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.successAlt,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
});
