import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    StyleSheet,
    TouchableOpacity,
    TouchableOpacityProps,
} from "react-native";
import { colors } from "../../theme/colors";

interface BackButtonProps extends TouchableOpacityProps {
  size?: number;
  color?: string;
  onPress?: () => void;
  fallbackHref?: string;
}

export function BackButton({
  size = 24,
  color = colors.textPrimary,
  onPress,
  fallbackHref = "/(tabs)/dashboard",
  style,
  ...rest
}: BackButtonProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }

    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(fallbackHref as any);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.button, style]}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      {...rest}
    >
      <Ionicons name="chevron-back" size={size} color={color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 32,
    padding: 4,
  },
});
