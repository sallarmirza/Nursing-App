// app/notes/sbar
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PersonAvatar } from "../../components/common/PersonAvatar";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { ScreenHeader } from "../../components/common/ScreenHeader";
import {
  hasSbarContent,
  useSbarHandover,
} from "../../hooks/notes/useSbarHandover";
import useMedications from "../../hooks/medications/useMedications";
import useRecordVitals from "../../hooks/vitals/useRecordVitals";
import { colors } from "../../theme/colors";
import { SbarIvMedication } from "../../types/sbar";

export default function SbarHandoverScreen() {
  const params = useLocalSearchParams<{
    patientId?: string;
    patientName?: string;
    noteId?: string;
  }>();

  const [modalVisible, setModalVisible] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [situation, setSituation] = useState("");
  const [background, setBackground] = useState("");
  const [assessment, setAssessment] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [spo2, setSpo2] = useState("");
  const [temp, setTemp] = useState("");

  const [medName, setMedName] = useState("");
  const [medDose, setMedDose] = useState("");
  const [medUnit, setMedUnit] = useState("");
  const [medFrequency, setMedFrequency] = useState("");

  const { isLoading: sbarLoading, error: sbarError, submit } =
    useSbarHandover();
  const {
    recordVitals,
    isLoading: vitalsLoading,
    error: vitalsError,
  } = useRecordVitals();
  const {
    medications,
    isLoading: medsLoading,
    isMutating: medsMutating,
    error: medsError,
    addMedication,
    removeMedication,
  } = useMedications(params.patientId);

  const isBusy = sbarLoading || vitalsLoading || medsMutating;
  const displayError = formError || vitalsError || sbarError;
  const patientName = params.patientName || "Patient";

  const handleAddMedication = async () => {
    const added = await addMedication({
      medName,
      dose: medDose,
      doseUnit: medUnit,
      frequency: medFrequency,
    });

    if (added) {
      setMedName("");
      setMedDose("");
      setMedUnit("");
      setMedFrequency("");
    }
  };

  const handleRemoveMedication = (medId: string, name: string) => {
    Alert.alert(
      "Remove medication",
      `Remove ${name} from ${patientName}'s medication list?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            removeMedication(medId);
          },
        },
      ]
    );
  };

  const handleSubmit = async () => {
    setFormError(null);

    if (!params.patientId) {
      setFormError("No patient selected. Open this screen from a patient record.");
      return;
    }

    const medicationSnapshot: SbarIvMedication[] = medications.map((m) => ({
      name: m.med_name,
      dose:
        m.dose !== null ? `${m.dose} ${m.dose_unit ?? ""}`.trim() : "",
      frequency: m.frequency ?? undefined,
    }));

    const form = {
      situation,
      background,
      assessment,
      recommendation,
      medications: medicationSnapshot,
    };

    if (!hasSbarContent(form)) {
      setFormError("Fill in at least one SBAR section before submitting");
      return;
    }

    const vitalsSaved = await recordVitals(params.patientId, "SBAR", {
      bp: "",
      hr: "",
      rr: "",
      spO2: spo2,
      temp,
    });
    if (!vitalsSaved) return;

    const success = await submit(params.patientId, form);
    if (success) setModalVisible(true);
  };

  const handleContinue = () => {
    setModalVisible(false);

    if (params.noteId) {
      router.replace({
        pathname: "/notes/soap",
        params: {
          patientId: params.patientId,
          patientName: params.patientName || "",
          noteId: params.noteId,
        },
      });
      return;
    }

    router.replace("/(tabs)/dashboard");
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.backgroundAlt }}
      edges={["top", "left", "right"]}
    >
      <ScreenHeader title="Patients Record" />

      <ScrollView
        contentContainerClassName="p-6 gap-5 pb-10"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View
          className="rounded-xl p-4 flex-row items-center gap-3"
          style={{ backgroundColor: colors.white }}
        >
          <PersonAvatar size={44} />
          <View className="flex-1">
            <Text
              className="text-[17px] font-bold"
              style={{ color: colors.textPrimary }}
            >
              {patientName}
            </Text>
            {params.patientId ? (
              <Text
                className="text-[13px] mt-0.5"
                style={{ color: colors.textFaint }}
              >
                ID: {params.patientId}
              </Text>
            ) : null}
          </View>
        </View>

        <View className="gap-2">
          <Text
            className="text-[17px] font-bold"
            style={{ color: colors.textHeading }}
          >
            Situation
          </Text>
          <TextInput
            className="rounded-xl px-4 py-3 text-[15px] min-h-[90px]"
            style={{
              backgroundColor: colors.white,
              color: colors.textPrimary,
              textAlignVertical: "top",
            }}
            multiline
            numberOfLines={3}
            placeholder="Problem: e.g. sudden drop in BP, patient restless..."
            placeholderTextColor="#9CA3AF"
            value={situation}
            onChangeText={setSituation}
          />
        </View>

        <View className="gap-2">
          <Text
            className="text-[17px] font-bold"
            style={{ color: colors.textHeading }}
          >
            Background
          </Text>
          <TextInput
            className="rounded-xl px-4 py-3 text-[15px] min-h-[90px]"
            style={{
              backgroundColor: colors.white,
              color: colors.textPrimary,
              textAlignVertical: "top",
            }}
            multiline
            numberOfLines={3}
            placeholder="Admission diagnosis, past history, recent procedures/labs..."
            placeholderTextColor="#9CA3AF"
            value={background}
            onChangeText={setBackground}
          />
        </View>

        <View className="flex-row justify-center gap-3">
          <TextInput
            className="w-[42%] h-[52px] rounded-xl text-center text-[15px]"
            style={{
              backgroundColor: colors.white,
              color: colors.textPrimary,
            }}
            placeholder="SpO2"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            value={spo2}
            onChangeText={setSpo2}
          />
          <TextInput
            className="w-[42%] h-[52px] rounded-xl text-center text-[15px]"
            style={{
              backgroundColor: colors.white,
              color: colors.textPrimary,
            }}
            placeholder="Temp (°F)"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            value={temp}
            onChangeText={setTemp}
          />
        </View>

        <View className="gap-2">
          <Text
            className="text-[17px] font-bold"
            style={{ color: colors.textHeading }}
          >
            Assessment
          </Text>
          <TextInput
            className="rounded-xl px-4 py-3 text-[15px] min-h-[90px]"
            style={{
              backgroundColor: colors.white,
              color: colors.textPrimary,
              textAlignVertical: "top",
            }}
            multiline
            numberOfLines={3}
            placeholder="Your assessment of the current problem..."
            placeholderTextColor="#9CA3AF"
            value={assessment}
            onChangeText={setAssessment}
          />
        </View>

        <View className="gap-2">
          <Text
            className="text-[17px] font-bold"
            style={{ color: colors.textHeading }}
          >
            Recommendation
          </Text>
          <TextInput
            className="rounded-xl px-4 py-3 text-[15px] min-h-[90px]"
            style={{
              backgroundColor: colors.white,
              color: colors.textPrimary,
              textAlignVertical: "top",
            }}
            multiline
            numberOfLines={3}
            placeholder="What needs to happen next..."
            placeholderTextColor="#9CA3AF"
            value={recommendation}
            onChangeText={setRecommendation}
          />
        </View>

        <View className="gap-2">
          <Text
            className="text-[17px] font-bold"
            style={{ color: colors.textHeading }}
          >
            Current IV Medications
          </Text>

          {medsLoading && (
            <ActivityIndicator size="small" color={colors.primary} />
          )}

          {!medsLoading && params.patientId && medications.length === 0 && (
            <Text className="text-[14px]" style={{ color: colors.textSecondary }}>
              No medications recorded yet.
            </Text>
          )}

          {medications.map((med) => (
            <View
              key={med.med_id}
              className="flex-row items-center rounded-xl px-4 py-3 gap-3"
              style={{ backgroundColor: colors.white }}
            >
              <View className="flex-1">
                <Text
                  className="text-[16px] font-semibold"
                  style={{ color: colors.textPrimary }}
                >
                  {med.med_name}
                </Text>
                <Text
                  className="text-[13px] mt-0.5"
                  style={{ color: colors.textSecondary }}
                >
                  {med.dose !== null ? `${med.dose} ${med.dose_unit ?? ""}` : ""}
                  {med.frequency ? ` · ${med.frequency}` : ""}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleRemoveMedication(med.med_id, med.med_name)}
                disabled={medsMutating}
                hitSlop={8}
              >
                <Ionicons name="trash-outline" size={22} color={colors.danger} />
              </TouchableOpacity>
            </View>
          ))}

          <View
            className="flex-row items-center rounded-xl h-[52px] px-4 mb-0.5"
            style={{ backgroundColor: colors.white }}
          >
            <TextInput
              className="flex-1 text-[15px]"
              style={{ color: colors.textPrimary }}
              placeholder="Name"
              placeholderTextColor="#9CA3AF"
              maxLength={255}
              value={medName}
              onChangeText={setMedName}
            />
            <View
              className="w-px h-[60%] mx-3"
              style={{ backgroundColor: colors.border }}
            />
            <TextInput
              className="flex-1 text-[15px]"
              style={{ color: colors.textPrimary }}
              placeholder="Dose"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={medDose}
              onChangeText={setMedDose}
            />
          </View>

          <View
            className="flex-row items-center rounded-xl h-[52px] px-4 mb-0.5"
            style={{ backgroundColor: colors.white }}
          >
            <TextInput
              className="flex-1 text-[15px]"
              style={{ color: colors.textPrimary }}
              placeholder="Unit (e.g. mg)"
              placeholderTextColor="#9CA3AF"
              maxLength={20}
              value={medUnit}
              onChangeText={setMedUnit}
            />
            <View
              className="w-px h-[60%] mx-3"
              style={{ backgroundColor: colors.border }}
            />
            <TextInput
              className="flex-1 text-[15px]"
              style={{ color: colors.textPrimary }}
              placeholder="Frequency"
              placeholderTextColor="#9CA3AF"
              maxLength={50}
              value={medFrequency}
              onChangeText={setMedFrequency}
            />
          </View>

          {medsError && (
            <View
              className="flex-row items-center gap-2 p-3.5 rounded-xl"
              style={{ backgroundColor: colors.white }}
            >
              <Ionicons name="alert-circle" size={18} color={colors.danger} />
              <Text className="text-[14px] flex-1" style={{ color: colors.danger }}>
                {medsError}
              </Text>
            </View>
          )}

          <TouchableOpacity
            className="flex-row items-center justify-center gap-2 h-[50px] rounded-xl mt-1"
            style={[
              { backgroundColor: colors.primary },
              medsMutating && { opacity: 0.6 },
            ]}
            onPress={handleAddMedication}
            disabled={medsMutating || !params.patientId}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={20} color={colors.white} />
            <Text
              className="text-[15px] font-semibold"
              style={{ color: colors.white }}
            >
              {medsMutating ? "Saving..." : "Add Medication"}
            </Text>
          </TouchableOpacity>
        </View>

        {displayError && (
          <View
            className="flex-row items-center gap-2 p-3.5 rounded-xl"
            style={{ backgroundColor: colors.white }}
          >
            <Ionicons name="alert-circle" size={18} color={colors.danger} />
            <Text className="text-[14px] flex-1" style={{ color: colors.danger }}>
              {displayError}
            </Text>
          </View>
        )}

        {isBusy && <ActivityIndicator size="small" color={colors.primary} />}

        <PrimaryButton
          label={isBusy ? "Submitting..." : "Submit Handover"}
          onPress={handleSubmit}
          disabled={isBusy}
          style={{ marginTop: 8 }}
        />
      </ScrollView>

      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          className="flex-1 justify-center items-center px-6"
          style={{ backgroundColor: colors.overlay }}
        >
          <View
            className="w-full rounded-2xl p-6 items-center gap-2"
            style={{ backgroundColor: colors.white }}
          >
            <Text
              className="text-[22px] font-bold text-center"
              style={{ color: colors.textPrimary }}
            >
              Handover Submitted
            </Text>
            <Text
              className="text-[15px] text-center leading-[22px] mb-5"
              style={{ color: colors.textSecondary }}
            >
              Report for {patientName} has been Successfully Recorded
            </Text>

            <View
              className="w-20 h-20 rounded-full items-center justify-center mb-5"
              style={{ backgroundColor: colors.successAlt }}
            >
              <Ionicons name="checkmark" size={48} color={colors.white} />
            </View>

            <PrimaryButton
              label={params.noteId ? "Continue to SOAP Notes" : "Dashboard"}
              onPress={handleContinue}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}