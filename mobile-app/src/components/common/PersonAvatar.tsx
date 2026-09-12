import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { colors } from "../../theme/colors";

interface PersonAvatarProps {
  size?: number;
  iconSize?: number;
}

export function PersonAvatar({ size = 36, iconSize }: PersonAvatarProps) {
  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Ionicons
        name="person"
        size={iconSize ?? size * 0.55}
        color={colors.accent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: colors.accentBg,
    alignItems: "center",
    justifyContent: "center",
  },
});
