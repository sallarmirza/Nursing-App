// app/patients/new
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
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

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

function splitName(fullName: string): { first: string; last: string } {
  const parts = fullName.trim().split(/\s+/);
  return {
    first: parts[0] || "",
    last: parts.slice(1).join(" ") || parts[0] || "",
  };
}

export default function AddNewPatientScreen() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | "Other" | "">("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [isBloodGroupOpen, setIsBloodGroupOpen] = useState(false);
  const [ward, setWard] = useState("");

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
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.backgroundAlt }}
    >
      <ScreenHeader title="Add New Patient" showBack={true} />

      <ScrollView
        contentContainerClassName="p-5 gap-4 pb-10"
        showsVerticalScrollIndicator={false}
      >
        <FormInput
          label="Patient Name*"
          placeholder="Enter full legal name"
          value={name}
          onChangeText={setName}
        />

        {/* Gender Selection */}
        <View className="gap-[6px]">
          <Text
            className="text-[15px] font-semibold"
            style={{ color: colors.textHeading }}
          >
            Gender*
          </Text>
          <View className="flex-row gap-3">
            {(["Male", "Female", "Other"] as const).map((item) => {
              const isSelected = gender === item;
              return (
                <TouchableOpacity
                  key={item}
                  className="flex-1 h-12 bg-white rounded-lg items-center justify-center"
                  style={
                    isSelected
                      ? { borderWidth: 1.5, borderColor: colors.primary }
                      : undefined
                  }
                  onPress={() => setGender(item)}
                >
                  <Text
                    className={`text-[15px] ${isSelected ? "font-semibold" : ""}`}
                    style={{
                      color: isSelected ? colors.primary : colors.textSecondary,
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Weight & Height */}
        <View className="flex-row gap-3">
          <View className="flex-1">
            <FormInput
              label="Weight (kg)"
              placeholder="e.g. 72.5"
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />
          </View>
          <View className="flex-1">
            <FormInput
              label="Height (ft)"
              placeholder="e.g. 5.10"
              keyboardType="numeric"
              value={height}
              onChangeText={setHeight}
            />
          </View>
        </View>

        {/* Blood Group Dropdown */}
        <View className="gap-[6px]">
          <Text
            className="text-[15px] font-semibold"
            style={{ color: colors.textHeading }}
          >
            Blood Group
          </Text>
          <TouchableOpacity
            className="h-12 bg-white rounded-lg px-4 flex-row items-center justify-between"
            activeOpacity={0.7}
            onPress={() => setIsBloodGroupOpen((prev) => !prev)}
          >
            <Text
              className="text-sm"
              style={{
                color: bloodGroup ? colors.textPrimary : colors.placeholder,
              }}
            >
              {bloodGroup || "Select blood type"}
            </Text>
            <Text className="text-xs text-gray-400">
              {isBloodGroupOpen ? "▲" : "▼"}
            </Text>
          </TouchableOpacity>

          {isBloodGroupOpen && (
            <View className="bg-white rounded-lg border border-gray-100 overflow-hidden mt-1 shadow-sm">
              {BLOOD_GROUPS.map((bg, idx) => {
                const isSelected = bloodGroup === bg;
                return (
                  <TouchableOpacity
                    key={bg}
                    className={`px-4 py-3 flex-row justify-between items-center ${
                      idx !== BLOOD_GROUPS.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                    style={{
                      backgroundColor: isSelected ? "#F3F4F6" : "transparent",
                    }}
                    onPress={() => {
                      setBloodGroup(bg);
                      setIsBloodGroupOpen(false);
                    }}
                  >
                    <Text
                      className={`text-sm ${isSelected ? "font-bold" : ""}`}
                      style={{
                        color: isSelected ? colors.primary : colors.textPrimary,
                      }}
                    >
                      {bg}
                    </Text>
                    {isSelected && (
                      <Text
                        style={{ color: colors.primary }}
                        className="font-bold"
                      >
                        ✓
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        <FormInput
          label="Ward*"
          placeholder="e.g. Ward 4B / ICU Bed 12"
          value={ward}
          onChangeText={setWard}
        />

        {/* Vitals Section */}
        <View className="gap-[6px]">
          <Text
            className="text-[15px] font-semibold"
            style={{ color: colors.textHeading }}
          >
            Initial vitals
          </Text>

          <View className="flex-row gap-2.5">
            <TextInput
              className="flex-1 h-12 bg-white rounded-lg text-center text-sm"
              style={{ color: colors.textPrimary }}
              placeholder="BP (e.g. 120/80)"
              placeholderTextColor={colors.placeholder}
              value={bp}
              onChangeText={setBp}
            />
            <TextInput
              className="flex-1 h-12 bg-white rounded-lg text-center text-sm"
              style={{ color: colors.textPrimary }}
              placeholder="HR (bpm)"
              placeholderTextColor={colors.placeholder}
              keyboardType="numeric"
              value={hr}
              onChangeText={setHr}
            />
            <TextInput
              className="flex-1 h-12 bg-white rounded-lg text-center text-sm"
              style={{ color: colors.textPrimary }}
              placeholder="RR (/min)"
              placeholderTextColor={colors.placeholder}
              keyboardType="numeric"
              value={rr}
              onChangeText={setRr}
            />
          </View>

          <View className="flex-row gap-2.5 justify-center mt-2.5">
            <TextInput
              className="w-[48%] h-12 bg-white rounded-lg text-center text-sm"
              style={{ color: colors.textPrimary }}
              placeholder="SpO2 (%)"
              placeholderTextColor={colors.placeholder}
              keyboardType="numeric"
              value={spo2}
              onChangeText={setSpo2}
            />
            <TextInput
              className="w-[48%] h-12 bg-white rounded-lg text-center text-sm"
              style={{ color: colors.textPrimary }}
              placeholder="Temp (°F)"
              placeholderTextColor={colors.placeholder}
              keyboardType="numeric"
              value={temp}
              onChangeText={setTemp}
            />
          </View>
        </View>

        {error && (
          <Text className="text-[13px]" style={{ color: colors.dangerAlt }}>
            {error}
          </Text>
        )}

        <PrimaryButton
          label={isLoading ? "Saving..." : "Save"}
          onPress={handleSave}
          disabled={isLoading}
          style={{ marginTop: 12 }}
        />
        {isLoading && (
          <ActivityIndicator size="small" color={colors.primary} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}