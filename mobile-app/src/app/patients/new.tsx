// // app/patients/new

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function AddNewPatientScreen() {
  const [name, setName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | "Other" | "">("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [bedNo, setBedNo] = useState("");

  // Vitals
  const [bp, setBp] = useState("");
  const [hr, setHr] = useState("");
  const [rr, setRr] = useState("");
  const [spo2, setSpo2] = useState("");
  const [temp, setTemp] = useState("");

  const handleSave = () => {
    // Save logic goes here
    router.back();
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
        <Text style={styles.headerTitle}>Add New Patient</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Patient Name */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Patient Name*</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Patient Name"
            placeholderTextColor="#C4B5FD"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Patient ID */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>ID*</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Patient ID"
            placeholderTextColor="#C4B5FD"
            value={patientId}
            onChangeText={setPatientId}
          />
        </View>

        {/* Gender Selection */}
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

        {/* Weight & Height (Side by Side) */}
        <View style={styles.row}>
          <View style={[styles.formGroup, styles.halfWidth]}>
            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput
              style={styles.input}
              placeholder="Weight"
              placeholderTextColor="#C4B5FD"
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />
          </View>

          <View style={[styles.formGroup, styles.halfWidth]}>
            <Text style={styles.label}>Height (cm)</Text>
            <TextInput
              style={styles.input}
              placeholder="Height"
              placeholderTextColor="#C4B5FD"
              keyboardType="numeric"
              value={height}
              onChangeText={setHeight}
            />
          </View>
        </View>

        {/* Blood Group */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Blood Group</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Blood Group"
            placeholderTextColor="#C4B5FD"
            value={bloodGroup}
            onChangeText={setBloodGroup}
          />
        </View>

        {/* Bed No */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Bed No.*</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Bed No.."
            placeholderTextColor="#C4B5FD"
            value={bedNo}
            onChangeText={setBedNo}
          />
        </View>

        {/* Initial Vitals */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Initial vitals</Text>

          {/* Row 1: BP, HR, RR */}
          <View style={styles.vitalsRow}>
            <TextInput
              style={styles.vitalsInput}
              placeholder="_ BP _"
              placeholderTextColor="#C4B5FD"
              value={bp}
              onChangeText={setBp}
            />
            <TextInput
              style={styles.vitalsInput}
              placeholder="_ HR _"
              placeholderTextColor="#C4B5FD"
              keyboardType="numeric"
              value={hr}
              onChangeText={setHr}
            />
            <TextInput
              style={styles.vitalsInput}
              placeholder="_ RR _"
              placeholderTextColor="#C4B5FD"
              keyboardType="numeric"
              value={rr}
              onChangeText={setRr}
            />
          </View>

          {/* Row 2: SpO2, Temp */}
          <View style={[styles.vitalsRow, styles.vitalsRowCentered]}>
            <TextInput
              style={styles.vitalsInputHalf}
              placeholder="SpO2"
              placeholderTextColor="#C4B5FD"
              keyboardType="numeric"
              value={spo2}
              onChangeText={setSpo2}
            />
            <TextInput
              style={styles.vitalsInputHalf}
              placeholder="Temp (°F)"
              placeholderTextColor="#C4B5FD"
              keyboardType="numeric"
              value={temp}
              onChangeText={setTemp}
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
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
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
  },
  headerPlaceholder: {
    width: 32,
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
    color: "#1F2937",
  },
  input: {
    height: 48,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#000000",
  },
  genderContainer: {
    flexDirection: "row",
    gap: 12,
  },
  genderOption: {
    flex: 1,
    height: 48,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  genderOptionSelected: {
    borderWidth: 1.5,
    borderColor: "#1D9BF0",
  },
  genderText: {
    fontSize: 15,
    color: "#6B7280",
  },
  genderTextSelected: {
    color: "#1D9BF0",
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
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 14,
    color: "#000000",
  },
  vitalsInputHalf: {
    width: "48%",
    height: 48,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 14,
    color: "#000000",
  },
  saveButton: {
    height: 50,
    backgroundColor: "#1D9BF0",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
