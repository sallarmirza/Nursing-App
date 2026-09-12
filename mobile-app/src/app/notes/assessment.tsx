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

export default function NursingAssessmentScreen() {
  const params = useLocalSearchParams<{
    patientId?: string;
    patientName?: string;
  }>();

  // Selection states
  const [condition, setCondition] = useState<string>("Stable");
  const [consciousness, setConsciousness] =
    useState<string>("Responds to Voice");
  const [gcs, setGcs] = useState<string>("");
  const [painScale, setPainScale] = useState<number>(4);

  // Vitals states
  const [bp, setBp] = useState("");
  const [hr, setHr] = useState("");
  const [rr, setRr] = useState("");
  const [spO2, setSpO2] = useState("");
  const [temp, setTemp] = useState("");

  // Interventions state
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nursing Notes</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Patient Info Card */}
        <View style={styles.patientCard}>
          <View style={styles.patientLeft}>
            <View style={styles.patientAvatar}>
              <Ionicons name="person" size={20} color="#A78BFA" />
            </View>
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
          <View style={styles.badgeStable}>
            <Text style={styles.badgeStableText}>Stable</Text>
          </View>
        </View>

        {/* Patient Condition */}
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

        {/* Level of Consciousness */}
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

        {/* GCS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GCS</Text>
          <View style={styles.gcsInputRow}>
            <TextInput
              style={styles.gcsInput}
              placeholder="--"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              maxLength={2}
              value={gcs}
              onChangeText={setGcs}
            />
            <Text style={styles.gcsDenominator}>/ 15</Text>
          </View>
        </View>

        {/* Pain Scale */}
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
              minimumTrackTintColor="#1D9BF0"
              maximumTrackTintColor="#CBD5E1"
              thumbTintColor="#1D9BF0"
            />
          </View>
        </View>

        {/* Vitals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vitals</Text>
          <View style={styles.vitalsGridTop}>
            <TextInput
              style={styles.vitalInput}
              placeholder="BP"
              placeholderTextColor="#C4B5FD"
              value={bp}
              onChangeText={setBp}
            />
            <TextInput
              style={styles.vitalInput}
              placeholder="HR"
              placeholderTextColor="#C4B5FD"
              value={hr}
              onChangeText={setHr}
            />
            <TextInput
              style={styles.vitalInput}
              placeholder="RR"
              placeholderTextColor="#C4B5FD"
              value={rr}
              onChangeText={setRr}
            />
          </View>
          <View style={styles.vitalsGridBottom}>
            <TextInput
              style={styles.vitalInputHalf}
              placeholder="SpO2"
              placeholderTextColor="#C4B5FD"
              value={spO2}
              onChangeText={setSpO2}
            />
            <TextInput
              style={styles.vitalInputHalf}
              placeholder="Temp (°F)"
              placeholderTextColor="#C4B5FD"
              value={temp}
              onChangeText={setTemp}
            />
          </View>
        </View>

        {/* Nursing Interventions */}
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
                  color={checked ? "#000000" : "#6B7280"}
                />
                <Text style={styles.checkboxLabel}>{key}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.proceedButton} onPress={handleProceed}>
          <Text style={styles.proceedButtonText}>Proceed to Notes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3EFEF",
  },
  header: {
    height: 52,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
  },
  headerPlaceholder: {
    width: 28,
  },
  container: {
    padding: 20,
    gap: 18,
    paddingBottom: 40,
  },
  patientCard: {
    backgroundColor: "#FFFFFF",
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
  patientAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EDE9FE",
    alignItems: "center",
    justifyContent: "center",
  },
  patientName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
  },
  patientMeta: {
    fontSize: 12,
    color: "#6B7280",
  },
  patientSubMeta: {
    fontSize: 10,
    color: "#9CA3AF",
    marginTop: 2,
  },
  badgeStable: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeStableText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#166534",
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
  },
  grid2x2: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  toggleChip: {
    width: "48.5%",
    height: 44,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  activeChip: {
    backgroundColor: "#1D9BF0",
  },
  chipText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
    textAlign: "center",
  },
  activeChipText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  gcsInputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    width: 130,
    height: 44,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  gcsInput: {
    fontSize: 15,
    color: "#1F2937",
    textAlign: "center",
    width: 30,
  },
  gcsDenominator: {
    fontSize: 14,
    color: "#1F2937",
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
    color: "#6B7280",
    fontWeight: "600",
  },
  sliderValueText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1F2937",
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
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 13,
    color: "#8B5CF6",
  },
  vitalInputHalf: {
    width: "48.5%",
    height: 44,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 13,
    color: "#8B5CF6",
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
    color: "#1F2937",
    fontWeight: "500",
  },
  proceedButton: {
    height: 48,
    backgroundColor: "#1D9BF0",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  proceedButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
