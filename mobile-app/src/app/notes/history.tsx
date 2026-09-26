// app/notes/history
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

// Names of the interventions ticked on this note (empty for older notes)
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
    <SafeAreaView className="flex-1 bg-[#F3EFEF]" edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerClassName="p-4 gap-4 pb-10"
        showsVerticalScrollIndicator={false}
      >
        {/* Top Bar */}
        <View className="flex-row items-center justify-between mt-1">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-1"
          >
            <Ionicons name="chevron-back" size={24} color="#000000" />
          </TouchableOpacity>

          <View className="flex-1 ml-2">
            <Text className="text-[18px] font-bold text-black">
              Notes History
            </Text>
            <Text className="text-xs text-[#6B7280] mt-[1px]">
              {params.patientName || "Patient"}
            </Text>
          </View>

          <View className="w-9 h-9 rounded-full bg-[#EDE9FE] items-center justify-center">
            <Ionicons name="person" size={20} color="#A78BFA" />
          </View>
        </View>

        {/* Filter Pills */}
        <View className="flex-row gap-2">
          {FILTER_OPTIONS.map((filter) => {
            const isActive = selectedFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                className={`flex-1 h-8 rounded-md items-center justify-center ${
                  isActive ? "bg-[#1D9BF0]" : "bg-white"
                }`}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text
                  className={`text-xs ${
                    isActive
                      ? "text-white font-semibold"
                      : "text-[#374151] font-medium"
                  }`}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {!params.patientId && (
          <View className="flex-row items-center gap-1.5 p-3 bg-white rounded-lg">
            <Ionicons name="alert-circle" size={16} color="#EF4444" />
            <Text className="text-xs text-[#EF4444] flex-1">
              No patient selected. Open this screen from a patient record.
            </Text>
          </View>
        )}

        {error && (
          <View className="flex-row items-center gap-1.5 p-3 bg-white rounded-lg">
            <Ionicons name="alert-circle" size={16} color="#EF4444" />
            <Text className="text-xs text-[#EF4444] flex-1">{error}</Text>
          </View>
        )}

        {isLoading && <ActivityIndicator size="small" color="#1D9BF0" />}

        {!isLoading && !error && params.patientId && visibleNotes.length === 0 && (
          <Text className="text-[13px] text-[#6B7280] text-center mt-3">
            No notes for {selectedFilter.toLowerCase()}.
          </Text>
        )}

        {/* History Cards List */}
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
                className="bg-white rounded-xl p-3.5 gap-2.5"
                activeOpacity={0.8}
                onPress={() => toggleExpanded(note.note_id)}
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-row gap-2.5 items-center flex-1">
                    <View className="w-8 h-8 rounded-full bg-[#EDE9FE] items-center justify-center">
                      <Ionicons name="document-text" size={16} color="#A78BFA" />
                    </View>
                    <View>
                      <Text className="text-[15px] font-bold text-[#1F2937]">
                        {note.patient_condition}
                      </Text>
                      <Text className="text-xs text-[#6B7280]">
                        {formatDateTime(note.notes_created_at)}
                      </Text>
                    </View>
                  </View>

                  <View
                    className={`px-3 py-1 rounded ${
                      isCompleted ? "bg-[#DCFCE7]" : "bg-[#E5E7EB]"
                    }`}
                  >
                    <Text
                      className={`text-[11px] font-semibold ${
                        isCompleted ? "text-[#166534]" : "text-[#EF4444]"
                      }`}
                    >
                      {isCompleted ? "Completed" : "Draft"}
                    </Text>
                  </View>
                </View>

                <View className="flex-row justify-between items-center pt-1">
                  <Text className="text-[11px] text-[#6B7280] flex-1">
                    {note.conscious_level} | GCS {note.glasgow_coma_score}/15 |
                    Pain {note.pain_scale}/10
                  </Text>
                  <Text className="text-[11px] font-semibold text-[#374151] ml-2">
                    {isExpanded ? "Hide" : "View"}
                  </Text>
                </View>

                {isExpanded && (
                  <View className="border-t border-[#E5E7EB] pt-2.5 gap-1">
                    <Text className="text-xs font-bold text-[#1F2937] mt-1">
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
                            color="#166534"
                          />
                          <Text className="text-xs text-[#374151] leading-[17px]">
                            {name}
                          </Text>
                        </View>
                      ))
                    ) : (
                      <Text className="text-xs text-[#374151] leading-[17px]">
                        No interventions recorded.
                      </Text>
                    )}

                    {latestSoap ? (
                      <>
                        <Text className="text-[11px] font-semibold text-[#6B7280] mt-2 mb-1">
                          SOAP v{latestSoap.version} (
                          {formatDateTime(latestSoap.created_at)})
                        </Text>
                        <Text className="text-xs font-bold text-[#1F2937] mt-1">
                          Subjective
                        </Text>
                        <Text className="text-xs text-[#374151] leading-[17px]">
                          {latestSoap.subjective}
                        </Text>
                        <Text className="text-xs font-bold text-[#1F2937] mt-1">
                          Objective
                        </Text>
                        <Text className="text-xs text-[#374151] leading-[17px]">
                          {latestSoap.objective}
                        </Text>
                        <Text className="text-xs font-bold text-[#1F2937] mt-1">
                          Assessment
                        </Text>
                        <Text className="text-xs text-[#374151] leading-[17px]">
                          {latestSoap.assessment}
                        </Text>
                        <Text className="text-xs font-bold text-[#1F2937] mt-1">
                          Plan
                        </Text>
                        <Text className="text-xs text-[#374151] leading-[17px]">
                          {latestSoap.plan}
                        </Text>
                      </>
                    ) : (
                      <Text className="text-[11px] font-semibold text-[#6B7280] mt-2 mb-1">
                        No SOAP note recorded for this assessment yet.
                      </Text>
                    )}

                    <TouchableOpacity
                      className="mt-2.5 h-9 rounded-md bg-[#1D9BF0] items-center justify-center"
                      onPress={() => handleAddSoap(note)}
                    >
                      <Text className="text-xs font-semibold text-white">
                        {isCompleted ? "Add New SOAP Version" : "Add SOAP Note"}
                      </Text>
                    </TouchableOpacity>
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