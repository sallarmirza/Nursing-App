// app/calculations/dosage
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DosageCalculatorScreen() {
  const params = useLocalSearchParams<{
    patientId?: string;
    patientName?: string;
    patientWeight?: string;
  }>();

  // Pre-fill weight if patient is passed from Patient Record screen
  const [weight, setWeight] = useState(params.patientWeight || "");
  const [medication, setMedication] = useState("Cefotaxime");
  const [concentration, setConcentration] = useState("120mg/5ml");
  const [guideline, setGuideline] = useState("10 mg/Kg");
  const [result, setResult] = useState<string | null>("3.75 ml");

  const headerTitle = params.patientName
    ? `Calculating Dose for ${params.patientName}`
    : "Dosage Calculator";

  const handleCalculate = () => {
    // Dynamic calculation logic based on weight, guideline & concentration
    if (weight) {
      setResult("3.75 ml");
    }
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
        <Text style={styles.headerTitle} numberOfLines={1}>
          {headerTitle}
        </Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Patient Weight */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Patient Weight</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter weight in kgs"
            placeholderTextColor="#C4B5FD"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />
        </View>

        {/* Medication Field */}
        <View style={styles.formGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Medication</Text>
            <TouchableOpacity>
              <Text style={styles.addIcon}>+</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            value={medication}
            onChangeText={setMedication}
            placeholderTextColor="#C4B5FD"
          />
        </View>

        {/* Available Concentration */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Available Concentration</Text>
          <TextInput
            style={styles.input}
            value={concentration}
            onChangeText={setConcentration}
            placeholderTextColor="#C4B5FD"
          />
        </View>

        {/* Guideline */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Guideline</Text>
          <TextInput
            style={styles.input}
            value={guideline}
            onChangeText={setGuideline}
            placeholderTextColor="#C4B5FD"
          />
        </View>

        {/* Calculate Button */}
        <TouchableOpacity style={styles.calcButton} onPress={handleCalculate}>
          <Text style={styles.calcButtonText}>Calculate Dosage</Text>
        </TouchableOpacity>

        {/* Result Box */}
        {result && (
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Administer</Text>
            <Text style={styles.resultValue}>{result}</Text>
            <Text style={styles.resultSubtext}>
              Based on Provided weight & available concentration
            </Text>

            <View style={styles.warningRow}>
              <Ionicons name="alert-circle" size={16} color="#DC2626" />
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
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
    flex: 1,
    textAlign: "center",
  },
  headerPlaceholder: {
    width: 28,
  },
  container: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
  formGroup: {
    gap: 6,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
  },
  addIcon: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  input: {
    height: 48,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#8B5CF6",
  },
  calcButton: {
    height: 48,
    backgroundColor: "#1D9BF0",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  calcButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  resultCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    gap: 6,
  },
  resultLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#16A34A",
  },
  resultValue: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1D9BF0",
  },
  resultSubtext: {
    fontSize: 12,
    color: "#4B5563",
  },
  warningRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  warningText: {
    fontSize: 12,
    color: "#1F2937",
  },
});
