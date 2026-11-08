// app/calculations/drip-history
// Lists saved IV drip calculations for a patient, newest first.
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "../../components/common/BackButton";
import { PersonAvatar } from "../../components/common/PersonAvatar";
import { colors } from "../../theme/colors";
import useDripHistory from "../../hooks/calculations/useDripHistory";
import { DripRecord } from "../../types/calculations";

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return (
    d.toLocaleDateString() +
    " " +
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
}

function DripCard({ record }: { record: DripRecord }) {
  return (
    <View
      className="rounded-xl p-3.5 gap-2"
      style={{ backgroundColor: colors.white }}
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-row gap-2.5 items-center flex-1">
          <View
            className="w-8 h-8 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.accentBg }}
          >
            <Ionicons name="water" size={15} color={colors.accent} />
          </View>
          <View>
            <Text className="text-[15px] font-bold" style={{ color: colors.textHeading }}>
              IV Drip
            </Text>
            <Text className="text-xs" style={{ color: colors.textSecondary }}>
              {formatDateTime(record.created_at)}
            </Text>
          </View>
        </View>
        {record.drop_per_min !== null && (
          <View
            className="px-2.5 py-1 rounded"
            style={{ backgroundColor: colors.accentBg }}
          >
            <Text className="text-[12px] font-bold" style={{ color: colors.accent }}>
              {record.drop_per_min} gtt/min
            </Text>
          </View>
        )}
      </View>

      <View className="flex-row flex-wrap gap-x-4 gap-y-1 mt-0.5">
        <Text className="text-[12px]" style={{ color: colors.textPrimary }}>
          <Text style={{ color: colors.textSecondary }}>Volume: </Text>
          {record.total_volume_ml} mL
        </Text>
        <Text className="text-[12px]" style={{ color: colors.textPrimary }}>
          <Text style={{ color: colors.textSecondary }}>Duration: </Text>
          {record.time_duration_min} min
        </Text>
        {record.drop_factor !== null && (
          <Text className="text-[12px]" style={{ color: colors.textPrimary }}>
            <Text style={{ color: colors.textSecondary }}>Drop factor: </Text>
            {record.drop_factor} gtt/mL
          </Text>
        )}
      </View>
    </View>
  );
}

export default function DripHistoryScreen() {
  const params = useLocalSearchParams<{
    patientId?: string;
    patientName?: string;
  }>();

  const { drips, total, isLoading, error } = useDripHistory(params.patientId);

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
              Drip History
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

        {!isLoading && !error && params.patientId && drips.length === 0 && (
          <Text
            className="text-[13px] text-center mt-3"
            style={{ color: colors.textSecondary }}
          >
            No drip calculations recorded yet.
          </Text>
        )}

        {drips.length > 0 && (
          <Text className="text-[12px]" style={{ color: colors.textSecondary }}>
            {total} record{total !== 1 ? "s" : ""}
          </Text>
        )}

        <View className="gap-3">
          {drips.map((record) => (
            <DripCard key={record.drip_calc_id} record={record} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
