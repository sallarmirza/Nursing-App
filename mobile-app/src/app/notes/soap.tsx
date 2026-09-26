// app/notes/soap
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
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
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.backgroundAlt }}
      edges={["top", "left", "right"]}
    >
      <ScreenHeader title="Nursing Notes" />

      <ScrollView
        contentContainerClassName="p-6 gap-4 pb-10"
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

        <Text
          className="text-xl font-bold text-center my-1"
          style={{ color: colors.textHeading }}
        >
          SOAP Notes
        </Text>

        <View className="gap-2">
          <Text
            className="text-[17px] font-bold"
            style={{ color: colors.textHeading }}
          >
            Subjective
          </Text>
          <TextInput
            className="rounded-xl p-4 text-[15px] min-h-[90px] border"
            style={{
              backgroundColor: colors.white,
              color: colors.textPrimary,
              borderColor: colors.border,
              textAlignVertical: "top",
            }}
            multiline
            numberOfLines={3}
            value={subjective}
            onChangeText={setSubjective}
            placeholder="Patient reports abdominal pain and nausea..."
            placeholderTextColor="#9CA3AF"
            textAlignVertical="top"
          />
        </View>

        <View className="gap-2">
          <Text
            className="text-[17px] font-bold"
            style={{ color: colors.textHeading }}
          >
            Objective
          </Text>
          <TextInput
            className="rounded-xl p-4 text-[15px] min-h-[90px] border"
            style={{
              backgroundColor: colors.white,
              color: colors.textPrimary,
              borderColor: colors.border,
              textAlignVertical: "top",
            }}
            multiline
            numberOfLines={3}
            value={objective}
            onChangeText={setObjective}
            placeholder="BP, HR, RR, SpO2, physical examination findings..."
            placeholderTextColor="#9CA3AF"
            textAlignVertical="top"
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
            className="rounded-xl p-4 text-[15px] min-h-[90px] border"
            style={{
              backgroundColor: colors.white,
              color: colors.textPrimary,
              borderColor: colors.border,
              textAlignVertical: "top",
            }}
            multiline
            numberOfLines={3}
            value={assessment}
            onChangeText={setAssessment}
            placeholder="Nursing assessment of the patient's condition..."
            placeholderTextColor="#9CA3AF"
            textAlignVertical="top"
          />
        </View>

        <View className="gap-2">
          <Text
            className="text-[17px] font-bold"
            style={{ color: colors.textHeading }}
          >
            Plan
          </Text>
          <TextInput
            className="rounded-xl p-4 text-[15px] min-h-[90px] border"
            style={{
              backgroundColor: colors.white,
              color: colors.textPrimary,
              borderColor: colors.border,
              textAlignVertical: "top",
            }}
            multiline
            numberOfLines={3}
            value={plan}
            onChangeText={setPlan}
            placeholder="Continue monitoring, administer medication, reassess pain in 30 minutes..."
            placeholderTextColor="#9CA3AF"
            textAlignVertical="top"
          />
        </View>

        {error && (
          <Text className="text-[14px]" style={{ color: colors.dangerAlt }}>
            {error}
          </Text>
        )}

        <View className="gap-3 mt-4">
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