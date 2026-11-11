// app/index — two-phase animated splash, then routes based on auth state
// Phase 1 (1.5 s): brand blue, white logo, app name, pulsing dots
// Phase 2 (0.5 s crossfade + 0.8 s hold): white, blue logo, app name
// Navigation fires when both animation AND auth loading are complete
import { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../context/AuthContext";

const LOGO = require("../../assets/images/icon.png");
const BRAND_BLUE = "#208AEF";
const NUM_DOTS = 7;

export default function Index() {
  const { nurse, isLoading } = useAuth();

  const blueFade  = useRef(new Animated.Value(1)).current;
  const whiteFade = useRef(new Animated.Value(0)).current;
  const dotOpacity = useRef(new Animated.Value(0.4)).current;

  const animDone  = useRef(false);
  const authReady = useRef(false);
  const navigated = useRef(false);

  function tryNavigate() {
    if (navigated.current || !animDone.current || !authReady.current) return;
    navigated.current = true;
    router.replace(nurse ? "/(tabs)/dashboard" : "/(auth)/login");
  }

  // Mark auth ready as soon as AuthContext finishes reading storage
  useEffect(() => {
    if (!isLoading) {
      authReady.current = true;
      tryNavigate();
    }
  }, [isLoading]);

  useEffect(() => {
    // Dots: pulse opacity 0.4 → 1 → 0.4 on a loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotOpacity, { toValue: 1,   duration: 550, useNativeDriver: true }),
        Animated.timing(dotOpacity, { toValue: 0.4, duration: 550, useNativeDriver: true }),
      ])
    ).start();

    // After 1.5 s start the crossfade to white
    const t1 = setTimeout(() => {
      Animated.parallel([
        Animated.timing(blueFade,  { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(whiteFade, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]).start();
    }, 1500);

    // After 2.8 s mark animation done and try to navigate
    const t2 = setTimeout(() => {
      animDone.current = true;
      tryNavigate();
    }, 2800);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <View style={styles.root}>
      {/* ── Phase 1: blue ── */}
      <Animated.View style={[StyleSheet.absoluteFill, styles.bluePanel, { opacity: blueFade }]}>
        <Image source={LOGO} style={styles.logoWhite} resizeMode="contain" tintColor="#FFFFFF" />
        <Text style={styles.titleWhite}>Digital Nursing Assistant</Text>
        <Animated.View style={[styles.dotsRow, { opacity: dotOpacity }]}>
          {Array.from({ length: NUM_DOTS }).map((_, i) => (
            <View key={i} style={styles.dot} />
          ))}
        </Animated.View>
      </Animated.View>

      {/* ── Phase 2: white ── */}
      <Animated.View style={[StyleSheet.absoluteFill, styles.whitePanel, { opacity: whiteFade }]}>
        <Image source={LOGO} style={styles.logoBlue} resizeMode="contain" />
        <Text style={styles.titleBlue}>Digital Nursing Assistant</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  bluePanel: {
    backgroundColor: BRAND_BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  whitePanel: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  logoWhite: {
    width: 130,
    height: 130,
    marginBottom: 22,
  },
  logoBlue: {
    width: 150,
    height: 150,
    marginBottom: 22,
  },
  titleWhite: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  titleBlue: {
    fontSize: 22,
    fontWeight: "700",
    color: BRAND_BLUE,
    letterSpacing: 0.2,
  },
  dotsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 52,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.8)",
  },
});
