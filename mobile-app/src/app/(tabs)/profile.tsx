// app/(tabs)/profile
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PersonAvatar } from "../../components/common/PersonAvatar";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { ScreenHeader } from "../../components/common/ScreenHeader";
import { colors } from "../../theme/colors";

const NURSE = {
  name: "Sarah Ahmed",
  qualification: "BSN, RN",
  designation: "Staff Nurse",
  hospital: "Ibadat International Hospital",
  experience: "5 Years",
  shift: "Morning Shift",
};

const DETAILS: { label: string; value: string }[] = [
  { label: "Qualification", value: NURSE.qualification },
  { label: "Designation", value: NURSE.designation },
  { label: "Hospital", value: NURSE.hospital },
  { label: "Experience", value: NURSE.experience },
  { label: "Current Shift", value: NURSE.shift },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScreenHeader title="Profile" />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <PersonAvatar size={72} />
          <Text style={styles.name}>{NURSE.name}</Text>
          <Text style={styles.designation}>{NURSE.designation}</Text>
        </View>

        <View style={styles.detailsCard}>
          {DETAILS.map((item, index) => (
            <View
              key={item.label}
              style={[
                styles.detailRow,
                index < DETAILS.length - 1 && styles.detailRowBorder,
              ]}
            >
              <Text style={styles.detailLabel}>{item.label}</Text>
              <Text style={styles.detailValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        <PrimaryButton
          label="Edit Profile"
          variant="outline"
          onPress={() => router.push("/(auth)/staff-profile")}
          style={styles.editButton}
        />

        <PrimaryButton
          label="Log Out"
          onPress={() => router.replace("/(auth)/login")}
          style={styles.logoutButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
  },
  container: {
    padding: 20,
    gap: 20,
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: "center",
    gap: 4,
    marginTop: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: 8,
  },
  designation: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  detailsCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  detailRow: {
    paddingVertical: 14,
  },
  detailRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textHeading,
  },
  editButton: {
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: colors.dangerAlt,
  },
});
