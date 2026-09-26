// app/(auth)/staff-profile
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FormInput } from "../../components/common/FormInput";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { colors } from "../../theme/colors";
import { useProfileSetup } from "../../hooks/auth/useProfileSetup";

const QUALIFICATION_OPTIONS = ["BSN", "RN", "MSN", "Diploma in Nursing", "Post-RN BSN"];
const DESIGNATION_OPTIONS = ["Staff Nurse", "Charge Nurse", "Head Nurse", "Nursing Supervisor"];
const EXPERIENCE_OPTIONS = ["1 Year", "2 Years", "3 Years", "4 Years", "5 Years", "6 Years", "7 Years", "8 Years", "9 Years", "10+ Years"];

function parseExperienceYears(input: string): number {
  if (!input) return 0;
  const match = input.match(/^(\d+(\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

export default function StaffProfileScreen() {
  const [isEditing, setIsEditing] = useState(true);

  const [name, setName] = useState("");
  const [qualification, setQualification] = useState("");
  const [designation, setDesignation] = useState("");
  const [institute, setInstitute] = useState("");
  const [experience, setExperience] = useState("");

  const [activeDropdown, setActiveDropdown] = useState<"qualification" | "designation" | "experience" | null>(null);

  const { setupProfile, isLoading, error } = useProfileSetup();

  const handleSave = async () => {
    if (!name) return;

    const experienceYears = parseExperienceYears(experience);

    const success = await setupProfile(
      name,
      qualification,
      designation,
      institute,
      experienceYears
    );

    if (success) {
      setIsEditing(false);
      router.replace("/(tabs)/dashboard");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const toggleDropdown = (dropdown: "qualification" | "designation" | "experience") => {
    if (!isEditing) return;
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const renderInlineDropdown = (
    options: string[],
    selectedValue: string,
    onSelect: (val: string) => void
  ) => (
    <View
      className="mt-1 rounded-lg overflow-hidden"
      style={{
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
        maxHeight: 220
      }}
    >
      <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
        {options.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="p-4"
            style={{
              backgroundColor: selectedValue === item ? colors.backgroundAlt : "transparent",
              borderBottomWidth: index === options.length - 1 ? 0 : 1,
              borderBottomColor: colors.border,
            }}
            onPress={() => {
              onSelect(item);
              setActiveDropdown(null);
            }}
          >
            <Text
              className="text-[15px] font-medium"
              style={{ color: selectedValue === item ? colors.primaryAlt : colors.textPrimary }}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.backgroundAlt }}
      edges={["top", "left", "right"]}
    >
      <ScrollView
        className="p-6"
        contentContainerStyle={{ gap: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-3 mb-2">
          <Text
            className="text-xl font-bold"
            style={{ color: colors.textPrimary }}
          >
            Staff Profile
          </Text>
        </View>

        <FormInput
          label="Full Name"
          placeholder="Write your full name"
          placeholderTextColor="#9CA3AF"
          editable={isEditing}
          value={name}
          onChangeText={setName}
        />

        <View>
          <TouchableOpacity activeOpacity={isEditing ? 0.7 : 1} onPress={() => toggleDropdown("qualification")}>
            <View pointerEvents="none">
              <FormInput
                label="Qualification"
                placeholder="Select your Qualification"
                placeholderTextColor="#9CA3AF"
                editable={false}
                value={qualification}
                onChangeText={setQualification}
              />
            </View>
          </TouchableOpacity>
          {activeDropdown === "qualification" && renderInlineDropdown(QUALIFICATION_OPTIONS, qualification, setQualification)}
        </View>

        <View>
          <TouchableOpacity activeOpacity={isEditing ? 0.7 : 1} onPress={() => toggleDropdown("designation")}>
            <View pointerEvents="none">
              <FormInput
                label="Designation"
                placeholder="Select your Designation"
                placeholderTextColor="#9CA3AF"
                editable={false}
                value={designation}
                onChangeText={setDesignation}
              />
            </View>
          </TouchableOpacity>
          {activeDropdown === "designation" && renderInlineDropdown(DESIGNATION_OPTIONS, designation, setDesignation)}
        </View>

        <FormInput
          label="Institute"
          placeholder="Enter Institute Name"
          placeholderTextColor="#9CA3AF"
          editable={isEditing}
          value={institute}
          onChangeText={setInstitute}
        />

        <View>
          <TouchableOpacity activeOpacity={isEditing ? 0.7 : 1} onPress={() => toggleDropdown("experience")}>
            <View pointerEvents="none">
              <FormInput
                label="Experience"
                placeholder="Select Years of Experience"
                placeholderTextColor="#9CA3AF"
                editable={false}
                value={experience}
                onChangeText={setExperience}
              />
            </View>
          </TouchableOpacity>
          {activeDropdown === "experience" && renderInlineDropdown(EXPERIENCE_OPTIONS, experience, setExperience)}
        </View>

        {error && (
          <Text className="text-[14px]" style={{ color: colors.dangerAlt }}>
            {error}
          </Text>
        )}

        <View className="gap-3 mt-4">
          <PrimaryButton
            label={isLoading ? "Saving..." : "Save"}
            onPress={handleSave}
            disabled={isLoading}
          />
          {isLoading && (
            <ActivityIndicator size="small" color={colors.primaryAlt} />
          )}
          <PrimaryButton label="Edit" variant="outline" onPress={handleEdit} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}