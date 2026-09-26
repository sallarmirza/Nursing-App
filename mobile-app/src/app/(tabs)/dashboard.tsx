// app/(tabs)/dashboard
import { router } from "expo-router";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
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
    <View 
      className="flex-1" 
      style={{ backgroundColor: colors.background, paddingTop: insets.top }}
    >
      <ScrollView
        contentContainerClassName="px-5 pt-4"
        style={{ paddingBottom: insets.bottom + 80 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
        }
      >
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-[22px] font-bold" style={{ color: colors.textPrimary }}>
              {greeting}
            </Text>
            <Text className="text-sm mt-0.5" style={{ color: colors.textMuted }}>
              {getShiftLabel(now)}, {formatDate(now)}
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
            <PersonAvatar size={40} />
          </TouchableOpacity>
        </View>

        <View className="gap-3 mb-7">
          {TOOLS.map((tool) => (
            <ToolCard
              key={tool.id}
              title={tool.title}
              subtitle={tool.subtitle}
              onPress={() => router.push(tool.href as any)}
            />
          ))}
        </View>

        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-[15px] font-semibold" style={{ color: colors.textSecondary }}>
            Recent Patients
          </Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/patients")}>
            <Text className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
              See all
            </Text>
          </TouchableOpacity>
        </View>

        {error && (
          <View 
            className="flex-row items-center justify-between gap-2 p-3 rounded-xl mb-3" 
            style={{ backgroundColor: colors.white }}
          >
            <Text className="text-xs flex-1" style={{ color: colors.dangerAlt }}>
              {error}
            </Text>
            <TouchableOpacity onPress={refresh}>
              <Text className="text-xs font-semibold" style={{ color: colors.textPrimary }}>
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {isLoading && <ActivityIndicator size="small" color={colors.textMuted} />}

        {!isLoading && !error && patients.length === 0 && (
          <Text className="text-[13px] text-center mt-2" style={{ color: colors.textMuted }}>
            No patients assigned yet.
          </Text>
        )}

        {patients.length > 0 && (
          <View className="rounded-2xl px-4 py-2" style={{ backgroundColor: colors.white }}>
            {patients.map((patient, index) => (
              <TouchableOpacity
                key={patient.patient_id}
                className={`flex-row items-center justify-between py-3 ${
                  index < patients.length - 1 ? "border-b" : ""
                }`}
                style={
                  index < patients.length - 1
                    ? { borderBottomColor: colors.border }
                    : undefined
                }
                onPress={() =>
                  router.push({
                    pathname: "/patients/[id]" as any,
                    params: { id: patient.patient_id },
                  })
                }
              >
                <View className="flex-row items-center gap-3 flex-1">
                  <PersonAvatar size={32} />
                  <Text 
                    className="text-sm font-semibold flex-shrink-1" 
                    style={{ color: colors.textHeading }}
                    numberOfLines={1}
                  >
                    {patient.patient_name}
                  </Text>
                </View>
                <Text
                  className="text-xs font-medium ml-2"
                  style={{ color: getStatusColor(patient.vitals_status) }}
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

