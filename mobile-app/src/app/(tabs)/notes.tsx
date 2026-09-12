// app/(tabs)/notes
import { router } from "expo-router";
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

interface PatientNote {
  id: string;
  name: string;
  status: string;
  tone: "success" | "danger" | "warning";
}

const NOTES_LIST: PatientNote[] = [
  {
    id: "1",
    name: "Mr. Ahmed Ali Khan",
    status: "Vitals Updated",
    tone: "success",
  },
  {
    id: "2",
    name: "Mrs. Fatima Sana",
    status: "Pending Medication",
    tone: "warning",
  },
  {
    id: "3",
    name: "Mrs. Nida Farooq",
    status: "Vitals Overdue",
    tone: "danger",
  },
  {
    id: "4",
    name: "Mr. Altaf Ahmed",
    status: "Medication Overdue",
    tone: "danger",
  },
  { id: "5", name: "Mr. Daniyal Ali", status: "IV Bag Low", tone: "warning" },
];

export default function NursingNotesScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScreenHeader
        title="Nursing Notes"
        rightElement={<PersonAvatar size={36} />}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerSubtitle}>Morning Shift, July 15, 2026</Text>

        <View style={styles.cardContainer}>
          {NOTES_LIST.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.patientRow,
                index < NOTES_LIST.length - 1 && styles.rowBorder,
              ]}
              onPress={() =>
                router.push({
                  pathname: "/notes/sbar",
                  params: { patientId: item.id, name: item.name },
                })
              }
            >
              <View style={styles.leftContent}>
                <PersonAvatar size={28} />
                <Text style={styles.patientName}>{item.name}</Text>
              </View>
              <StatusBadge label={item.status} tone={item.tone} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.seeAllButton}>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>

        <PrimaryButton
          label="Notes History"
          onPress={() => router.push("/notes/history")}
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
    gap: 16,
    paddingBottom: 40,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: -8,
  },
  cardContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  patientRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  patientName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textHeading,
  },
  seeAllButton: {
    alignSelf: "flex-end",
    paddingVertical: 4,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textPrimary,
  },
});
