import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ImageBackground, Easing } from 'react-native';
import { COLORS, TYPE } from '../theme';
import { IMAGES } from '../constants/data';
import { useApp } from '../context/AppContext';

/**
 * Splash — wordmark fades up over a tinted library photograph.
 * Routes once persisted state has hydrated.
 */
export default function SplashScreen({ navigation }) {
  const { state } = useApp();
  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(14)).current;
  const veil = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(rise, {
        toValue: 0, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: true,
      }),
      Animated.timing(veil, { toValue: 1, duration: 900, useNativeDriver: true }),
    ]).start();
  }, [fade, rise, veil]);

  useEffect(() => {
    if (!state.hydrated) return;
    const t = setTimeout(() => {
      if (!state.hasOnboarded) navigation.replace('Onboarding');
      else if (state.isLoggedIn || state.isGuest) navigation.replace('Main');
      else navigation.replace('SignIn');
    }, 1400);
    return () => clearTimeout(t);
  }, [state.hydrated, state.hasOnboarded, state.isLoggedIn, state.isGuest, navigation]);

  return (
    <View style={styles.root}>
      <ImageBackground source={IMAGES.splashLibrary} style={styles.bg} resizeMode="cover">
        <Animated.View style={[styles.tint, { opacity: veil }]} />
        <Animated.View style={[styles.center, { opacity: fade, transform: [{ translateY: rise }] }]}>
          <Text style={styles.wordmark}>ReadWell</Text>
          <View style={styles.rule} />
          <Text style={styles.tagline}>Your journey to reading starts here</Text>
        </Animated.View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.primary },
  bg: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tint: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15,118,110,0.78)' },
  center: { alignItems: 'center', paddingHorizontal: 32 },
  wordmark: {
    fontSize: 44,
    fontWeight: '800',
    color: COLORS.textInverse,
    letterSpacing: -0.8,
  },
  rule: {
    width: 46, height: 3, borderRadius: 2,
    backgroundColor: COLORS.accent, marginTop: 14, marginBottom: 14,
  },
  tagline: {
    ...TYPE.body,
    color: 'rgba(255,255,255,0.92)',
    textAlign: 'center',
  },
});
