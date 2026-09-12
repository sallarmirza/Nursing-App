// app/(auth)/signup
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FormInput } from "../../components/common/FormInput";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { colors } from "../../theme/colors";

export default function SignupScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to join DNA Account</Text>

        <View style={styles.form}>
          <FormInput placeholder="Full Name" />
          <FormInput
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <FormInput placeholder="Password" secureTextEntry />

          <PrimaryButton label="Sign up" style={styles.signUpButton} />
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.line} />
        </View>

        <Text style={styles.sectionHeader}>Continue with</Text>

        <TouchableOpacity style={styles.socialButton}>
          <Ionicons
            name="logo-google"
            size={20}
            color="#EA4335"
            style={styles.buttonIcon}
          />
          <Text style={styles.socialButtonText}>Google</Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <Link href="/(auth)/login" style={styles.link}>
            Sign In
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 24,
  },
  form: {
    gap: 16,
  },
  signUpButton: {
    marginTop: 8,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.textPrimary,
  },
  dividerText: {
    marginHorizontal: 16,
    color: colors.textMuted,
    fontSize: 14,
  },
  sectionHeader: {
    textAlign: "center",
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: 16,
    fontWeight: "500",
  },
  socialButton: {
    height: 52,
    backgroundColor: colors.white,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  buttonIcon: {
    marginRight: 12,
  },
  socialButtonText: {
    color: colors.textHeading,
    fontSize: 15,
    fontWeight: "500",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  loginText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  link: {
    color: colors.primaryAlt,
    fontWeight: "600",
    fontSize: 14,
  },
});
