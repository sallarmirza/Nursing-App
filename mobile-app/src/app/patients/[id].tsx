// app/patients/[id]
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PersonAvatar } from "../../components/common/PersonAvatar";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { ScreenHeader } from "../../components/common/ScreenHeader";
import { StatusBadge } from "../../components/common/StatusBadge";
import { colors } from "../../theme/colors";

export default function PatientProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScreenHeader
        title="Patient Profile"
        showBack={true}
        rightElement={
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="create-outline" size={22} color={colors.primary} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Info Card */}
        <View style={styles.profileCard}>
          <PersonAvatar size={64} />
          <Text style={styles.patientName}>Maria Khan</Text>
          <Text style={styles.patientMeta}>
            35 years, Female | ID: {id || "123XYZ"}
          </Text>
          <View style={styles.badgeWrapper}>
            <StatusBadge label="Stable" tone="success" />
          </View>
        </View>

        {/* Quick Vitals Overview */}
        <View style={styles.infoGrid}>
          <View style={styles.infoTile}>
            <Text style={styles.infoTileLabel}>Weight</Text>
            <Text style={styles.infoTileValue}>65 kg</Text>
          </View>
          <View style={styles.infoTile}>
            <Text style={styles.infoTileLabel}>Height</Text>
            <Text style={styles.infoTileValue}>165 cm</Text>
          </View>
          <View style={styles.infoTile}>
            <Text style={styles.infoTileLabel}>Blood Type</Text>
            <Text style={styles.infoTileValue}>O+</Text>
          </View>
        </View>

        {/* Clinical History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medical Overview</Text>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Primary Diagnosis</Text>
              <Text style={styles.detailValue}>Acute Gastroenteritis</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Attending Doctor</Text>
              <Text style={styles.detailValue}>Dr. Sarah Ahmed</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Admission Date</Text>
              <Text style={styles.detailValue}>Jul 14, 2026</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Known Allergies</Text>
              <Text style={[styles.detailValue, { color: colors.dangerAlt }]}>
                Penicillin
              </Text>
            </View>
          </View>
        </View>

        {/* Primary Action Button */}
        <PrimaryButton
          label="Create Nursing Assessment"
          onPress={() =>
            router.push({
              pathname: "/notes/assessment",
              params: { patientId: id || "123XYZ", patientName: "Maria Khan" },
            })
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.backgroundAlt },
  container: { padding: 20, gap: 16, paddingBottom: 40 },
  profileCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    gap: 6,
  },
  patientName: { fontSize: 18, fontWeight: "700", color: colors.textHeading },
  patientMeta: { fontSize: 13, color: colors.textSecondary },
  badgeWrapper: { marginTop: 4 },
  infoGrid: { flexDirection: "row", gap: 10 },
  infoTile: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  infoTileLabel: { fontSize: 11, color: colors.textSecondary },
  infoTileValue: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textHeading,
    marginTop: 2,
  },
  section: { gap: 8 },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: colors.textHeading },
  detailsCard: { backgroundColor: colors.white, borderRadius: 12, padding: 14 },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  detailLabel: { fontSize: 13, color: colors.textSecondary },
  detailValue: { fontSize: 13, fontWeight: "600", color: colors.textHeading },
  divider: { height: 1, backgroundColor: colors.borderLight },
});
