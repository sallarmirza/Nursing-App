// app/calculations/dosage-history
// Lists saved dosage calculations for a patient, newest first.
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "../../components/common/BackButton";
import { PersonAvatar } from "../../components/common/PersonAvatar";
import { colors } from "../../theme/colors";
import useDosageHistory from "../../hooks/calculations/useDosageHistory";
import { DosageRecord } from "../../types/calculations";

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return (
    d.toLocaleDateString() +
    " " +
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
}

function DosageCard({ record }: { record: DosageRecord }) {
  return (
    <View
      className="rounded-xl p-3.5 gap-2"
      style={{ backgroundColor: colors.white }}
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-row gap-2.5 items-center flex-1">
          <View
            className="w-8 h-8 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.accentBg }}
          >
            <Ionicons name="medical" size={15} color={colors.accent} />
          </View>
          <View className="flex-1">
            <Text
              className="text-[15px] font-bold"
              style={{ color: colors.textHeading }}
              numberOfLines={1}
            >
              {record.medication}
            </Text>
            <Text className="text-xs" style={{ color: colors.textSecondary }}>
              {formatDateTime(record.dosage_created_at)}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row flex-wrap gap-x-4 gap-y-1 mt-0.5">
        <Text className="text-[12px]" style={{ color: colors.textPrimary }}>
          <Text style={{ color: colors.textSecondary }}>Weight: </Text>
          {record.patient_weight} kg
        </Text>
        <Text className="text-[12px]" style={{ color: colors.textPrimary }}>
          <Text style={{ color: colors.textSecondary }}>Dose: </Text>
          {record.dose_per_kg} {record.dose_unit}/kg
        </Text>
        <Text className="text-[12px]" style={{ color: colors.textPrimary }}>
          <Text style={{ color: colors.textSecondary }}>Concentration: </Text>
          {record.concentration_value} {record.concentration_unit}
        </Text>
      </View>
    </View>
  );
}

export default function DosageHistoryScreen() {
  const params = useLocalSearchParams<{
    patientId?: string;
    patientName?: string;
  }>();

  const { dosages, total, isLoading, error } = useDosageHistory(params.patientId);

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.backgroundAlt }}
      edges={["top", "left", "right"]}
    >
      <ScrollView
        contentContainerClassName="p-4 gap-4 pb-10"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between mt-1">
          <BackButton />
          <View className="flex-1 ml-2">
            <Text className="text-[18px] font-bold" style={{ color: colors.textPrimary }}>
              Dosage History
            </Text>
            <Text className="text-xs mt-[1px]" style={{ color: colors.textSecondary }}>
              {params.patientName || "Patient"}
            </Text>
          </View>
          <PersonAvatar size={36} />
        </View>

        {!params.patientId && (
          <View
            className="flex-row items-center gap-1.5 p-3 rounded-lg"
            style={{ backgroundColor: colors.white }}
          >
            <Ionicons name="alert-circle" size={16} color={colors.dangerAlt} />
            <Text className="text-xs flex-1" style={{ color: colors.dangerAlt }}>
              No patient selected. Open this screen from a patient record.
            </Text>
          </View>
        )}

        {error && (
          <View
            className="flex-row items-center gap-1.5 p-3 rounded-lg"
            style={{ backgroundColor: colors.white }}
          >
            <Ionicons name="alert-circle" size={16} color={colors.dangerAlt} />
            <Text className="text-xs flex-1" style={{ color: colors.dangerAlt }}>
              {error}
            </Text>
          </View>
        )}

        {isLoading && <ActivityIndicator size="small" color={colors.primary} />}

        {!isLoading && !error && params.patientId && dosages.length === 0 && (
          <Text
            className="text-[13px] text-center mt-3"
            style={{ color: colors.textSecondary }}
          >
            No dosage calculations recorded yet.
          </Text>
        )}

        {dosages.length > 0 && (
          <Text className="text-[12px]" style={{ color: colors.textSecondary }}>
            {total} record{total !== 1 ? "s" : ""}
          </Text>
        )}

        <View className="gap-3">
          {dosages.map((record) => (
            <DosageCard key={record.dose_calc_id} record={record} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
