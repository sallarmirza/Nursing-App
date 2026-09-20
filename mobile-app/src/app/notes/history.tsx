// app/notes/history
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
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
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Bar */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="#000000" />
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>Notes History</Text>
            <Text style={styles.headerSubtitle}>
              {params.patientName || "Patient"}
            </Text>
          </View>

          <View style={styles.avatarBadge}>
            <Ionicons name="person" size={20} color="#A78BFA" />
          </View>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          {FILTER_OPTIONS.map((filter) => {
            const isActive = selectedFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                style={[styles.filterPill, isActive && styles.activeFilterPill]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterText,
                    isActive && styles.activeFilterText,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {!params.patientId && (
          <View style={styles.messageCard}>
            <Ionicons name="alert-circle" size={16} color="#EF4444" />
            <Text style={styles.errorText}>
              No patient selected. Open this screen from a patient record.
            </Text>
          </View>
        )}

        {error && (
          <View style={styles.messageCard}>
            <Ionicons name="alert-circle" size={16} color="#EF4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {isLoading && <ActivityIndicator size="small" color="#1D9BF0" />}

        {!isLoading && !error && params.patientId && visibleNotes.length === 0 && (
          <Text style={styles.emptyText}>
            No notes for {selectedFilter.toLowerCase()}.
          </Text>
        )}

        {/* History Cards List */}
        <View style={styles.listContainer}>
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
                style={styles.card}
                activeOpacity={0.8}
                onPress={() => toggleExpanded(note.note_id)}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.leftRow}>
                    <View style={styles.rowAvatar}>
                      <Ionicons name="document-text" size={16} color="#A78BFA" />
                    </View>
                    <View>
                      <Text style={styles.patientName}>
                        {note.patient_condition}
                      </Text>
                      <Text style={styles.patientSubtitle}>
                        {formatDateTime(note.notes_created_at)}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.badge,
                      isCompleted ? styles.badgeCompleted : styles.badgeDraft,
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        isCompleted
                          ? styles.badgeTextCompleted
                          : styles.badgeTextDraft,
                      ]}
                    >
                      {isCompleted ? "Completed" : "Draft"}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.subDetailsText}>
                    {note.conscious_level} | GCS {note.glasgow_coma_score}/15 |
                    Pain {note.pain_scale}/10
                  </Text>
                  <Text style={styles.viewLink}>
                    {isExpanded ? "Hide" : "View"}
                  </Text>
                </View>

                {isExpanded && (
                  <View style={styles.detailBox}>
                    <Text style={styles.detailLabel}>Interventions Performed</Text>
                    {interventionsDone.length > 0 ? (
                      interventionsDone.map((name) => (
                        <View key={name} style={styles.interventionRow}>
                          <Ionicons
                            name="checkmark-circle"
                            size={14}
                            color="#166534"
                          />
                          <Text style={styles.detailText}>{name}</Text>
                        </View>
                      ))
                    ) : (
                      <Text style={styles.detailText}>
                        No interventions recorded.
                      </Text>
                    )}

                    {latestSoap ? (
                      <>
                        <Text style={styles.detailVersion}>
                          SOAP v{latestSoap.version} (
                          {formatDateTime(latestSoap.created_at)})
                        </Text>
                        <Text style={styles.detailLabel}>Subjective</Text>
                        <Text style={styles.detailText}>
                          {latestSoap.subjective}
                        </Text>
                        <Text style={styles.detailLabel}>Objective</Text>
                        <Text style={styles.detailText}>
                          {latestSoap.objective}
                        </Text>
                        <Text style={styles.detailLabel}>Assessment</Text>
                        <Text style={styles.detailText}>
                          {latestSoap.assessment}
                        </Text>
                        <Text style={styles.detailLabel}>Plan</Text>
                        <Text style={styles.detailText}>{latestSoap.plan}</Text>
                      </>
                    ) : (
                      <Text style={styles.detailVersion}>
                        No SOAP note recorded for this assessment yet.
                      </Text>
                    )}

                    <TouchableOpacity
                      style={styles.addSoapButton}
                      onPress={() => handleAddSoap(note)}
                    >
                      <Text style={styles.addSoapText}>
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3EFEF",
  },
  container: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  backButton: {
    padding: 4,
  },
  titleContainer: {
    flex: 1,
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000000",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 1,
  },
  avatarBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
  },
  filterPill: {
    flex: 1,
    height: 32,
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  activeFilterPill: {
    backgroundColor: "#1D9BF0",
  },
  filterText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#374151",
  },
  activeFilterText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  messageCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    flex: 1,
  },
  emptyText: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 12,
  },
  listContainer: {
    gap: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  leftRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    flex: 1,
  },
  rowAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
  },
  patientName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
  },
  patientSubtitle: {
    fontSize: 12,
    color: "#6B7280",
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeDraft: {
    backgroundColor: "#E5E7EB",
  },
  badgeCompleted: {
    backgroundColor: "#DCFCE7",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  badgeTextDraft: {
    color: "#EF4444",
  },
  badgeTextCompleted: {
    color: "#166534",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 4,
  },
  subDetailsText: {
    fontSize: 11,
    color: "#6B7280",
    flex: 1,
  },
  viewLink: {
    fontSize: 11,
    fontWeight: "600",
    color: "#374151",
    marginLeft: 8,
  },
  detailBox: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 10,
    gap: 4,
  },
  interventionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailVersion: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 8,
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1F2937",
    marginTop: 4,
  },
  detailText: {
    fontSize: 12,
    color: "#374151",
    lineHeight: 17,
  },
  addSoapButton: {
    marginTop: 10,
    height: 36,
    borderRadius: 6,
    backgroundColor: "#1D9BF0",
    alignItems: "center",
    justifyContent: "center",
  },
  addSoapText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});