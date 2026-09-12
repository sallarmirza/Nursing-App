// app/(auth)/staff-profile
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
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

export default function StaffProfileScreen() {
  const [isEditing, setIsEditing] = useState(true);

  // Form State
  const [name, setName] = useState("");
  const [qualification, setQualification] = useState("");
  const [designation, setDesignation] = useState("Staff Nurse...");
  const [hospital, setHospital] = useState("Ibadat International Hospital");
  const [experience, setExperience] = useState("5 Years");

  const handleSave = () => {
    setIsEditing(false);
    // Complete onboarding and replace root stack to tabs
    router.replace("/(tabs)/dashboard");
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
        {/* Title Header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Staff Profile</Text>
          <View style={styles.avatarBadge}>
            <Ionicons name="person" size={18} color="#A78BFA" />
          </View>
        </View>

        {/* Name Input */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#C4B5FD"
            editable={isEditing}
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Qualification Input */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Qualification</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your Qualification"
            placeholderTextColor="#C4B5FD"
            editable={isEditing}
            value={qualification}
            onChangeText={setQualification}
          />
        </View>

        {/* Designation Input */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Designation</Text>
          <TextInput
            style={styles.input}
            placeholder="Staff Nurse..."
            placeholderTextColor="#C4B5FD"
            editable={isEditing}
            value={designation}
            onChangeText={setDesignation}
          />
        </View>

        {/* Hospital Input */}
        <View style={styles.formGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Hospital</Text>
            <TouchableOpacity disabled={!isEditing}>
              <Text style={styles.addIcon}>+</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Ibadat International Hospital"
            placeholderTextColor="#C4B5FD"
            editable={isEditing}
            value={hospital}
            onChangeText={setHospital}
          />
        </View>

        {/* Experience Input */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Experience</Text>
          <TextInput
            style={styles.input}
            placeholder="5 Years"
            placeholderTextColor="#C4B5FD"
            editable={isEditing}
            value={experience}
            onChangeText={setExperience}
          />
        </View>

        {/* Buttons */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3EFEF",
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
    color: "#000000",
  },
  avatarBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
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
    color: "#C4B5FD",
  },
  buttonGroup: {
    gap: 12,
    marginTop: 16,
  },
  saveButton: {
    height: 48,
    backgroundColor: "#1D9BF0",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  editButton: {
    height: 48,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  editButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
});
