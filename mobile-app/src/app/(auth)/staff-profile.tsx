// app/(auth)/staff-profile
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FormInput } from "../../components/common/FormInput";
import { PersonAvatar } from "../../components/common/PersonAvatar";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { colors } from "../../theme/colors";
import { useProfileSetup } from "../../hooks/auth/useProfileSetup";

// Extracts the leading number from strings like "5 Years"
function parseExperienceYears(input: string): number {
  const match = input.match(/^(\d+(\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

export default function StaffProfileScreen() {
  const [isEditing, setIsEditing] = useState(true);

  const [name, setName] = useState("");
  const [qualification, setQualification] = useState("");
  const [designation, setDesignation] = useState("Staff Nurse...");
  const [hospital, setHospital] = useState("Ibadat International Hospital");
  const [experience, setExperience] = useState("5 Years");

  const { setupProfile, isLoading, error } = useProfileSetup();

  const handleSave = async () => {
    if (!name) return;

    const experienceYears = parseExperienceYears(experience);

    const success = await setupProfile(
      name,
      qualification,
      designation,
      hospital,
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

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Staff Profile</Text>
          <PersonAvatar size={32} />
        </View>

        <FormInput
          label="Name"
          placeholder="Enter your name"
          editable={isEditing}
          value={name}
          onChangeText={setName}
        />

        <FormInput
          label="Qualification"
          placeholder="Enter your Qualification"
          editable={isEditing}
          value={qualification}
          onChangeText={setQualification}
        />

        <FormInput
          label="Designation"
          placeholder="Staff Nurse..."
          editable={isEditing}
          value={designation}
          onChangeText={setDesignation}
        />

        <FormInput
          label="Hospital"
          placeholder="Ibadat International Hospital"
          editable={isEditing}
          value={hospital}
          onChangeText={setHospital}
        />

        <FormInput
          label="Experience"
          placeholder="5 Years"
          editable={isEditing}
          value={experience}
          onChangeText={setExperience}
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.buttonGroup}>
          <PrimaryButton
            label={isLoading ? "Saving..." : "Save"}
            onPress={handleSave}
            disabled={isLoading}
          />
          {isLoading && <ActivityIndicator size="small" color={colors.primaryAlt} />}
          <PrimaryButton label="Edit" variant="outline" onPress={handleEdit} />
        </View>
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
    padding: 24,
    gap: 16,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  buttonGroup: {
    gap: 12,
    marginTop: 16,
  },
  errorText: {
    color: colors.dangerAlt,
    fontSize: 13,
  },
});