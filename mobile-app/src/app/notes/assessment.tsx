// app/notes/assessment
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { router, useLocalSearchParams } from "expo-router";
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
import { PersonAvatar } from "../../components/common/PersonAvatar";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { ScreenHeader } from "../../components/common/ScreenHeader";
import { colors } from "../../theme/colors";
import useCreateNote from "../../hooks/notes/useCreateNote";
import useRecordVitals from "../../hooks/vitals/useRecordVitals";

export default function NursingAssessmentScreen() {
  const params = useLocalSearchParams<{
    patientId?: string;
    patientName?: string;
  }>();

  const [condition, setCondition] = useState<string>("Stable");
  const [consciousness, setConsciousness] =
    useState<string>("Responds to Voice");
  const [gcs, setGcs] = useState<string>("");
  const [painScale, setPainScale] = useState<number>(4);
  const [formError, setFormError] = useState<string | null>(null);

  const [bp, setBp] = useState("");
  const [hr, setHr] = useState("");
  const [rr, setRr] = useState("");
  const [spO2, setSpO2] = useState("");
  const [temp, setTemp] = useState("");

  const [interventions, setInterventions] = useState<{
    [key: string]: boolean;
  }>({
    "Medication Administered": true,
    "IV Fluids": true,
    "Oxygen Therapy": false,
    "Wound Dressing": false,
    "Catheter Care": false,
    "Patient Education": true,
    "Position Changed": true,
    "Blood Sample Collected": false,
  });

  const { createNote, isLoading: noteLoading, error: noteError } =
    useCreateNote();
  const {
    recordVitals,
    isLoading: vitalsLoading,
    error: vitalsError,
  } = useRecordVitals();

  const isBusy = noteLoading || vitalsLoading;
  const displayError = formError || vitalsError || noteError;

  const conditionOptions = [
    "Stable",
    "Improving",
    "Under Observation",
    "Critical",
  ];
  const consciousnessOptions = [
    "Alert",
    "Responds to Voice",
    "Responds to Pain",
    "Unresponsive",
  ];

  const toggleIntervention = (key: string) => {
    setInterventions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleProceed = async () => {
    setFormError(null);

    if (!params.patientId) {
      setFormError("No patient selected. Open this screen from a patient record.");
      return;
    }

    const gcsNum = parseInt(gcs, 10);
    if (!gcsNum || gcsNum < 3 || gcsNum > 15) {
      setFormError("GCS must be a number between 3 and 15");
      return;
    }

    const vitalsSaved = await recordVitals(params.patientId, "Nursing Notes", {
      bp,
      hr,
      rr,
      spO2,
      temp,
    });
    if (!vitalsSaved) return;

    const noteId = await createNote(params.patientId, {
      patient_condition: condition,
      conscious_level: consciousness,
      glasgow_coma_score: gcsNum,
      pain_scale: Math.round(painScale),
      nursing_interventions: interventions,
    });

    if (noteId) {
      router.push({
        pathname: "/notes/sbar",
        params: {
          patientId: params.patientId,
          patientName: params.patientName || "",
          noteId,
        },
      });
    }
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.backgroundAlt }}
      edges={["top", "left", "right"]}
    >
      <ScreenHeader title="Nursing Notes" />

      <ScrollView
        contentContainerClassName="p-6 gap-5 pb-10"
        showsVerticalScrollIndicator={false}
      >
        <View
          className="rounded-xl p-4 flex-row items-center gap-3"
          style={{ backgroundColor: colors.white }}
        >
          <PersonAvatar size={44} />
          <View className="flex-1">
            <Text
              className="text-[17px] font-bold"
              style={{ color: colors.textHeading }}
            >
              {params.patientName || "Patient"}
            </Text>
            <Text
              className="text-[13px] mt-0.5"
              style={{ color: colors.textSecondary }}
            >
              ID: {params.patientId}
            </Text>
          </View>
        </View>

        <View className="gap-2">
          <Text
            className="text-[17px] font-bold"
            style={{ color: colors.textHeading }}
          >
            Patient Condition
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {conditionOptions.map((item) => {
              const isActive = condition === item;
              return (
                <TouchableOpacity
                  key={item}
                  className="w-[48.5%] h-[52px] rounded-xl items-center justify-center px-2"
                  style={{
                    backgroundColor: isActive ? colors.primary : colors.white,
                  }}
                  onPress={() => setCondition(item)}
                >
                  <Text
                    className={`text-[15px] text-center ${
                      isActive ? "font-semibold" : "font-medium"
                    }`}
                    style={{
                      color: isActive ? colors.white : colors.textSecondary,
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View className="gap-2">
          <Text
            className="text-[17px] font-bold"
            style={{ color: colors.textHeading }}
          >
            Level of Consciousness
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {consciousnessOptions.map((item) => {
              const isActive = consciousness === item;
              return (
                <TouchableOpacity
                  key={item}
                  className="w-[48.5%] h-[52px] rounded-xl items-center justify-center px-2"
                  style={{
                    backgroundColor: isActive ? colors.primary : colors.white,
                  }}
                  onPress={() => setConsciousness(item)}
                >
                  <Text
                    className={`text-[15px] text-center ${
                      isActive ? "font-semibold" : "font-medium"
                    }`}
                    style={{
                      color: isActive ? colors.white : colors.textSecondary,
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View className="gap-2">
          <Text
            className="text-[17px] font-bold"
            style={{ color: colors.textHeading }}
          >
            GCS
          </Text>
          <View
            className="flex-row items-center rounded-xl w-[150px] h-[52px] px-4 justify-center"
            style={{ backgroundColor: colors.white }}
          >
            <TextInput
              className="text-[16px] text-center w-[36px]"
              style={{ color: colors.textHeading }}
              placeholder="--"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              maxLength={2}
              value={gcs}
              onChangeText={setGcs}
            />
            <Text
              className="text-[16px] font-semibold ml-2"
              style={{ color: colors.textHeading }}
            >
              / 15
            </Text>
          </View>
        </View>

        <View className="gap-2">
          <Text
            className="text-[17px] font-bold"
            style={{ color: colors.textHeading }}
          >
            Pain Scale
          </Text>
          <View className="gap-1">
            <View className="flex-row justify-between px-1">
              <Text
                className="text-[13px] font-semibold"
                style={{ color: colors.textSecondary }}
              >
                0
              </Text>
              <Text
                className="text-[15px] font-bold"
                style={{ color: colors.textHeading }}
              >
                {Math.round(painScale)}
              </Text>
              <Text
                className="text-[13px] font-semibold"
                style={{ color: colors.textSecondary }}
              >
                10
              </Text>
            </View>
            <Slider
              style={{ width: "100%", height: 40 }}
              minimumValue={0}
              maximumValue={10}
              step={1}
              value={painScale}
              onValueChange={setPainScale}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor="#CBD5E1"
              thumbTintColor={colors.primary}
            />
          </View>
        </View>

        <View className="gap-2">
          <Text
            className="text-[17px] font-bold"
            style={{ color: colors.textHeading }}
          >
            Vitals
          </Text>
          <View className="flex-row gap-2">
            <TextInput
              className="flex-1 h-[52px] rounded-xl text-center text-[15px]"
              style={{ backgroundColor: colors.white, color: colors.textPrimary }}
              placeholder="BP (120/80)"
              placeholderTextColor="#9CA3AF"
              value={bp}
              onChangeText={setBp}
            />
            <TextInput
              className="flex-1 h-[52px] rounded-xl text-center text-[15px]"
              style={{ backgroundColor: colors.white, color: colors.textPrimary }}
              placeholder="HR"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={hr}
              onChangeText={setHr}
            />
            <TextInput
              className="flex-1 h-[52px] rounded-xl text-center text-[15px]"
              style={{ backgroundColor: colors.white, color: colors.textPrimary }}
              placeholder="RR"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={rr}
              onChangeText={setRr}
            />
          </View>
          <View className="flex-row gap-2 justify-center mt-2">
            <TextInput
              className="w-[48.5%] h-[52px] rounded-xl text-center text-[15px]"
              style={{ backgroundColor: colors.white, color: colors.textPrimary }}
              placeholder="SpO2"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={spO2}
              onChangeText={setSpO2}
            />
            <TextInput
              className="w-[48.5%] h-[52px] rounded-xl text-center text-[15px]"
              style={{ backgroundColor: colors.white, color: colors.textPrimary }}
              placeholder="Temp (°F)"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={temp}
              onChangeText={setTemp}
            />
          </View>
        </View>

        <View className="gap-2">
          <Text
            className="text-[17px] font-bold"
            style={{ color: colors.textHeading }}
          >
            Nursing Interventions
          </Text>
          <View className="gap-3 mt-1">
            {Object.entries(interventions).map(([key, checked]) => (
              <TouchableOpacity
                key={key}
                className="flex-row items-center gap-3"
                onPress={() => toggleIntervention(key)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={checked ? "checkbox" : "square-outline"}
                  size={24}
                  color={checked ? colors.textPrimary : colors.textSecondary}
                />
                <Text
                  className="text-[15px] font-medium"
                  style={{ color: colors.textHeading }}
                >
                  {key}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {displayError && (
          <Text className="text-[14px]" style={{ color: colors.dangerAlt }}>
            {displayError}
          </Text>
        )}

        <PrimaryButton
          label={isBusy ? "Saving..." : "Proceed to Notes"}
          onPress={handleProceed}
          disabled={isBusy}
          style={{ marginTop: 12 }}
        />
        {isBusy && <ActivityIndicator size="small" color={colors.primary} />}
      </ScrollView>
    </SafeAreaView>
  );
}