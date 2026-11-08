// app/vitals/history
// Lists recorded vitals for a patient, newest first.
// Each card shows source, timestamp, and all recorded vital values.
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "../../components/common/BackButton";
import { PersonAvatar } from "../../components/common/PersonAvatar";
import { colors } from "../../theme/colors";
import useVitalsHistory from "../../hooks/vitals/useVitalsHistory";
import { VitalsEntry } from "../../types/vital";

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return (
    d.toLocaleDateString() +
    " " +
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
}

function VitalsCard({ entry }: { entry: VitalsEntry }) {
  const values = Object.entries(entry.vitals_data).filter(([, v]) => v !== null);
  return (
    <View
      className="rounded-xl p-3.5 gap-2"
      style={{ backgroundColor: colors.white }}
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center gap-2">
          <View
            className="w-7 h-7 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.accentBg }}
          >
            <Ionicons name="pulse" size={14} color={colors.accent} />
          </View>
          <Text className="text-[13px] font-semibold" style={{ color: colors.textHeading }}>
            {entry.source}
          </Text>
        </View>
        <Text className="text-[11px]" style={{ color: colors.textSecondary }}>
          {formatDateTime(entry.recorded_at)}
        </Text>
      </View>

      {values.length > 0 ? (
        <View className="flex-row flex-wrap gap-x-4 gap-y-1 mt-1">
          {values.map(([key, val]) => (
            <Text key={key} className="text-[12px]" style={{ color: colors.textPrimary }}>
              <Text style={{ color: colors.textSecondary }}>{key}: </Text>
              {String(val)}
            </Text>
          ))}
        </View>
      ) : (
        <Text className="text-[12px]" style={{ color: colors.textSecondary }}>
          No values recorded.
        </Text>
      )}
    </View>
  );
}

export default function VitalsHistoryScreen() {
  const params = useLocalSearchParams<{
    patientId?: string;
    patientName?: string;
  }>();

  const { vitals, total, isLoading, error } = useVitalsHistory(params.patientId);

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
              Vitals History
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

        {!isLoading && !error && params.patientId && vitals.length === 0 && (
          <Text
            className="text-[13px] text-center mt-3"
            style={{ color: colors.textSecondary }}
          >
            No vitals recorded yet.
          </Text>
        )}

        {vitals.length > 0 && (
          <Text className="text-[12px]" style={{ color: colors.textSecondary }}>
            {total} record{total !== 1 ? "s" : ""}
          </Text>
        )}

        <View className="gap-3">
          {vitals.map((entry) => (
            <VitalsCard key={entry.vital_id} entry={entry} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
