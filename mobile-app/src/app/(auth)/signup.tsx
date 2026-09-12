// app/(auth)/singup

import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignupScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to join DNA Account</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#A0A0A0"
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#A0A0A0"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#A0A0A0"
            secureTextEntry
          />

          <TouchableOpacity style={styles.signUpButton}>
            <Text style={styles.signUpButtonText}>Sign up</Text>
          </TouchableOpacity>
        </View>

        {/* Divider 1 */}
        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.line} />
        </View>

        <Text style={styles.sectionHeader}>Continue with</Text>

        {/* Google Button */}
        <TouchableOpacity style={styles.socialButton}>
          <Ionicons
            name="logo-google"
            size={20}
            color="#EA4335"
            style={styles.buttonIcon}
          />
          <Text style={styles.socialButtonText}>Google</Text>
        </TouchableOpacity>

        {/* Login Link */}
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
    backgroundColor: "#F4F3F3",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#8E8D8A",
    marginBottom: 24,
  },
  form: {
    gap: 16,
  },
  input: {
    height: 52,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#000000",
  },
  signUpButton: {
    height: 52,
    backgroundColor: "#2089DC",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  signUpButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#000000",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#8E8D8A",
    fontSize: 14,
  },
  sectionHeader: {
    textAlign: "center",
    color: "#8E8D8A",
    fontSize: 14,
    marginBottom: 16,
    fontWeight: "500",
  },
  socialButton: {
    height: 52,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  buttonIcon: {
    marginRight: 12,
  },
  socialButtonText: {
    color: "#2C3E50",
    fontSize: 15,
    fontWeight: "500",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  loginText: {
    color: "#8E8D8A",
    fontSize: 14,
  },
  link: {
    color: "#2089DC",
    fontWeight: "600",
    fontSize: 14,
  },
});
