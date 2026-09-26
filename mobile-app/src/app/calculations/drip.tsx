// app/calculations/drip
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
import { useDripCalculator } from "../../hooks/calculations/useDripCalculator";

const DROP_FACTOR_OPTIONS = [
  "15 gtt/ml (Standard)",
  "10 gtt/ml (Blood)",
  "20 gtt/ml (Macro)",
  "60 gtt/ml (Micro/ped)",
  "Other (Custom)",
];

const CUSTOM_OPTION = "Other (Custom)";

// Extracts the leading number from options like "15 gtt/ml (Standard)"
function parseDropFactor(option: string): number | null {
  const match = option.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

export default function IVDripRateScreen() {
  const params = useLocalSearchParams<{
    patientId?: string;
    patientName?: string;
  }>();

  const [volume, setVolume] = useState("");
  const [time, setTime] = useState("");
  const [selectedDropFactor, setSelectedDropFactor] = useState(
    "15 gtt/ml (Standard)"
  );
  const [customDropFactor, setCustomDropFactor] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const {
    result,
    isLoading,
    error,
    calculate,
    reset,
    saveToRecord,
    isSaving,
    saveError,
    savedId,
  } = useDripCalculator();

  const isPatientMode = !!params.patientId;

  const headerTitle = params.patientName
    ? `IV Drip Rate for ${params.patientName}`
    : "IV Drip Rate";

  const handleCalculate = () => {
    const volumeNum = parseFloat(volume);
    const timeHoursNum = parseFloat(time);

    const dropFactorNum =
      selectedDropFactor === CUSTOM_OPTION
        ? parseFloat(customDropFactor)
        : parseDropFactor(selectedDropFactor);

    if (!volumeNum || !timeHoursNum || !dropFactorNum) {
      reset();
      return;
    }

    calculate({
      total_volume: volumeNum,
      time_duration_min: timeHoursNum * 60, // hours -> minutes
      drop_factor: dropFactorNum,
    });
  };

  const handleSave = () => {
    if (!params.patientId) return;
    saveToRecord(params.patientId);
  };

  const equivalentMlPerHour =
    result && result.time_duration_min > 0
      ? Math.round(
          result.total_volume_ml / (result.time_duration_min / 60)
        )
      : null;

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
            label="Total Volume (mL)"
            placeholder="1000"
            keyboardType="numeric"
            value={volume}
            onChangeText={setVolume}
          />

          <FormInput
            label="Total Time (hours)"
            placeholder="8"
            keyboardType="numeric"
            value={time}
            onChangeText={setTime}
          />

          <View>
            <Text
              className="text-[15px] font-semibold mb-1.5"
              style={{ color: colors.textHeading }}
            >
              Drop Factor
            </Text>
            <View
              className="rounded-lg bg-white overflow-hidden"
              style={{ borderWidth: 1, borderColor: "#E5E7EB" }}
            >
              <TouchableOpacity
                className="flex-row items-center justify-between p-3.5"
                activeOpacity={0.7}
                onPress={() => setIsDropdownOpen((prev) => !prev)}
              >
                <Text className="text-[15px]" style={{ color: colors.textHeading }}>
                  {selectedDropFactor}
                </Text>
                <Ionicons
                  name={isDropdownOpen ? "chevron-up" : "chevron-down"}
                  size={18}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>

              {isDropdownOpen && (
                <View className="border-t border-gray-100">
                  {DROP_FACTOR_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option}
                      className="p-3.5 border-b border-gray-50"
                      onPress={() => {
                        setSelectedDropFactor(option);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <Text
                        className={`text-[14px] ${
                          option === selectedDropFactor ? "font-semibold" : ""
                        }`}
                        style={{
                          color:
                            option === selectedDropFactor
                              ? colors.primary
                              : colors.textSecondary,
                        }}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {selectedDropFactor === CUSTOM_OPTION && (
            <FormInput
              label="Custom Drop Factor (gtt/ml)"
              placeholder="12"
              keyboardType="numeric"
              value={customDropFactor}
              onChangeText={setCustomDropFactor}
            />
          )}

          <View className="mt-2">
            <PrimaryButton
              label={isLoading ? "Calculating..." : "Calculate Rate"}
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
              style={{
                backgroundColor: colors.white,
                borderWidth: 1,
                borderColor: colors.danger + "40",
              }}
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
                Infusion Rate
              </Text>
              <Text className="text-3xl font-bold mb-1" style={{ color: colors.primary }}>
                {result.drop_rate_gtt_min} gtt/min
              </Text>
              {equivalentMlPerHour !== null && (
                <Text className="text-[13px]" style={{ color: colors.textSecondary }}>
                  Equivalent to {equivalentMlPerHour} mL/hour
                </Text>
              )}

              <View className="flex-row items-center gap-1.5 mt-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                <Ionicons name="warning" size={16} color="#D97706" />
                <Text className="text-xs flex-1" style={{ color: "#92400E" }}>
                  Check drop factor specified on the IV tubing packaging before starting.
                </Text>
              </View>
            </View>
          )}

          {result && isPatientMode && (
            <View className="gap-2.5 mt-2 mb-8">
              {savedId ? (
                <View
                  className="flex-row items-center justify-center gap-2 p-3.5 rounded-lg"
                  style={{
                    backgroundColor: colors.white,
                    borderWidth: 1,
                    borderColor: colors.success + "40",
                  }}
                >
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
                  style={{
                    backgroundColor: colors.white,
                    borderWidth: 1,
                    borderColor: colors.danger + "40",
                  }}
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