// app/calculation/drip
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

const DROP_FACTOR_OPTIONS = [
  "15 gtt/ml (Standard)",
  "10 gtt/ml (Blood)",
  "20 gtt/ml (Macro)",
  "60 gtt/ml (Micro/ped)",
  "Other (Custom)",
];

export default function IVDripRateScreen() {
  const [volume, setVolume] = useState("");
  const [time, setTime] = useState("");
  const [selectedDropFactor, setSelectedDropFactor] = useState(
    "15 gtt/ml (Standard)",
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  const [dripRate, setDripRate] = useState("31 gtt/min");
  const [equivalentRate, setEquivalentRate] = useState("125ml/hour");

  const handleCalculate = () => {
    // Calculation logic goes here
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
        <Text style={styles.headerTitle}>IV Drip Rate</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Total Volume */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Total Volume</Text>
          <TextInput
            style={styles.input}
            placeholder="Volume in ml"
            placeholderTextColor="#C4B5FD"
            keyboardType="numeric"
            value={volume}
            onChangeText={setVolume}
          />
        </View>

        {/* Total Time */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Total Time</Text>
          <TextInput
            style={styles.input}
            placeholder="Time in hours"
            placeholderTextColor="#C4B5FD"
            keyboardType="numeric"
            value={time}
            onChangeText={setTime}
          />
        </View>

        {/* Drop Factor Selector */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Drop Factor</Text>
          <View style={styles.dropdownCard}>
            <TouchableOpacity
              style={styles.dropdownHeader}
              activeOpacity={0.7}
              onPress={() => setIsDropdownOpen((prev) => !prev)}
            >
              <Text style={styles.selectedOptionText}>
                {selectedDropFactor}
              </Text>
              <Ionicons
                name={isDropdownOpen ? "chevron-up" : "chevron-down"}
                size={18}
                color="#4B5563"
              />
            </TouchableOpacity>

            {isDropdownOpen && (
              <View style={styles.dropdownList}>
                {DROP_FACTOR_OPTIONS.map((option, index) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.dropdownOption,
                      index < DROP_FACTOR_OPTIONS.length - 1 &&
                        styles.dropdownOptionBorder,
                    ]}
                    onPress={() => {
                      setSelectedDropFactor(option);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        option === selectedDropFactor &&
                          styles.activeOptionText,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Calculate Button */}
        <TouchableOpacity
          style={styles.calculateButton}
          onPress={handleCalculate}
        >
          <Text style={styles.calculateButtonText}>Calculate Rate</Text>
        </TouchableOpacity>

        {/* Result Card */}
        {dripRate && (
          <View style={styles.resultCard}>
            <Text style={styles.infusionLabel}>Infusion Rate</Text>
            <Text style={styles.rateValue}>{dripRate}</Text>
            <Text style={styles.equivalentText}>
              Equivalent to {equivalentRate}
            </Text>

            <View style={styles.alertContainer}>
              <Ionicons name="alert-circle" size={18} color="#EF4444" />
              <Text style={styles.alertText}>
                Check drop factor in tubing package
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
    color: "#8B5CF6",
  },
  dropdownCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectedOptionText: {
    fontSize: 15,
    color: "#C4B5FD",
  },
  dropdownList: {
    marginTop: 8,
  },
  dropdownOption: {
    paddingVertical: 8,
  },
  dropdownOptionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  optionText: {
    fontSize: 14,
    color: "#C4B5FD",
  },
  activeOptionText: {
    fontWeight: "600",
  },
  calculateButton: {
    height: 50,
    backgroundColor: "#1D9BF0",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  calculateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  resultCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginTop: 8,
  },
  infusionLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#22C55E",
    marginBottom: 4,
  },
  rateValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1D9BF0",
    marginBottom: 4,
  },
  equivalentText: {
    fontSize: 13,
    color: "#4B5563",
    marginBottom: 16,
  },
  alertContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  alertText: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
  },
});
