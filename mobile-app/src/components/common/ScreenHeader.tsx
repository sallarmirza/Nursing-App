import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../theme/colors";
import { BackButton } from "./BackButton";

interface ScreenHeaderProps {
  title: string;
  showBack?: boolean;
  rightLabel?: string;
  onRightPress?: () => void;
  rightElement?: React.ReactNode;
}

export function ScreenHeader({
  title,
  showBack = true,
  rightLabel,
  onRightPress,
  rightElement,
}: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      {showBack ? <BackButton /> : <View style={styles.side} />}

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      <View style={[styles.side, styles.rightSide]}>
        {rightElement ? (
          rightElement
        ) : rightLabel ? (
          <TouchableOpacity onPress={onRightPress}>
            <Text style={styles.rightLabel}>{rightLabel}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  side: {
    width: 32,
    padding: 4,
  },
  rightSide: {
    alignItems: "flex-end",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    flex: 1,
    textAlign: "center",
  },
  rightLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
    textDecorationLine: "underline",
  },
});
