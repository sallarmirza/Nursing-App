// app/notes/assessment
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PersonAvatar } from "../../components/common/PersonAvatar";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { ScreenHeader } from "../../components/common/ScreenHeader";
import { StatusBadge } from "../../components/common/StatusBadge";
import { colors } from "../../theme/colors";

export default function NursingAssessmentScreen() {
  const params = useLocalSearchParams<{
    patientId?: string;
    patientName?: string;
  }>();

  const [condition, setCondition] = useState<string>("Stable");
  const [consciousness, setConsciousness] =
    useState<string>("Responds to Voice");
  const [gcs, setGcs] = useState<string>("");
  const [painScale, setPainScale] = useState<number>(4);

  const [bp, setBp] = useState("");
  const [hr, setHr] = useState("");
  const [rr, setRr] = useState("");
  const [spO2, setSpO2] = useState("");
  const [temp, setTemp] = useState("");

  const [interventions, setInterventions] = useState<{
    [key: string]: boolean;
  }>({
    "Medication Administered": true,
    "IV Fluids": true,
    "Oxygen Therapy": false,
    "Wound Dressing": false,
    "Catheter Care": false,
    "Patient Education": true,
    "Position Changed": true,
    "Blood Sample Collected": false,
  });

  const conditionOptions = [
    "Stable",
    "Improving",
    "Under Observation",
    "Critical",
  ];
  const consciousnessOptions = [
    "Alert",
    "Responds to Voice",
    "Responds to Pain",
    "Unresponsive",
  ];

  const toggleIntervention = (key: string) => {
    setInterventions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleProceed = () => {
    router.push({
      pathname: "/notes/sbar",
      params: {
        patientId: params.patientId || "123XYZ",
        name: params.patientName || "Maria Khan",
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScreenHeader title="Nursing Notes" />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.patientCard}>
          <View style={styles.patientLeft}>
            <PersonAvatar size={36} />
            <View>
              <Text style={styles.patientName}>
                {params.patientName || "Maria Khan"}
              </Text>
              <Text style={styles.patientMeta}>35 years, Female</Text>
              <Text style={styles.patientSubMeta}>
                ID: 123XYZ | 35 Years, F | 65kg
              </Text>
            </View>
          </View>
          <StatusBadge label="Stable" tone="success" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Patient Condition</Text>
          <View style={styles.grid2x2}>
            {conditionOptions.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.toggleChip,
                  condition === item && styles.activeChip,
                ]}
                onPress={() => setCondition(item)}
              >
                <Text
                  style={[
                    styles.chipText,
                    condition === item && styles.activeChipText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Level of Consciousness</Text>
          <View style={styles.grid2x2}>
            {consciousnessOptions.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.toggleChip,
                  consciousness === item && styles.activeChip,
                ]}
                onPress={() => setConsciousness(item)}
              >
                <Text
                  style={[
                    styles.chipText,
                    consciousness === item && styles.activeChipText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GCS</Text>
          <View style={styles.gcsInputRow}>
            <TextInput
              style={styles.gcsInput}
              placeholder="--"
              placeholderTextColor={colors.textFaint}
              keyboardType="numeric"
              maxLength={2}
              value={gcs}
              onChangeText={setGcs}
            />
            <Text style={styles.gcsDenominator}>/ 15</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pain Scale</Text>
          <View style={styles.sliderContainer}>
            <View style={styles.sliderHeader}>
              <Text style={styles.sliderMinMax}>0</Text>
              <Text style={styles.sliderValueText}>
                {Math.round(painScale)}
              </Text>
              <Text style={styles.sliderMinMax}>10</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={10}
              step={1}
              value={painScale}
              onValueChange={setPainScale}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor="#CBD5E1"
              thumbTintColor={colors.primary}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vitals</Text>
          <View style={styles.vitalsGridTop}>
            <TextInput
              style={styles.vitalInput}
              placeholder="BP"
              placeholderTextColor={colors.placeholder}
              value={bp}
              onChangeText={setBp}
            />
            <TextInput
              style={styles.vitalInput}
              placeholder="HR"
              placeholderTextColor={colors.placeholder}
              value={hr}
              onChangeText={setHr}
            />
            <TextInput
              style={styles.vitalInput}
              placeholder="RR"
              placeholderTextColor={colors.placeholder}
              value={rr}
              onChangeText={setRr}
            />
          </View>
          <View style={styles.vitalsGridBottom}>
            <TextInput
              style={styles.vitalInputHalf}
              placeholder="SpO2"
              placeholderTextColor={colors.placeholder}
              value={spO2}
              onChangeText={setSpO2}
            />
            <TextInput
              style={styles.vitalInputHalf}
              placeholder="Temp (°F)"
              placeholderTextColor={colors.placeholder}
              value={temp}
              onChangeText={setTemp}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nursing Interventions</Text>
          <View style={styles.interventionsList}>
            {Object.entries(interventions).map(([key, checked]) => (
              <TouchableOpacity
                key={key}
                style={styles.checkboxRow}
                onPress={() => toggleIntervention(key)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={checked ? "checkbox" : "square-outline"}
                  size={20}
                  color={checked ? colors.textPrimary : colors.textSecondary}
                />
                <Text style={styles.checkboxLabel}>{key}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <PrimaryButton
          label="Proceed to Notes"
          onPress={handleProceed}
          style={styles.proceedButton}
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
    gap: 18,
    paddingBottom: 40,
  },
  patientCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  patientLeft: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  patientName: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textHeading,
  },
  patientMeta: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  patientSubMeta: {
    fontSize: 10,
    color: colors.textFaint,
    marginTop: 2,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textHeading,
  },
  grid2x2: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  toggleChip: {
    width: "48.5%",
    height: 44,
    backgroundColor: colors.white,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  activeChip: {
    backgroundColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.textSecondary,
    textAlign: "center",
  },
  activeChipText: {
    color: colors.white,
    fontWeight: "600",
  },
  gcsInputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 8,
    width: 130,
    height: 44,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  gcsInput: {
    fontSize: 15,
    color: colors.textHeading,
    textAlign: "center",
    width: 30,
  },
  gcsDenominator: {
    fontSize: 14,
    color: colors.textHeading,
    fontWeight: "600",
    marginLeft: 4,
  },
  sliderContainer: {
    gap: 2,
  },
  sliderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  sliderMinMax: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  sliderValueText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textHeading,
  },
  slider: {
    width: "100%",
    height: 30,
  },
  vitalsGridTop: {
    flexDirection: "row",
    gap: 8,
  },
  vitalsGridBottom: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginTop: 8,
  },
  vitalInput: {
    flex: 1,
    height: 44,
    backgroundColor: colors.white,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 13,
    color: colors.inputValue,
  },
  vitalInputHalf: {
    width: "48.5%",
    height: 44,
    backgroundColor: colors.white,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 13,
    color: colors.inputValue,
  },
  interventionsList: {
    gap: 10,
    marginTop: 4,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  checkboxLabel: {
    fontSize: 13,
    color: colors.textHeading,
    fontWeight: "500",
  },
  proceedButton: {
    marginTop: 12,
  },
});
