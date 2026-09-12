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
import { PersonAvatar } from "../../components/common/PersonAvatar";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { ScreenHeader } from "../../components/common/ScreenHeader";
import { StatusBadge } from "../../components/common/StatusBadge";
import { colors } from "../../theme/colors";

export default function SoapNotesScreen() {
  const params = useLocalSearchParams<{
    patientId?: string;
    patientName?: string;
  }>();

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
      <ScreenHeader title="Nursing Notes" />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.patientCard}>
          <View style={styles.patientLeft}>
            <PersonAvatar size={36} />
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
          <StatusBadge label="Stable" tone="success" />
        </View>

        <Text style={styles.soapHeaderTitle}>SOAP Notes</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Subjective</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={3}
            value={subjective}
            onChangeText={setSubjective}
            placeholder="Patient reports abdominal pain and nausea..."
            placeholderTextColor={colors.placeholder}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Objective</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={3}
            value={objective}
            onChangeText={setObjective}
            placeholder="BP, HR, RR, SpO2, physical examination findings..."
            placeholderTextColor={colors.placeholder}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Assessment</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={3}
            value={assessment}
            onChangeText={setAssessment}
            placeholder="Nursing assessment of the patient's condition..."
            placeholderTextColor={colors.placeholder}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Plan</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={3}
            value={plan}
            onChangeText={setPlan}
            placeholder="Continue monitoring, administer medication, reassess pain in 30 minutes..."
            placeholderTextColor={colors.placeholder}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.actionStack}>
          <PrimaryButton label="Draft" />
          <PrimaryButton label="Download with SBAR" />
          <PrimaryButton label="Download Nursing Notes Only" />

          <View style={styles.iconActionsRow}>
            <TouchableOpacity style={styles.iconActionButton}>
              <Ionicons
                name="share-social-outline"
                size={20}
                color={colors.textHeading}
              />
              <Text style={styles.iconActionText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconActionButton}>
              <Ionicons
                name="copy-outline"
                size={20}
                color={colors.textHeading}
              />
              <Text style={styles.iconActionText}>View</Text>
            </TouchableOpacity>
          </View>

          <PrimaryButton
            label="Proceed to Dashboard"
            onPress={() => router.replace("/(tabs)/dashboard")}
          />
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
    padding: 20,
    gap: 14,
    paddingBottom: 40,
  },
  patientCard: {
    backgroundColor: colors.white,
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
  patientName: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textHeading,
  },
  patientMeta: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  patientSubMeta: {
    fontSize: 10,
    color: colors.textFaint,
    marginTop: 2,
  },
  soapHeaderTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textHeading,
    textAlign: "center",
    marginVertical: 2,
  },
  formGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textHeading,
  },
  textArea: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    fontSize: 13,
    color: colors.textSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 70,
  },
  actionStack: {
    gap: 10,
    marginTop: 12,
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
    color: colors.textSecondary,
    fontWeight: "500",
  },
});
