// app/calculations/drip
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FormInput } from "../../components/common/FormInput";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { ScreenHeader } from "../../components/common/ScreenHeader";
import { colors } from "../../theme/colors";

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
  const [dripRate] = useState("31 gtt/min");
  const [equivalentRate] = useState("125ml/hour");

  const handleCalculate = () => {
    // Calculation logic goes here
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScreenHeader title="IV Drip Rate" />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <FormInput
          label="Total Volume"
          placeholder="Volume in ml"
          keyboardType="numeric"
          value={volume}
          onChangeText={setVolume}
        />

        <FormInput
          label="Total Time"
          placeholder="Time in hours"
          keyboardType="numeric"
          value={time}
          onChangeText={setTime}
        />

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
                color={colors.textSecondary}
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

        <PrimaryButton
          label="Calculate Rate"
          onPress={handleCalculate}
          style={styles.calculateButton}
        />

        {dripRate && (
          <View style={styles.resultCard}>
            <Text style={styles.infusionLabel}>Infusion Rate</Text>
            <Text style={styles.rateValue}>{dripRate}</Text>
            <Text style={styles.equivalentText}>
              Equivalent to {equivalentRate}
            </Text>

            <View style={styles.alertContainer}>
              <Ionicons
                name="alert-circle"
                size={18}
                color={colors.dangerAlt}
              />
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
    backgroundColor: colors.backgroundAlt,
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
    color: colors.textHeading,
  },
  dropdownCard: {
    backgroundColor: colors.white,
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
    color: colors.placeholder,
  },
  dropdownList: {
    marginTop: 8,
  },
  dropdownOption: {
    paddingVertical: 8,
  },
  dropdownOptionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  optionText: {
    fontSize: 14,
    color: colors.placeholder,
  },
  activeOptionText: {
    fontWeight: "600",
  },
  calculateButton: {
    marginTop: 12,
  },
  resultCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginTop: 8,
  },
  infusionLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.success,
    marginBottom: 4,
  },
  rateValue: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.primary,
    marginBottom: 4,
  },
  equivalentText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  alertContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  alertText: {
    fontSize: 13,
    color: colors.textHeading,
    fontWeight: "500",
  },
});
