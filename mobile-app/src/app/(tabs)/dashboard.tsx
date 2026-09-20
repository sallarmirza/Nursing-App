// app/(tabs)/dashboard
import { router } from "expo-router";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PersonAvatar } from "../../components/common/PersonAvatar";
import { ToolCard } from "../../components/common/ToolCard";
import useDashboard from "../../hooks/useDashboard";
import { colors } from "../../theme/colors";
import { VitalsStatus } from "../../types/dashboard";

const TOOLS = [
  {
    id: "1",
    title: "Dosage Calculator",
    subtitle: "Safe Med calculation & alerts",
    href: "/calculations/dosage",
  },
  {
    id: "2",
    title: "IV Drip Rate",
    subtitle: "Drops/min calculator",
    href: "/calculations/drip",
  },
  {
    id: "3",
    title: "Patient Records",
    subtitle: "View & Edit patient history",
    href: "/(tabs)/patients",
  },
  {
    id: "4",
    title: "Nursing Notes",
    subtitle: "Daily Digital Observations",
    href: "/(tabs)/notes",
  },
] as const;

// Assumed shift boundaries: 06-14 morning, 14-22 evening, otherwise night
function getShiftLabel(now: Date): string {
  const hour = now.getHours();
  if (hour >= 6 && hour < 14) return "Morning Shift";
  if (hour >= 14 && hour < 22) return "Evening Shift";
  return "Night Shift";
}

function formatDate(now: Date): string {
  return now.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getStatusLabel(status: VitalsStatus): string {
  switch (status) {
    case "updated":
      return "Vitals Updated";
    case "overdue":
      return "Vitals Overdue";
    case "none":
      return "No Vitals Yet";
  }
}

function getStatusColor(status: VitalsStatus): string {
  switch (status) {
    case "updated":
      return colors.textMuted;
    case "overdue":
      return colors.dangerAlt;
    case "none":
      return colors.warning;
  }
}

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { data, isLoading, isRefreshing, error, refresh } = useDashboard();

  const now = new Date();
  const patients = data?.patients ?? [];
  const greeting = data?.nurse_name ? `Welcome ${data.nurse_name}!` : "Welcome!";

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingBottom: insets.bottom + 80 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.shiftText}>
              {getShiftLabel(now)}, {formatDate(now)}
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
            <PersonAvatar size={40} />
          </TouchableOpacity>
        </View>

        <View style={styles.toolsList}>
          {TOOLS.map((tool) => (
            <ToolCard
              key={tool.id}
              title={tool.title}
              subtitle={tool.subtitle}
              onPress={() => router.push(tool.href as any)}
            />
          ))}
        </View>

        <View style={styles.patientsHeader}>
          <Text style={styles.sectionTitle}>Recent Patients</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/patients")}>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={refresh}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {isLoading && <ActivityIndicator size="small" color={colors.textMuted} />}

        {!isLoading && !error && patients.length === 0 && (
          <Text style={styles.emptyText}>No patients assigned yet.</Text>
        )}

        {patients.length > 0 && (
          <View style={styles.patientsCard}>
            {patients.map((patient, index) => (
              <TouchableOpacity
                key={patient.patient_id}
                style={[
                  styles.patientRow,
                  index < patients.length - 1 && styles.patientRowBorder,
                ]}
                onPress={() =>
                  router.push({
                    pathname: "/patients/[id]" as any,
                    params: { id: patient.patient_id },
                  })
                }
              >
                <View style={styles.patientInfo}>
                  <PersonAvatar size={32} />
                  <Text style={styles.patientName} numberOfLines={1}>
                    {patient.patient_name}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(patient.vitals_status) },
                  ]}
                >
                  {getStatusLabel(patient.vitals_status)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  shiftText: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 2,
  },
  toolsList: {
    gap: 12,
    marginBottom: 28,
  },
  patientsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  errorCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    padding: 12,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 12,
    color: colors.dangerAlt,
    flex: 1,
  },
  retryText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 8,
  },
  patientsCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  patientRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  patientRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  patientInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  patientName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textHeading,
    flexShrink: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 8,
  },
});