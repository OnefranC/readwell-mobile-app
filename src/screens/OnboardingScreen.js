import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, Image, Pressable, ScrollView, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPE, SHADOWS } from '../theme';
import { IMAGES, LANGUAGES, GOALS } from '../constants/data';
import { PrimaryButton, TextButton, Icon3D } from '../components/ui';
import { useApp } from '../context/AppContext';

/**
 * Three-step onboarding: welcome → language → goal.
 * Steps 2 and 3 gate the CTA until a choice is made.
 */
export default function OnboardingScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const [step, setStep] = useState(0);
  const [lang, setLang] = useState(state.language || 'en');
  const [goal, setGoal] = useState(state.goal || null);

  const finish = useCallback(() => {
    dispatch({ type: 'SET_LANGUAGE', payload: lang });
    dispatch({ type: 'SET_GOAL', payload: goal });
    dispatch({ type: 'COMPLETE_ONBOARDING' });
    navigation.replace('SignIn');
  }, [dispatch, lang, goal, navigation]);

  const skip = useCallback(() => {
    dispatch({ type: 'COMPLETE_ONBOARDING' });
    navigation.replace('SignIn');
  }, [dispatch, navigation]);

  const next = () => (step === 2 ? finish() : setStep((s) => s + 1));

  const Dots = ({ index }) => (
    <View style={styles.dots}>
      {[0, 1, 2].map((i) => (
        <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
      ))}
    </View>
  );

  /* ---------------- step 1: welcome ---------------- */
  if (step === 0) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.welcomeWrap}>
          <View style={styles.heroCard}>
            <Image source={IMAGES.onboardingWelcome} style={styles.heroImg} resizeMode="cover" />
          </View>
          <View style={styles.welcomeCopy}>
            <Text style={styles.welcomeTitle}>Welcome to ReadWell</Text>
            <Text style={styles.welcomeSub}>Your journey to reading starts here.</Text>
          </View>
          <View style={styles.welcomeFooter}>
            <PrimaryButton title="Get Started" onPress={next} />
            <Dots index={0} />
            <TextButton title="Skip for now" onPress={skip} color={COLORS.textSecondary} style={styles.skip} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  /* ---------------- step 2: language ---------------- */
  if (step === 1) {
    return (
      <SafeAreaView style={styles.root}>
        <ScrollView contentContainerStyle={styles.stepScroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.stepTitle}>Which language do you want to learn?</Text>
          <Pressable style={styles.listenPill} accessibilityRole="button" accessibilityLabel="Listen to this question">
            <Ionicons name="volume-high" size={17} color={COLORS.primaryDark} />
            <Text style={styles.listenText}>Listen</Text>
          </Pressable>

          <View style={styles.langGrid}>
            {LANGUAGES.map((l) => {
              const active = lang === l.id;
              return (
                <Pressable
                  key={l.id}
                  onPress={() => setLang(l.id)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={l.name}
                  style={[styles.langCard, active && styles.langCardActive, active && SHADOWS.sm]}
                >
                  <View style={[styles.langCheck, active && styles.langCheckOn]}>
                    <Ionicons
                      name="checkmark"
                      size={15}
                      color={active ? COLORS.textInverse : COLORS.textTertiary}
                    />
                  </View>
                  <Image source={l.image} style={styles.langImg} resizeMode="cover" />
                  <Text style={[styles.langName, active && { color: COLORS.primary }]}>{l.name}</Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
        <View style={styles.stepFooter}>
          <Dots index={1} />
          <PrimaryButton title="Next" onPress={next} disabled={!lang} />
        </View>
      </SafeAreaView>
    );
  }

  /* ---------------- step 3: goal ---------------- */
  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.stepScroll} showsVerticalScrollIndicator={false}>
        <Dots index={2} />
        <View style={styles.goalHead}>
          <Text style={[styles.stepTitle, { flex: 1, marginBottom: 0 }]}>What is your reading goal?</Text>
          <Pressable style={styles.speaker} accessibilityRole="button" accessibilityLabel="Listen to this question">
            <Ionicons name="volume-high" size={20} color={COLORS.primary} />
          </Pressable>
        </View>
        <Text style={styles.stepSub}>Select one to continue.</Text>

        <View style={{ gap: SPACING.md }}>
          {GOALS.map((g) => {
            const active = goal === g.id;
            return (
              <Pressable
                key={g.id}
                onPress={() => setGoal(g.id)}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
                accessibilityLabel={`${g.title}. ${g.subtitle}`}
                style={[styles.goalCard, active && styles.goalCardActive]}
              >
                <View style={styles.goalIcon}>
                  <Icon3D name={g.icon3d} size={34} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.goalTitle}>{g.title}</Text>
                  <Text style={styles.goalSub}>{g.subtitle}</Text>
                </View>
                {active ? <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} /> : null}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
      <View style={styles.stepFooter}>
        <PrimaryButton title="Continue" onPress={next} disabled={!goal} />
        {!goal ? <Text style={styles.gateHint}>Choose a goal to continue</Text> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },

  welcomeWrap: { flex: 1, paddingHorizontal: SPACING.xl, paddingTop: SPACING.sm },
  heroCard: {
    flex: 1,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    backgroundColor: COLORS.surfaceMuted,
    maxHeight: 460,
  },
  heroImg: { width: '100%', height: '100%' },
  welcomeCopy: { alignItems: 'center', marginTop: SPACING.xxl },
  welcomeTitle: { ...TYPE.h1, color: COLORS.textPrimary, textAlign: 'center' },
  welcomeSub: { ...TYPE.bodyLg, color: COLORS.textSecondary, marginTop: 6, textAlign: 'center' },
  welcomeFooter: { paddingBottom: SPACING.xl, paddingTop: SPACING.xxl },
  skip: { alignSelf: 'center', marginTop: SPACING.md },

  stepScroll: { padding: SPACING.xl, paddingBottom: SPACING.huge },
  stepTitle: { ...TYPE.h1, color: COLORS.textPrimary, marginBottom: SPACING.lg },
  stepSub: { ...TYPE.bodyLg, color: COLORS.textSecondary, marginBottom: SPACING.xl },

  listenPill: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.lg, paddingVertical: 9,
    borderRadius: RADIUS.pill, marginBottom: SPACING.xxl, gap: 7,
  },
  listenText: { ...TYPE.bodyStrong, color: COLORS.primaryDark },

  langGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md },
  langCard: {
    width: '47.5%',
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  langCardActive: { backgroundColor: COLORS.surface, borderColor: COLORS.primary },
  langCheck: {
    position: 'absolute', top: SPACING.md, right: SPACING.md, zIndex: 2,
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center', justifyContent: 'center',
  },
  langCheckOn: { backgroundColor: COLORS.primary },
  langImg: { width: '100%', height: 96, borderRadius: RADIUS.sm, backgroundColor: COLORS.surfaceSunken },
  langName: { ...TYPE.h4, color: COLORS.textPrimary, textAlign: 'center', marginTop: SPACING.md },

  goalHead: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.md },
  speaker: {
    width: 46, height: 46, borderRadius: 23, backgroundColor: COLORS.surface,
    alignItems: 'center', justifyContent: 'center', ...SHADOWS.xs,
  },
  goalCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1.5, borderColor: 'transparent',
    gap: SPACING.lg,
    ...SHADOWS.xs,
  },
  goalCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primarySurfaceSoft },
  goalIcon: {
    width: 54, height: 54, borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceMuted,
    alignItems: 'center', justifyContent: 'center',
  },
  goalTitle: { ...TYPE.h4, color: COLORS.textPrimary },
  goalSub: { ...TYPE.small, color: COLORS.textSecondary, marginTop: 2 },

  stepFooter: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
    paddingTop: SPACING.md,
    backgroundColor: COLORS.background,
  },
  gateHint: { ...TYPE.small, color: COLORS.textTertiary, textAlign: 'center', marginTop: SPACING.sm },

  dots: { flexDirection: 'row', justifyContent: 'center', gap: 7, marginVertical: SPACING.lg },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primarySurface },
  dotActive: { width: 22, backgroundColor: COLORS.primary },
});
