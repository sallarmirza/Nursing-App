// app/notes/soap
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
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

export default function SoapNotesScreen() {
  const params = useLocalSearchParams<{
    patientId?: string;
    patientName?: string;
  }>();

  // SOAP Fields State
  const [subjective, setSubjective] = useState(
    "Patient reports abdominal pain and nausea...",
  );
  const [objective, setObjective] = useState(
    "BP, HR, RR, SpO2, physical examination findings...",
  );
  const [assessment, setAssessment] = useState(
    "Nursing assessment of the patient's condition...",
  );
  const [plan, setPlan] = useState(
    "Continue monitoring, administer medication, reassess pain in 30 minutes...",
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nursing Notes</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Patient Header Card */}
        <View style={styles.patientCard}>
          <View style={styles.patientLeft}>
            <View style={styles.patientAvatar}>
              <Ionicons name="person" size={20} color="#A78BFA" />
            </View>
            <View>
              <Text style={styles.patientName}>
                {params.patientName || "Maria Khan"}
              </Text>
              <Text style={styles.patientMeta}>35 years, Female</Text>
              <Text style={styles.patientSubMeta}>
                ID: 123XYZ | 35 Years, F | 65kg
              </Text>
            </View>
          </View>
          <View style={styles.badgeStable}>
            <Text style={styles.badgeStableText}>Stable</Text>
          </View>
        </View>

        {/* Section Heading */}
        <Text style={styles.soapHeaderTitle}>SOAP Notes</Text>

        {/* Subjective */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Subjective</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={3}
            value={subjective}
            onChangeText={setSubjective}
            placeholder="Patient reports abdominal pain and nausea..."
            placeholderTextColor="#C4B5FD"
            textAlignVertical="top"
          />
        </View>

        {/* Objective */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Objective</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={3}
            value={objective}
            onChangeText={setObjective}
            placeholder="BP, HR, RR, SpO2, physical examination findings..."
            placeholderTextColor="#C4B5FD"
            textAlignVertical="top"
          />
        </View>

        {/* Assessment */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Assessment</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={3}
            value={assessment}
            onChangeText={setAssessment}
            placeholder="Nursing assessment of the patient's condition..."
            placeholderTextColor="#C4B5FD"
            textAlignVertical="top"
          />
        </View>

        {/* Plan */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Plan</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={3}
            value={plan}
            onChangeText={setPlan}
            placeholder="Continue monitoring, administer medication, reassess pain in 30 minutes..."
            placeholderTextColor="#C4B5FD"
            textAlignVertical="top"
          />
        </View>

        {/* Action Buttons Stack */}
        <View style={styles.actionStack}>
          <TouchableOpacity style={styles.blueButton}>
            <Text style={styles.blueButtonText}>Draft</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.blueButton}>
            <Text style={styles.blueButtonText}>Download with SBAR</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.blueButton}>
            <Text style={styles.blueButtonText}>
              Download Nursing Notes Only
            </Text>
          </TouchableOpacity>

          {/* Share / View Icon Actions */}
          <View style={styles.iconActionsRow}>
            <TouchableOpacity style={styles.iconActionButton}>
              <Ionicons name="share-social-outline" size={20} color="#1F2937" />
              <Text style={styles.iconActionText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconActionButton}>
              <Ionicons name="copy-outline" size={20} color="#1F2937" />
              <Text style={styles.iconActionText}>View</Text>
            </TouchableOpacity>
          </View>

          {/* Proceed to Dashboard Button */}
          <TouchableOpacity
            style={styles.dashboardButton}
            onPress={() => router.replace("/(tabs)/dashboard")}
          >
            <Text style={styles.blueButtonText}>Proceed to Dashboard</Text>
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
  header: {
    height: 52,
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
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
  },
  headerPlaceholder: {
    width: 28,
  },
  container: {
    padding: 20,
    gap: 14,
    paddingBottom: 40,
  },
  patientCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  patientLeft: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  patientAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
  },
  patientName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
  },
  patientMeta: {
    fontSize: 12,
    color: "#6B7280",
  },
  patientSubMeta: {
    fontSize: 10,
    color: "#9CA3AF",
    marginTop: 2,
  },
  badgeStable: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeStableText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#166534",
  },
  soapHeaderTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
    marginVertical: 2,
  },
  formGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },
  textArea: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    fontSize: 13,
    color: "#4B5563",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    minHeight: 70,
  },
  actionStack: {
    gap: 10,
    marginTop: 12,
  },
  blueButton: {
    height: 48,
    backgroundColor: "#1D9BF0",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  dashboardButton: {
    height: 48,
    backgroundColor: "#1D9BF0",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  blueButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  iconActionsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 32,
    marginVertical: 4,
  },
  iconActionButton: {
    alignItems: "center",
    gap: 2,
  },
  iconActionText: {
    fontSize: 11,
    color: "#4B5563",
    fontWeight: "500",
  },
});
