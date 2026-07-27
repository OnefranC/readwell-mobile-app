import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPE } from '../theme';
import { PrimaryButton, TextButton } from '../components/ui';
import { useApp } from '../context/AppContext';

const BITS = [
  { x: 0.30, y: 0.12, c: '#F87171', s: 13, r: 3 },
  { x: 0.18, y: 0.22, c: '#FBBF24', s: 15, r: 3 },
  { x: 0.80, y: 0.30, c: '#2DD4BF', s: 13, r: 7 },
  { x: 0.22, y: 0.52, c: '#60A5FA', s: 12, r: 6 },
  { x: 0.70, y: 0.54, c: '#A78BFA', s: 12, r: 6 },
];

const fmt = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

export default function PaymentSuccessScreen({ navigation }) {
  const { state } = useApp();
  const pop = useRef(new Animated.Value(0.6)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(pop, { toValue: 1, tension: 55, friction: 6, useNativeDriver: true }),
      Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();
  }, [pop, fade]);

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.header}>Payment Successful</Text>

      <View style={styles.art}>
        {BITS.map((b, i) => (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              left: `${b.x * 100}%`,
              top: `${b.y * 100}%`,
              width: b.s, height: b.s, borderRadius: b.r,
              backgroundColor: b.c,
              opacity: fade,
            }}
          />
        ))}
        <Animated.View style={[styles.disc, { transform: [{ scale: pop }] }]}>
          <Ionicons name="checkmark" size={62} color={COLORS.primaryDark} />
        </Animated.View>
      </View>

      <Animated.View style={{ opacity: fade, paddingHorizontal: SPACING.xl }}>
        <Text style={styles.title}>
          Welcome to{'\n'}
          <Text style={styles.titleAccent}>ReadWell Pro!</Text>
        </Text>
        <Text style={styles.sub}>Your journey to excellence just got better.</Text>

        <View style={styles.card}>
          <View style={styles.cardHead}>
            <Text style={styles.planName}>ReadWell Pro</Text>
            <View style={styles.activePill}>
              <Text style={styles.activeText}>Active</Text>
            </View>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.price}>$9.99</Text>
            <Text style={styles.period}>/ month</Text>
          </View>

          <View style={styles.rule} />

          <View style={styles.metaRow}>
            <Ionicons name="checkmark-circle" size={18} color={COLORS.accentDark} />
            <Text style={styles.metaLabel}>Starts: </Text>
            <Text style={styles.metaValue}>Today</Text>
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="calendar-outline" size={18} color={COLORS.textSecondary} />
            <Text style={styles.metaLabel}>Next Bill: </Text>
            <Text style={styles.metaValue}>{fmt(state.subscription?.nextBilling)}</Text>
          </View>
        </View>
      </Animated.View>

      <View style={styles.footer}>
        <PrimaryButton
          title="Start Learning Now"
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Main' }] })}
        />
        <TextButton
          title="Go to Settings to manage subscription"
          onPress={() => navigation.replace('Settings')}
          color={COLORS.textSecondary}
          style={styles.manage}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  header: { ...TYPE.h2, color: COLORS.textPrimary, textAlign: 'center', marginTop: SPACING.lg },
  art: { height: 230, alignItems: 'center', justifyContent: 'center' },
  disc: {
    width: 152, height: 152, borderRadius: 76,
    backgroundColor: COLORS.accentSurface,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 6, borderColor: '#FFFFFF',
  },
  title: { ...TYPE.h1, color: COLORS.textPrimary, textAlign: 'center', fontSize: 30 },
  titleAccent: { color: COLORS.primary },
  sub: {
    ...TYPE.bodyLg, color: COLORS.textSecondary,
    textAlign: 'center', marginTop: SPACING.sm, marginBottom: SPACING.xl,
  },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    borderWidth: 1, borderColor: COLORS.border,
  },
  cardHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  planName: { ...TYPE.h4, color: COLORS.textPrimary, fontSize: 17 },
  activePill: {
    backgroundColor: COLORS.accentSurface,
    paddingHorizontal: SPACING.md, paddingVertical: 5, borderRadius: RADIUS.xs,
  },
  activeText: { ...TYPE.smallStrong, color: COLORS.primaryDark },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: SPACING.sm },
  price: { fontSize: 30, fontWeight: '800', color: COLORS.textPrimary },
  period: { ...TYPE.body, color: COLORS.textSecondary, marginLeft: 5 },
  rule: { height: 1, backgroundColor: COLORS.divider, marginVertical: SPACING.lg },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
  metaLabel: { ...TYPE.body, color: COLORS.textSecondary, marginLeft: SPACING.sm },
  metaValue: { ...TYPE.bodyStrong, color: COLORS.textPrimary },

  footer: { marginTop: 'auto', padding: SPACING.xl, paddingBottom: SPACING.xxl },
  manage: { alignSelf: 'center', marginTop: SPACING.md },
});
