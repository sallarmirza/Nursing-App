// app/sbar/history
// Lists past SBAR handover records for a patient, newest first.
// Each card is expandable to reveal all four SBAR fields and IV medications.
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "../../components/common/BackButton";
import { PersonAvatar } from "../../components/common/PersonAvatar";
import { colors } from "../../theme/colors";
import useSbarHistory from "../../hooks/notes/useSbarHistory";
import { SbarRecord } from "../../types/sbar";

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return (
    d.toLocaleDateString() +
    " " +
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
}

function SbarCard({ record }: { record: SbarRecord }) {
  const [expanded, setExpanded] = useState(false);

  const sections: [string, string | null][] = [
    ["Situation", record.situation],
    ["Background", record.background],
    ["Assessment", record.assessment],
    ["Recommendation", record.recommendation],
  ];

  const filledCount = sections.filter(([, v]) => v).length;

  return (
    <TouchableOpacity
      className="rounded-xl p-3.5 gap-2.5"
      style={{ backgroundColor: colors.white }}
      activeOpacity={0.8}
      onPress={() => setExpanded((p) => !p)}
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-row gap-2.5 items-center flex-1">
          <View
            className="w-8 h-8 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.accentBg }}
          >
            <Ionicons name="swap-horizontal" size={16} color={colors.accent} />
          </View>
          <View>
            <Text className="text-[15px] font-bold" style={{ color: colors.textHeading }}>
              SBAR Handover
            </Text>
            <Text className="text-xs" style={{ color: colors.textSecondary }}>
              {formatDateTime(record.sbar_created_at)}
            </Text>
          </View>
        </View>
        <View
          className="px-2 py-1 rounded"
          style={{ backgroundColor: colors.accentBg }}
        >
          <Text className="text-[11px] font-semibold" style={{ color: colors.accent }}>
            {filledCount}/4
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center pt-0.5">
        <Text className="text-[11px] flex-1" style={{ color: colors.textSecondary }}>
          {sections
            .filter(([, v]) => v)
            .map(([label]) => label)
            .join(" · ") || "No sections filled"}
        </Text>
        <Text className="text-[11px] font-semibold ml-2" style={{ color: colors.textHeading }}>
          {expanded ? "Hide" : "View"}
        </Text>
      </View>

      {expanded && (
        <View
          className="border-t pt-2.5 gap-2"
          style={{ borderColor: colors.border }}
        >
          {sections.map(([label, value]) => (
            <View key={label}>
              <Text className="text-xs font-bold" style={{ color: colors.textHeading }}>
                {label}
              </Text>
              <Text className="text-xs leading-[17px]" style={{ color: colors.textPrimary }}>
                {value || "—"}
              </Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function SbarHistoryScreen() {
  const params = useLocalSearchParams<{
    patientId?: string;
    patientName?: string;
  }>();

  const { handovers, total, isLoading, error } = useSbarHistory(params.patientId);

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
              SBAR History
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

        {!isLoading && !error && params.patientId && handovers.length === 0 && (
          <Text
            className="text-[13px] text-center mt-3"
            style={{ color: colors.textSecondary }}
          >
            No SBAR handovers recorded yet.
          </Text>
        )}

        {handovers.length > 0 && (
          <Text className="text-[12px]" style={{ color: colors.textSecondary }}>
            {total} record{total !== 1 ? "s" : ""}
          </Text>
        )}

        <View className="gap-3">
          {handovers.map((record) => (
            <SbarCard key={record.sbar_id} record={record} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
