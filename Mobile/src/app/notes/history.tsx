// app/notes/history
// Shows nursing note history for a patient with time-range filters.
// Each card is expandable to reveal interventions and the latest SOAP note.
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
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
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { colors } from "../../theme/colors";
import useNotesHistory from "../../hooks/notes/useNotesHistory";
import { NursingNote } from "../../types/notes";

type Filter = "Today" | "Yesterday" | "Week" | "Month";

const FILTER_OPTIONS: Filter[] = ["Today", "Yesterday", "Week", "Month"];
const MS_PER_DAY = 86400000;

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

function matchesFilter(isoDate: string, filter: Filter): boolean {
  const created = new Date(isoDate);
  if (isNaN(created.getTime())) return false;

  const diffDays = Math.round(
    (startOfDay(new Date()).getTime() - startOfDay(created).getTime()) /
      MS_PER_DAY
  );

  switch (filter) {
    case "Today":
      return diffDays === 0;
    case "Yesterday":
      return diffDays === 1;
    case "Week":
      return diffDays <= 6;
    case "Month":
      return diffDays <= 29;
  }
}

function formatDateTime(isoDate: string): string {
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return "";
  const date = d.toLocaleDateString();
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return `${date} ${time}`;
}

function performedInterventions(note: NursingNote): string[] {
  return Object.entries(note.nursing_interventions ?? {})
    .filter(([, done]) => done)
    .map(([name]) => name);
}

