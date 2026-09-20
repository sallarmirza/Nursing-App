// app/notes/soap
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PersonAvatar } from "../../components/common/PersonAvatar";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { ScreenHeader } from "../../components/common/ScreenHeader";
import { colors } from "../../theme/colors";
import useRegisterSoap from "../../hooks/notes/useRegisterSoap";

export default function SoapNotesScreen() {
  const params = useLocalSearchParams<{
    patientId?: string;
    patientName?: string;
    noteId?: string;
  }>();

  const [subjective, setSubjective] = useState("");
  const [objective, setObjective] = useState("");
  const [assessment, setAssessment] = useState("");
  const [plan, setPlan] = useState("");

  const { registerSoap, isLoading, error } = useRegisterSoap();

  const handleSave = async () => {
    if (!params.patientId || !params.noteId) return;
    if (!subjective || !objective || !assessment || !plan) return;

    const success = await registerSoap(params.patientId, params.noteId, {
      Subjective: subjective,
      Objective: objective,
      Assessment: assessment,
      Plan: plan,
    });

    if (success) {
      router.replace("/(tabs)/dashboard");
    }
  };

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
                {params.patientName || "Patient"}
              </Text>
              <Text style={styles.patientMeta}>ID: {params.patientId}</Text>
            </View>
          </View>
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

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.actionStack}>
          <PrimaryButton
            label={isLoading ? "Saving..." : "Save SOAP Note"}
            onPress={handleSave}
            disabled={isLoading}
          />
          {isLoading && (
            <ActivityIndicator size="small" color={colors.primary} />
          )}
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
  errorText: {
    color: colors.dangerAlt,
    fontSize: 13,
  },
});