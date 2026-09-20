// app/calculations/dosage
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FormInput } from "../../components/common/FormInput";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { ScreenHeader } from "../../components/common/ScreenHeader";
import { colors } from "../../theme/colors";
import { useDosageCalculator } from "../../hooks/calculations/useDosageCalculator";

export default function DosageCalculatorScreen() {
  const params = useLocalSearchParams<{
    patientId?: string;
    patientName?: string;
    patientWeight?: string;
  }>();

  const [weight, setWeight] = useState(params.patientWeight || "");
  const [medication, setMedication] = useState("Cefotaxime");
  const [dosePerKg, setDosePerKg] = useState("10");
  const [doseUnit, setDoseUnit] = useState("mg");
  const [concentrationValue, setConcentrationValue] = useState("24");
  const [concentrationUnit, setConcentrationUnit] = useState("mg/mL");

  const {
    result,
    isLoading,
    error,
    calculate,
    reset,
    saveToRecord,
    isSaving,
    saveError,
    isSaved,
  } = useDosageCalculator();

  const isPatientMode = !!params.patientId;

  const headerTitle = params.patientName
    ? `Calculating Dose for ${params.patientName}`
    : "Dosage Calculator";

  const handleCalculate = () => {
    const weightNum = parseFloat(weight);
    const dosePerKgNum = parseFloat(dosePerKg);
    const concentrationValueNum = parseFloat(concentrationValue);

    if (!weightNum || !dosePerKgNum || !concentrationValueNum) {
      reset();
      return;
    }

    calculate({
      patient_weight: weightNum,
      medication,
      dose_per_kg: dosePerKgNum,
      dose_unit: doseUnit,
      concentration_value: concentrationValueNum,
      concentration_unit: concentrationUnit,
    });
  };

  const handleSave = () => {
    if (!params.patientId) return;
    saveToRecord(params.patientId);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScreenHeader title={headerTitle} />

      <ScrollView contentContainerStyle={styles.container}>
        <FormInput
          label="Patient Weight (kg)"
          placeholder="Enter weight in kgs"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />

        <FormInput
          label="Medication"
          value={medication}
          onChangeText={setMedication}
        />

        <FormInput
          label="Dose per Kg"
          placeholder="e.g. 10"
          keyboardType="numeric"
          value={dosePerKg}
          onChangeText={setDosePerKg}
        />

        <FormInput
          label="Dose Unit"
          placeholder="e.g. mg"
          value={doseUnit}
          onChangeText={setDoseUnit}
        />

        <FormInput
          label="Available Concentration"
          placeholder="e.g. 24"
          keyboardType="numeric"
          value={concentrationValue}
          onChangeText={setConcentrationValue}
        />

        <FormInput
          label="Concentration Unit"
          placeholder="e.g. mg/mL"
          value={concentrationUnit}
          onChangeText={setConcentrationUnit}
        />

        <PrimaryButton
          label={isLoading ? "Calculating..." : "Calculate Dosage"}
          onPress={handleCalculate}
          disabled={isLoading}
          style={styles.calcButton}
        />

        {isLoading && (
          <ActivityIndicator size="small" color={colors.primary} />
        )}

        {error && (
          <View style={styles.errorCard}>
            <Ionicons name="alert-circle" size={16} color={colors.danger} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {result && (
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Administer</Text>
            <Text style={styles.resultValue}>
              {result.volume_to_administer_ml} mL
            </Text>
            <Text style={styles.resultSubtext}>
              {result.required_dose} {result.dose_unit} required based on{" "}
              {result.patient_weight_kg} kg & {result.concentration}
            </Text>

            <View style={styles.warningRow}>
              <Ionicons name="alert-circle" size={16} color={colors.danger} />
              <Text style={styles.warningText}>
                Verify concentration & check dose
              </Text>
            </View>
          </View>
        )}

        {result && isPatientMode && (
          <View style={styles.saveSection}>
            {isSaved ? (
              <View style={styles.savedRow}>
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={colors.success}
                />
                <Text style={styles.savedText}>
                  Saved to {params.patientName || "patient"}'s record
                </Text>
              </View>
            ) : (
              <PrimaryButton
                label={isSaving ? "Saving..." : "Save to Record"}
                onPress={handleSave}
                disabled={isSaving}
              />
            )}

            {isSaving && (
              <ActivityIndicator size="small" color={colors.primary} />
            )}

            {saveError && (
              <View style={styles.errorCard}>
                <Ionicons name="alert-circle" size={16} color={colors.danger} />
                <Text style={styles.errorText}>{saveError}</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
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
  calcButton: {
    marginTop: 8,
  },
  resultCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    gap: 6,
  },
  resultLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.success,
  },
  resultValue: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.primary,
  },
  resultSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  warningRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  warningText: {
    fontSize: 12,
    color: colors.textHeading,
  },
  saveSection: {
    gap: 10,
  },
  savedRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 12,
    backgroundColor: colors.white,
    borderRadius: 8,
  },
  savedText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.success,
  },
  errorCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 12,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 12,
    color: colors.danger,
    flex: 1,
  },
});