export default function NotesHistoryScreen() {
  const params = useLocalSearchParams<{
    patientId?: string;
    patientName?: string;
  }>();

  const [selectedFilter, setSelectedFilter] = useState<Filter>("Today");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { notes, isLoading, error } = useNotesHistory(params.patientId);

  const visibleNotes = notes.filter((n) =>
    matchesFilter(n.notes_created_at, selectedFilter)
  );

  const toggleExpanded = (noteId: string) => {
    setExpandedId((prev) => (prev === noteId ? null : noteId));
  };

  const handleAddSoap = (note: NursingNote) => {
    router.push({
      pathname: "/notes/soap",
      params: {
        patientId: note.patient_id,
        patientName: params.patientName || "",
        noteId: note.note_id,
      },
    });
  };

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
        {/* Header — custom because it carries a patient-name subtitle */}
        <View className="flex-row items-center justify-between mt-1">
          <BackButton />

          <View className="flex-1 ml-2">
            <Text
              className="text-[18px] font-bold"
              style={{ color: colors.textPrimary }}
            >
              Notes History
            </Text>
            <Text
              className="text-xs mt-[1px]"
              style={{ color: colors.textSecondary }}
            >
              {params.patientName || "Patient"}
            </Text>
          </View>

          <PersonAvatar size={36} />
        </View>

        {/* Filter Pills */}
        <View className="flex-row gap-2">
          {FILTER_OPTIONS.map((filter) => {
            const isActive = selectedFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                className="flex-1 h-10 rounded-md items-center justify-center"
                style={{
                  backgroundColor: isActive ? colors.primary : colors.white,
                }}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text
                  className={`text-xs ${isActive ? "font-semibold" : "font-medium"}`}
                  style={{
                    color: isActive ? colors.white : colors.textHeading,
                  }}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
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

        {isLoading && (
          <ActivityIndicator size="small" color={colors.primary} />
        )}

        {!isLoading && !error && params.patientId && visibleNotes.length === 0 && (
          <Text
            className="text-[13px] text-center mt-3"
            style={{ color: colors.textSecondary }}
          >
            No notes for {selectedFilter.toLowerCase()}.
          </Text>
        )}

        {/* History Cards */}
        <View className="gap-3">
          {visibleNotes.map((note) => {
            const soapCount = note.soap_history?.length ?? 0;
            const isCompleted = soapCount > 0;
            const latestSoap = isCompleted
              ? note.soap_history[soapCount - 1]
              : null;
            const isExpanded = expandedId === note.note_id;
            const interventionsDone = performedInterventions(note);

            return (
              <TouchableOpacity
                key={note.note_id}
                className="rounded-xl p-3.5 gap-2.5"
                style={{ backgroundColor: colors.white }}
                activeOpacity={0.8}
                onPress={() => toggleExpanded(note.note_id)}
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-row gap-2.5 items-center flex-1">
                    <View
                      className="w-8 h-8 rounded-full items-center justify-center"
                      style={{ backgroundColor: colors.accentBg }}
                    >
                      <Ionicons
                        name="document-text"
                        size={16}
                        color={colors.accent}
                      />
                    </View>
                    <View>
                      <Text
                        className="text-[15px] font-bold"
                        style={{ color: colors.textHeading }}
                      >
                        {note.patient_condition}
                      </Text>
                      <Text
                        className="text-xs"
                        style={{ color: colors.textSecondary }}
                      >
                        {formatDateTime(note.notes_created_at)}
                      </Text>
                    </View>
                  </View>

                  <View
                    className="px-3 py-1 rounded"
                    style={{
                      backgroundColor: isCompleted
                        ? colors.successBg
                        : colors.badgeNeutralBg,
                    }}
                  >
                    <Text
                      className="text-[11px] font-semibold"
                      style={{
                        color: isCompleted ? colors.success : colors.dangerAlt,
                      }}
                    >
                      {isCompleted ? "Completed" : "Draft"}
                    </Text>
                  </View>
                </View>

                <View className="flex-row justify-between items-center pt-1">
                  <Text
                    className="text-[11px] flex-1"
                    style={{ color: colors.textSecondary }}
                  >
                    {note.conscious_level} | GCS {note.glasgow_coma_score}/15 |
                    Pain {note.pain_scale}/10
                  </Text>
                  <Text
                    className="text-[11px] font-semibold ml-2"
                    style={{ color: colors.textHeading }}
                  >
                    {isExpanded ? "Hide" : "View"}
                  </Text>
                </View>

                {isExpanded && (
                  <View
                    className="border-t pt-2.5 gap-1"
                    style={{ borderColor: colors.border }}
                  >
                    <Text
                      className="text-xs font-bold mt-1"
                      style={{ color: colors.textHeading }}
                    >
                      Interventions Performed
                    </Text>
                    {interventionsDone.length > 0 ? (
                      interventionsDone.map((name) => (
                        <View
                          key={name}
                          className="flex-row items-center gap-1.5"
                        >
                          <Ionicons
                            name="checkmark-circle"
                            size={14}
                            color={colors.success}
                          />
                          <Text
                            className="text-xs leading-[17px]"
                            style={{ color: colors.textPrimary }}
                          >
                            {name}
                          </Text>
                        </View>
                      ))
                    ) : (
                      <Text
                        className="text-xs leading-[17px]"
                        style={{ color: colors.textPrimary }}
                      >
                        No interventions recorded.
                      </Text>
                    )}

                    {latestSoap ? (
                      <>
                        <Text
                          className="text-[11px] font-semibold mt-2 mb-1"
                          style={{ color: colors.textSecondary }}
                        >
                          SOAP v{latestSoap.version} (
                          {formatDateTime(latestSoap.created_at)})
                        </Text>
                        {(
                          [
                            ["Subjective", latestSoap.subjective],
                            ["Objective", latestSoap.objective],
                            ["Assessment", latestSoap.assessment],
                            ["Plan", latestSoap.plan],
                          ] as const
                        ).map(([label, value]) => (
                          <View key={label}>
                            <Text
                              className="text-xs font-bold mt-1"
                              style={{ color: colors.textHeading }}
                            >
                              {label}
                            </Text>
                            <Text
                              className="text-xs leading-[17px]"
                              style={{ color: colors.textPrimary }}
                            >
                              {value}
                            </Text>
                          </View>
                        ))}
                      </>
                    ) : (
                      <Text
                        className="text-[11px] font-semibold mt-2 mb-1"
                        style={{ color: colors.textSecondary }}
                      >
                        No SOAP note recorded for this assessment yet.
                      </Text>
                    )}

                    <View className="mt-2.5">
                      <PrimaryButton
                        label={
                          isCompleted ? "Add New SOAP Version" : "Add SOAP Note"
                        }
                        onPress={() => handleAddSoap(note)}
                      />
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
