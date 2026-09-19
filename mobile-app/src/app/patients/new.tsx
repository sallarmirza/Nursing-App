// app/patients/new
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FormInput } from "../../components/common/FormInput";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { ScreenHeader } from "../../components/common/ScreenHeader";
import { colors } from "../../theme/colors";
import { useCreatePatient } from "../../hooks/patients/useCreatePatient";

// Splits "John Michael Smith" into first="John", last="Michael Smith"
function splitName(fullName: string): { first: string; last: string } {
  const parts = fullName.trim().split(/\s+/);
  return {
    first: parts[0] || "",
    last: parts.slice(1).join(" ") || parts[0] || "",
  };
}

export default function AddNewPatientScreen() {
  const [name, setName] = useState("");
  const [patientId, setPatientId] = useState(""); // display-only, backend generates its own
  const [gender, setGender] = useState<"Male" | "Female" | "Other" | "">("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [ward, setWard] = useState("");

  // Vitals — kept in UI, not yet wired to backend
  const [bp, setBp] = useState("");
  const [hr, setHr] = useState("");
  const [rr, setRr] = useState("");
  const [spo2, setSpo2] = useState("");
  const [temp, setTemp] = useState("");

  const { createPatient, isLoading, error } = useCreatePatient();

  const handleSave = async () => {
    if (!name || !gender) return;

    const { first, last } = splitName(name);

    const newPatientId = await createPatient({
      patient_first_name: first,
      patient_last_name: last,
      gender,
      patient_weight: weight ? parseFloat(weight) : undefined,
      patient_height: height ? parseFloat(height) : undefined,
      patient_blood_group: bloodGroup || undefined,
      patient_ward: ward || undefined,
    });

    if (newPatientId) {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Add New Patient" showBack={true} />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <FormInput
          label="Patient Name*"
          placeholder="Enter Patient Name"
          value={name}
          onChangeText={setName}
        />

        <FormInput
          label="ID*"
          placeholder="Enter Patient ID"
          value={patientId}
          onChangeText={setPatientId}
          editable={false}
        />

        <View style={styles.formGroup}>
          <Text style={styles.label}>Gender*</Text>
          <View style={styles.genderContainer}>
            {(["Male", "Female", "Other"] as const).map((item) => {
              const isSelected = gender === item;
              return (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.genderOption,
                    isSelected && styles.genderOptionSelected,
                  ]}
                  onPress={() => setGender(item)}
                >
                  <Text
                    style={[
                      styles.genderText,
                      isSelected && styles.genderTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <FormInput
              label="Weight (kg)"
              placeholder="Weight"
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />
          </View>
          <View style={styles.halfWidth}>
            <FormInput
              label="Height (cm)"
              placeholder="Height"
              keyboardType="numeric"
              value={height}
              onChangeText={setHeight}
            />
          </View>
        </View>

        <FormInput
          label="Blood Group"
          placeholder="e.g. A+, O-, AB+"
          value={bloodGroup}
          onChangeText={setBloodGroup}
        />

        <FormInput
          label="Ward*"
          placeholder="Enter Ward"
          value={ward}
          onChangeText={setWard}
        />

        <View style={styles.formGroup}>
          <Text style={styles.label}>Initial vitals</Text>

          <View style={styles.vitalsRow}>
            <TextInput
              style={styles.vitalsInput}
              placeholder="_ BP _"
              placeholderTextColor={colors.placeholder}
              value={bp}
              onChangeText={setBp}
            />
            <TextInput
              style={styles.vitalsInput}
              placeholder="_ HR _"
              placeholderTextColor={colors.placeholder}
              keyboardType="numeric"
              value={hr}
              onChangeText={setHr}
            />
            <TextInput
              style={styles.vitalsInput}
              placeholder="_ RR _"
              placeholderTextColor={colors.placeholder}
              keyboardType="numeric"
              value={rr}
              onChangeText={setRr}
            />
          </View>

          <View style={[styles.vitalsRow, styles.vitalsRowCentered]}>
            <TextInput
              style={styles.vitalsInputHalf}
              placeholder="SpO2"
              placeholderTextColor={colors.placeholder}
              keyboardType="numeric"
              value={spo2}
              onChangeText={setSpo2}
            />
            <TextInput
              style={styles.vitalsInputHalf}
              placeholder="Temp (°F)"
              placeholderTextColor={colors.placeholder}
              keyboardType="numeric"
              value={temp}
              onChangeText={setTemp}
            />
          </View>
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <PrimaryButton
          label={isLoading ? "Saving..." : "Save"}
          onPress={handleSave}
          disabled={isLoading}
          style={styles.saveButton}
        />
        {isLoading && <ActivityIndicator size="small" color={colors.primary} />}
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
  formGroup: {
    gap: 6,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textHeading,
  },
  genderContainer: {
    flexDirection: "row",
    gap: 12,
  },
  genderOption: {
    flex: 1,
    height: 48,
    backgroundColor: colors.white,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  genderOptionSelected: {
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  genderText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  genderTextSelected: {
    color: colors.primary,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  vitalsRow: {
    flexDirection: "row",
    gap: 10,
  },
  vitalsRowCentered: {
    justifyContent: "center",
    marginTop: 10,
  },
  vitalsInput: {
    flex: 1,
    height: 48,
    backgroundColor: colors.white,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 14,
    color: colors.textPrimary,
  },
  vitalsInputHalf: {
    width: "48%",
    height: 48,
    backgroundColor: colors.white,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 14,
    color: colors.textPrimary,
  },
  saveButton: {
    marginTop: 12,
  },
  errorText: {
    color: colors.dangerAlt,
    fontSize: 13,
  },
});