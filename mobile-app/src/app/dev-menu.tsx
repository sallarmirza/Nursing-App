// app/dev-menu
import { router } from "expo-router";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";

const ROUTES: { label: string; href: string }[] = [
  { label: "Login", href: "/(auth)/login" },
  { label: "Signup", href: "/(auth)/signup" },
  { label: "Staff Profile", href: "/(auth)/staff-profile" },
  { label: "Dashboard", href: "/(tabs)/dashboard" },
  { label: "Notes Tab", href: "/(tabs)/notes" },
  { label: "Patients Tab", href: "/(tabs)/patients" },
  { label: "Profile Tab", href: "/(tabs)/profile" },
  { label: "Dosage Calculator", href: "/calculations/dosage" },
  { label: "IV Drip Rate", href: "/calculations/drip" },
  { label: "Nursing Assessment", href: "/notes/assessment" },
  { label: "Notes History", href: "/notes/history" },
  { label: "SBAR Handover", href: "/notes/sbar" },
  { label: "SOAP Notes", href: "/notes/soap" },
  { label: "Patients List", href: "/patients" },
  { label: "Patient Record ([id])", href: "/patients/1" },
  { label: "Add New Patient", href: "/patients/new" },
];

export default function DevMenuScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Dev Menu — All Screens</Text>
        <View style={styles.list}>
          {ROUTES.map((route) => (
            <TouchableOpacity
              key={route.href}
              style={styles.item}
              onPress={() => router.push(route.href as any)}
            >
              <Text style={styles.itemText}>{route.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.backgroundAlt },
  container: { padding: 20, gap: 16 },
  title: { fontSize: 20, fontWeight: "700", color: colors.textPrimary },
  list: { gap: 10 },
  item: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 14,
  },
  itemText: { fontSize: 15, fontWeight: "600", color: colors.textHeading },
});
