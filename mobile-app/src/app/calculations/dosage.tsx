// app/calculations/dosage
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FormInput } from "../../components/common/FormInput";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { ScreenHeader } from "../../components/common/ScreenHeader";
import { colors } from "../../theme/colors";

export default function DosageCalculatorScreen() {
  const params = useLocalSearchParams<{
    patientId?: string;
    patientName?: string;
    patientWeight?: string;
  }>();

  const [weight, setWeight] = useState(params.patientWeight || "");
  const [medication, setMedication] = useState("Cefotaxime");
  const [concentration, setConcentration] = useState("120mg/5ml");
  const [guideline, setGuideline] = useState("10 mg/Kg");
  const [result, setResult] = useState<string | null>("3.75 ml");

  const headerTitle = params.patientName
    ? `Calculating Dose for ${params.patientName}`
    : "Dosage Calculator";

  const handleCalculate = () => {
    if (weight) {
      setResult("3.75 ml");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScreenHeader title={headerTitle} />

      <ScrollView contentContainerStyle={styles.container}>
        <FormInput
          label="Patient Weight"
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
          label="Available Concentration"
          value={concentration}
          onChangeText={setConcentration}
        />

        <FormInput
          label="Guideline"
          value={guideline}
          onChangeText={setGuideline}
        />

        <PrimaryButton
          label="Calculate Dosage"
          onPress={handleCalculate}
          style={styles.calcButton}
        />

        {result && (
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Administer</Text>
            <Text style={styles.resultValue}>{result}</Text>
            <Text style={styles.resultSubtext}>
              Based on Provided weight & available concentration
            </Text>

            <View style={styles.warningRow}>
              <Ionicons name="alert-circle" size={16} color={colors.danger} />
              <Text style={styles.warningText}>
                Verify concentration & check dose
              </Text>
            </View>
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
});
