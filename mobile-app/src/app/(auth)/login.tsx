// app/(auth)/login
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { FormInput } from "../../components/common/FormInput";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { colors } from "../../theme/colors";
import { useLogin } from "../../hooks/auth/useLogin";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useLogin();

  const handleLogin = async () => {
    if (!email || !password) return;

    const success = await login(email, password);
    if (success) {
      router.replace("/(tabs)");
    }
  };

  return (
    <View 
      className="flex-1 justify-center" 
      style={{ backgroundColor: colors.background }}
    >
      <View className="px-6">
        <Text className="text-[28px] font-semibold mb-1" style={{ color: colors.textPrimary }}>
          Welcome
        </Text>
        <Text className="text-sm mb-6" style={{ color: colors.textMuted }}>
          Sign in to your DNA Account
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

          <TouchableOpacity className="self-end -mt-1">
            <Text className="text-[13px]" style={{ color: colors.dangerAlt }}>
              Forgot password?
            </Text>
          </TouchableOpacity>

          {error && (
            <Text className="text-[13px]" style={{ color: colors.dangerAlt }}>
              {error}
            </Text>
          )}

          <PrimaryButton
            label={isLoading ? "Signing in..." : "Sign in"}
            onPress={handleLogin}
            disabled={isLoading}
            style={{ marginTop: 8 }}
          />
          {isLoading && <ActivityIndicator size="small" color={colors.primaryAlt} />}
        </View>

        <View className="flex-row justify-center items-center mt-6">
          <Text className="text-sm" style={{ color: colors.textMuted }}>
            Don't have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
            <Text className="text-sm font-semibold" style={{ color: colors.primaryAlt }}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center my-5">
          <View className="flex-1 h-[1px]" style={{ backgroundColor: colors.divider }} />
          <Text className="text-sm mx-4" style={{ color: colors.textMuted }}>
            or
          </Text>
          <View className="flex-1 h-[1px]" style={{ backgroundColor: colors.divider }} />
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

        <View className="flex-row items-center my-5">
          <View className="flex-1 h-[1px]" style={{ backgroundColor: colors.divider }} />
          <Text className="text-sm mx-4" style={{ color: colors.textMuted }}>
            login with
          </Text>
          <View className="flex-1 h-[1px]" style={{ backgroundColor: colors.divider }} />
        </View>

        <TouchableOpacity 
          className="h-[52px] rounded-lg flex-row items-center px-4" 
          style={{ backgroundColor: colors.white }}
        >
          <Ionicons
            name="phone-portrait-outline"
            size={20}
            color={colors.primaryAlt}
            style={{ marginRight: 12 }}
          />
          <Text className="text-[15px] font-medium" style={{ color: colors.textHeading }}>
            Continue with Mobile
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}