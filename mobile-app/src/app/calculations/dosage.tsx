// app/calculations/dosage
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FormInput } from "../../components/common/FormInput";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { ScreenHeader } from "../../components/common/ScreenHeader";
import { colors } from "../../theme/colors";
import { useDosageCalculator } from "../../hooks/calculations/useDosageCalculator";

// Reusable unit selector component (mobile-friendly alternative to dropdowns)
const UnitSelector = ({ 
  options, 
  selected, 
  onSelect 
}: { 
  options: string[], 
  selected: string, 
  onSelect: (val: string) => void 
}) => (
  <View className="flex-row flex-wrap gap-2 mt-1 mb-2">
    {options.map((opt) => (
      <TouchableOpacity
        key={opt}
        onPress={() => onSelect(opt)}
        className="px-4 py-2 rounded-lg border"
        style={{
          backgroundColor: selected === opt ? colors.primary : colors.white,
          borderColor: selected === opt ? colors.primary : '#E5E7EB',
        }}
      >
        <Text
          className="text-[13px] font-medium"
          style={{ color: selected === opt ? colors.white : colors.textSecondary }}
        >
          {opt}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

export default function DosageCalculatorScreen() {
  const params = useLocalSearchParams<{
    patientId?: string;
    patientName?: string;
    patientWeight?: string;
  }>();

  const [weight, setWeight] = useState(params.patientWeight || "");
  const [medication, setMedication] = useState("");
  const [dosePerKg, setDosePerKg] = useState("");
  
  // Pre-selected common defaults for units
  const [doseUnit, setDoseUnit] = useState("mg");
  const [concentrationValue, setConcentrationValue] = useState("");
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
      medication: medication || "Unknown Medication",
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
    <SafeAreaView 
      className="flex-1" 
      style={{ backgroundColor: colors.backgroundAlt }} 
      edges={["top", "left", "right"]}
    >
      <ScreenHeader title={headerTitle} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView 
          contentContainerClassName="p-5 gap-4 pb-10"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <FormInput
            label="Patient Weight (kg)"
            placeholder="75"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />

          <FormInput
            label="Medication Name"
            placeholder="Paracetamol"
            value={medication}
            onChangeText={setMedication}
          />

          <View>
            <FormInput
              label="Dose per Kg"
              placeholder="15"
              keyboardType="numeric"
              value={dosePerKg}
              onChangeText={setDosePerKg}
            />
            <Text className="text-xs mt-2 mb-1" style={{ color: colors.textSecondary }}>Select Dose Unit:</Text>
            <UnitSelector 
              options={["mg", "mcg", "g", "Units"]} 
              selected={doseUnit} 
              onSelect={setDoseUnit} 
            />
          </View>

          <View>
            <FormInput
              label="Available Concentration"
              placeholder="250"
              keyboardType="numeric"
              value={concentrationValue}
              onChangeText={setConcentrationValue}
            />
            <Text className="text-xs mt-2 mb-1" style={{ color: colors.textSecondary }}>Select Concentration Unit:</Text>
            <UnitSelector 
              options={["mg/mL", "mcg/mL", "g/L", "Units/mL"]} 
              selected={concentrationUnit} 
              onSelect={setConcentrationUnit} 
            />
          </View>

          <View className="mt-4">
            <PrimaryButton
              label={isLoading ? "Calculating..." : "Calculate Dosage"}
              onPress={handleCalculate}
              disabled={isLoading}
            />
          </View>

          {isLoading && (
            <ActivityIndicator size="small" color={colors.primary} className="mt-2" />
          )}

          {error && (
            <View 
              className="flex-row items-center gap-1.5 p-3 rounded-lg mt-2" 
              style={{ backgroundColor: colors.white, borderWidth: 1, borderColor: colors.danger + '40' }}
            >
              <Ionicons name="alert-circle" size={18} color={colors.danger} />
              <Text className="text-[13px] flex-1" style={{ color: colors.danger }}>
                {error}
              </Text>
            </View>
          )}

          {result && (
            <View className="rounded-xl p-5 mt-2 gap-1.5" style={{ backgroundColor: colors.white }}>
              <Text className="text-[15px] font-bold uppercase tracking-wide" style={{ color: colors.success }}>
                Administer
              </Text>
              <Text className="text-3xl font-bold mb-1" style={{ color: colors.primary }}>
                {result.volume_to_administer_ml} mL
              </Text>
              <Text className="text-[13px]" style={{ color: colors.textSecondary }}>
                {result.required_dose} {result.dose_unit} required based on{" "}
                {result.patient_weight_kg} kg & {result.concentration}
              </Text>

              <View className="flex-row items-center gap-1.5 mt-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                <Ionicons name="warning" size={16} color="#D97706" />
                <Text className="text-xs flex-1" style={{ color: "#92400E" }}>
                  Verify concentration & double-check calculations before administration.
                </Text>
              </View>
            </View>
          )}

          {result && isPatientMode && (
            <View className="gap-2.5 mt-2 mb-8">
              {isSaved ? (
                <View className="flex-row items-center justify-center gap-2 p-3.5 rounded-lg" style={{ backgroundColor: colors.white, borderWidth: 1, borderColor: colors.success + '40' }}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                  <Text className="text-[14px] font-semibold" style={{ color: colors.success }}>
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
                <View 
                  className="flex-row items-center gap-1.5 p-3 rounded-lg" 
                  style={{ backgroundColor: colors.white, borderWidth: 1, borderColor: colors.danger + '40' }}
                >
                  <Ionicons name="alert-circle" size={16} color={colors.danger} />
                  <Text className="text-xs flex-1" style={{ color: colors.danger }}>
                    {saveError}
                  </Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}