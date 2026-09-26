// app/(auth)/signup
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { FormInput } from "../../components/common/FormInput";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { colors } from "../../theme/colors";
import useSignup from "../../hooks/auth/useSignup";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, isLoading, error } = useSignup();

  const handleSignup = async () => {
    if (!email || !password) return;

    const nurseId = await signup(email, password);
    if (nurseId) {
      router.push("/(auth)/staff-profile");
    }
  };

  return (
    <View 
      className="flex-1 justify-center" 
      style={{ backgroundColor: colors.background }}
    >
      <View className="px-6">
        <Text className="text-[28px] font-semibold mb-1" style={{ color: colors.textPrimary }}>
          Create Account
        </Text>
        <Text className="text-sm mb-6" style={{ color: colors.textMuted }}>
          Sign up to join DNA Account
        </Text>

        <View className="gap-4">
          <FormInput
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <FormInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {error && (
            <Text className="text-[13px]" style={{ color: colors.dangerAlt ?? "red" }}>
              {error}
            </Text>
          )}

          <PrimaryButton
            label={isLoading ? "Signing up..." : "Sign up"}
            onPress={handleSignup}
            disabled={isLoading}
            style={{ marginTop: 8 }}
          />
          {isLoading && <ActivityIndicator size="small" color={colors.primaryAlt} />}
        </View>

        <View className="flex-row items-center my-5">
          <View className="flex-1 h-[1px]" style={{ backgroundColor: colors.textPrimary }} />
          <Text className="text-sm mx-4" style={{ color: colors.textMuted }}>
            or
          </Text>
          <View className="flex-1 h-[1px]" style={{ backgroundColor: colors.textPrimary }} />
        </View>

        <Text className="text-center text-sm font-medium mb-4" style={{ color: colors.textMuted }}>
          Continue with
        </Text>

        <TouchableOpacity 
          className="h-[52px] rounded-lg flex-row items-center px-4" 
          style={{ backgroundColor: colors.white }}
        >
          <Ionicons
            name="logo-google"
            size={20}
            color="#EA4335"
            style={{ marginRight: 12 }}
          />
          <Text className="text-[15px] font-medium" style={{ color: colors.textHeading }}>
            Google
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-6">
          <Text className="text-sm" style={{ color: colors.textMuted }}>
            Already have an account?{" "}
          </Text>
          <Link href="/(auth)/login" className="text-sm font-semibold" style={{ color: colors.primaryAlt }}>
            Sign In
          </Link>
        </View>
      </View>
    </View>
  );
}