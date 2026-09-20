// app/notes/sbar
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PersonAvatar } from "../../components/common/PersonAvatar";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { ScreenHeader } from "../../components/common/ScreenHeader";
import {
  hasSbarContent,
  useSbarHandover,
} from "../../hooks/notes/useSbarHandover";
import useMedications from "../../hooks/medications/useMedications";
import useRecordVitals from "../../hooks/vitals/useRecordVitals";
import { colors } from "../../theme/colors";
import { SbarIvMedication } from "../../types/sbar";

export default function SbarHandoverScreen() {
  const params = useLocalSearchParams<{
    patientId?: string;
    patientName?: string;
    noteId?: string;
  }>();

  const [modalVisible, setModalVisible] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [situation, setSituation] = useState("");
  const [background, setBackground] = useState("");
  const [assessment, setAssessment] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [spo2, setSpo2] = useState("");
  const [temp, setTemp] = useState("");

  // Add-medication inputs
  const [medName, setMedName] = useState("");
  const [medDose, setMedDose] = useState("");
  const [medUnit, setMedUnit] = useState("");
  const [medFrequency, setMedFrequency] = useState("");

  const { isLoading: sbarLoading, error: sbarError, submit } =
    useSbarHandover();
  const {
    recordVitals,
    isLoading: vitalsLoading,
    error: vitalsError,
  } = useRecordVitals();
  const {
    medications,
    isLoading: medsLoading,
    isMutating: medsMutating,
    error: medsError,
    addMedication,
    removeMedication,
  } = useMedications(params.patientId);

  const isBusy = sbarLoading || vitalsLoading || medsMutating;
  const displayError = formError || vitalsError || sbarError;
  const patientName = params.patientName || "Patient";

  const handleAddMedication = async () => {
    const added = await addMedication({
      medName,
      dose: medDose,
      doseUnit: medUnit,
      frequency: medFrequency,
    });

    if (added) {
      setMedName("");
      setMedDose("");
      setMedUnit("");
      setMedFrequency("");
    }
  };

  const handleRemoveMedication = (medId: string, name: string) => {
    Alert.alert(
      "Remove medication",
      `Remove ${name} from ${patientName}'s medication list?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            removeMedication(medId);
          },
        },
      ]
    );
  };

  const handleSubmit = async () => {
    setFormError(null);

    if (!params.patientId) {
      setFormError("No patient selected. Open this screen from a patient record.");
      return;
    }

    // Snapshot of the medication list as it stands at handover time
    const medicationSnapshot: SbarIvMedication[] = medications.map((m) => ({
      name: m.med_name,
      dose:
        m.dose !== null ? `${m.dose} ${m.dose_unit ?? ""}`.trim() : "",
      frequency: m.frequency ?? undefined,
    }));

    const form = {
      situation,
      background,
      assessment,
      recommendation,
      medications: medicationSnapshot,
    };

    // Validate first so a failed SBAR never leaves a stray vitals reading
    if (!hasSbarContent(form)) {
      setFormError("Fill in at least one SBAR section before submitting");
      return;
    }

    const vitalsSaved = await recordVitals(params.patientId, "SBAR", {
      bp: "",
      hr: "",
      rr: "",
      spO2: spo2,
      temp,
    });
    if (!vitalsSaved) return;

    const success = await submit(params.patientId, form);
    if (success) setModalVisible(true);
  };

  const handleContinue = () => {
    setModalVisible(false);

    if (params.noteId) {
      router.replace({
        pathname: "/notes/soap",
        params: {
          patientId: params.patientId,
          patientName: params.patientName || "",
          noteId: params.noteId,
        },
      });
      return;
    }

    router.replace("/(tabs)/dashboard");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScreenHeader title="Patients Record" />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.patientCard}>
          <PersonAvatar size={36} />
          <View style={styles.patientDetails}>
            <Text style={styles.patientName}>{patientName}</Text>
            {params.patientId ? (
              <Text style={styles.patientMeta}>ID: {params.patientId}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Situation</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={3}
            placeholder="Problem: e.g. sudden drop in BP, patient restless..."
            placeholderTextColor={colors.placeholder}
            value={situation}
            onChangeText={setSituation}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Background</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={3}
            placeholder="Admission diagnosis, past history, recent procedures/labs..."
            placeholderTextColor={colors.placeholder}
            value={background}
            onChangeText={setBackground}
          />
        </View>

        <View style={styles.vitalsRow}>
          <TextInput
            style={styles.vitalInput}
            placeholder="SpO2"
            placeholderTextColor={colors.placeholder}
            keyboardType="numeric"
            value={spo2}
            onChangeText={setSpo2}
          />
          <TextInput
            style={styles.vitalInput}
            placeholder="Temp (°F)"
            placeholderTextColor={colors.placeholder}
            keyboardType="numeric"
            value={temp}
            onChangeText={setTemp}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Assessment</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={3}
            placeholder="Your assessment of the current problem..."
            placeholderTextColor={colors.placeholder}
            value={assessment}
            onChangeText={setAssessment}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Recommendation</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={3}
            placeholder="What needs to happen next..."
            placeholderTextColor={colors.placeholder}
            value={recommendation}
            onChangeText={setRecommendation}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Current IV Medications</Text>

          {medsLoading && (
            <ActivityIndicator size="small" color={colors.primary} />
          )}

          {!medsLoading && params.patientId && medications.length === 0 && (
            <Text style={styles.emptyText}>No medications recorded yet.</Text>
          )}

          {medications.map((med) => (
            <View key={med.med_id} style={styles.medListRow}>
              <View style={styles.medListInfo}>
                <Text style={styles.medListName}>{med.med_name}</Text>
                <Text style={styles.medListMeta}>
                  {med.dose !== null ? `${med.dose} ${med.dose_unit ?? ""}` : ""}
                  {med.frequency ? ` · ${med.frequency}` : ""}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleRemoveMedication(med.med_id, med.med_name)}
                disabled={medsMutating}
                hitSlop={8}
              >
                <Ionicons name="trash-outline" size={20} color={colors.danger} />
              </TouchableOpacity>
            </View>
          ))}

          <View style={styles.medRow}>
            <TextInput
              style={styles.medNameInput}
              placeholder="Name"
              placeholderTextColor={colors.placeholder}
              maxLength={255}
              value={medName}
              onChangeText={setMedName}
            />
            <View style={styles.divider} />
            <TextInput
              style={styles.medDoseInput}
              placeholder="Dose"
              placeholderTextColor={colors.placeholder}
              keyboardType="numeric"
              value={medDose}
              onChangeText={setMedDose}
            />
          </View>

          <View style={styles.medRow}>
            <TextInput
              style={styles.medNameInput}
              placeholder="Unit (e.g. mg)"
              placeholderTextColor={colors.placeholder}
              maxLength={20}
              value={medUnit}
              onChangeText={setMedUnit}
            />
            <View style={styles.divider} />
            <TextInput
              style={styles.medDoseInput}
              placeholder="Frequency"
              placeholderTextColor={colors.placeholder}
              maxLength={50}
              value={medFrequency}
              onChangeText={setMedFrequency}
            />
          </View>

          {medsError && (
            <View style={styles.errorCard}>
              <Ionicons name="alert-circle" size={16} color={colors.danger} />
              <Text style={styles.errorText}>{medsError}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.addMedButton, medsMutating && styles.addMedDisabled]}
            onPress={handleAddMedication}
            disabled={medsMutating || !params.patientId}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={18} color={colors.white} />
            <Text style={styles.addMedText}>
              {medsMutating ? "Saving..." : "Add Medication"}
            </Text>
          </TouchableOpacity>
        </View>

        {displayError && (
          <View style={styles.errorCard}>
            <Ionicons name="alert-circle" size={16} color={colors.danger} />
            <Text style={styles.errorText}>{displayError}</Text>
          </View>
        )}

        {isBusy && <ActivityIndicator size="small" color={colors.primary} />}

        <PrimaryButton
          label={isBusy ? "Submitting..." : "Submit Handover"}
          onPress={handleSubmit}
          disabled={isBusy}
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
              Report for {patientName} has been Successfully Recorded
            </Text>

            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={48} color={colors.white} />
            </View>

            <PrimaryButton
              label={params.noteId ? "Continue to SOAP Notes" : "Dashboard"}
              onPress={handleContinue}
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
  emptyText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  medListRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  medListInfo: {
    flex: 1,
  },
  medListName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  medListMeta: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  medRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 8,
    height: 44,
    paddingHorizontal: 14,
    marginBottom: 2,
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
  addMedButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.primary,
    marginTop: 4,
  },
  addMedDisabled: {
    opacity: 0.6,
  },
  addMedText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.white,
  },
  errorCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 12,
    backgroundColor: colors.white,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 12,
    color: colors.danger,
    flex: 1,
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