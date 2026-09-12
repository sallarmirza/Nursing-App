import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View,
} from "react-native";
import { colors } from "../../theme/colors";

interface FormInputProps extends TextInputProps {
  label?: string;
  filled?: boolean; // true = show inputValue color, false = placeholder-style lavender
}

export function FormInput({
  label,
  filled = false,
  style,
  ...rest
}: FormInputProps) {
  return (
    <View style={styles.group}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[
          styles.input,
          { color: filled ? colors.inputValue : colors.textPrimary },
          style,
        ]}
        placeholderTextColor={colors.placeholder}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: 6,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textHeading,
  },
  input: {
    height: 48,
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 15,
  },
});
