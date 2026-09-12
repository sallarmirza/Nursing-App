import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { colors } from "../../theme/colors";

interface PrimaryButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: "filled" | "outline";
  loading?: boolean;
}

export function PrimaryButton({
  label,
  variant = "filled",
  loading = false,
  style,
  disabled,
  ...rest
}: PrimaryButtonProps) {
  const isOutline = variant === "outline";

  return (
    <TouchableOpacity
      style={[
        styles.base,
        isOutline ? styles.outline : styles.filled,
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? colors.primary : colors.white} />
      ) : (
        <Text style={[styles.label, isOutline && styles.labelOutline]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  filled: {
    backgroundColor: colors.primary,
  },
  outline: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  labelOutline: {
    color: colors.primary,
  },
});
