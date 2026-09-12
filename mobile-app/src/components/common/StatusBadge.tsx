import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";

type StatusTone = "success" | "danger" | "warning" | "neutral";

interface StatusBadgeProps {
  label: string;
  tone?: StatusTone;
}

const toneStyles: Record<StatusTone, { bg: string; text: string }> = {
  success: { bg: colors.successBg, text: colors.success },
  danger: { bg: "#FEE2E2", text: colors.danger },
  warning: { bg: "#ECFCCB", text: "#4D7C0F" },
  neutral: { bg: colors.badgeNeutralBg, text: colors.textSecondary },
};

export function StatusBadge({ label, tone = "neutral" }: StatusBadgeProps) {
  const { bg, text } = toneStyles[tone];

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  text: {
    fontSize: 11,
    fontWeight: "600",
  },
});
