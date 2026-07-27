import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPE, SHADOWS } from '../theme';
import { PLANS } from '../constants/data';
import { Header, PrimaryButton, SecondaryButton, Icon3D } from '../components/ui';
import { useApp } from '../context/AppContext';

export default function PlansScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const isPro = state.plan === 'pro';

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Choose Your Plan" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.headline}>Unlock Your Potential</Text>
        <Text style={styles.sub}>Choose the plan that fits your learning journey.</Text>

        {PLANS.map((plan) => {
          const current = (plan.id === 'pro' && isPro) || (plan.id === 'free' && !isPro);
          return (
            <View
              key={plan.id}
              style={[styles.card, plan.featured && styles.cardFeatured]}
            >
              {plan.featured ? (
                <View style={styles.ribbon}>
                  <Text style={styles.ribbonText}>MOST POPULAR</Text>
                </View>
              ) : null}

              <View style={styles.cardHead}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.planName, plan.featured && { color: COLORS.primary }]}>
                    {plan.name}
                  </Text>
                  <Text style={styles.planSub}>{plan.subtitle}</Text>
                </View>
                <View style={[styles.planIcon, plan.featured && { backgroundColor: COLORS.primarySurface }]}>
                  <Icon3D name={plan.icon3d} size={30} />
                </View>
              </View>

              <View style={styles.priceRow}>
                <Text style={styles.price}>
                  {plan.price === 0 ? '$0' : `$${plan.price}`}
                </Text>
                <Text style={styles.period}>/ {plan.period}</Text>
              </View>

              <View style={styles.features}>
                {plan.features.map((f) => (
                  <View key={f.label} style={styles.featureRow}>
                    <View
                      style={[
                        styles.featureIcon,
                        f.included
                          ? { backgroundColor: plan.featured ? COLORS.primarySurface : COLORS.surfaceMuted }
                          : { backgroundColor: 'transparent' },
                      ]}
                    >
                      <Ionicons
                        name={f.included ? 'checkmark' : 'lock-closed'}
                        size={13}
                        color={
                          f.included
                            ? (plan.featured ? COLORS.primary : COLORS.textSecondary)
                            : COLORS.textTertiary
                        }
                      />
                    </View>
                    <Text style={[styles.featureText, !f.included && styles.featureOff]}>
                      {f.label}
                    </Text>
                  </View>
                ))}
              </View>

              {current ? (
                <View style={styles.currentPill}>
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                  <Text style={styles.currentText}>Your current plan</Text>
                </View>
              ) : plan.id === 'free' ? (
                <SecondaryButton
                  title="Keep free"
                  onPress={() => {
                    dispatch({ type: 'CANCEL_SUBSCRIPTION' });
                    navigation.goBack();
                  }}
                  style={{ marginTop: SPACING.lg }}
                />
              ) : (
                <PrimaryButton
                  title="Go Pro"
                  onPress={() => navigation.navigate('PaymentDetails')}
                  style={{ marginTop: SPACING.lg }}
                />
              )}
            </View>
          );
        })}

        <View style={styles.assure}>
          <Ionicons name="shield-checkmark" size={17} color={COLORS.primary} />
          <Text style={styles.assureText}>
            Cancel anytime. Your progress is always yours to keep.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.xl, paddingBottom: SPACING.huge },
  headline: { ...TYPE.h2, color: COLORS.textPrimary, textAlign: 'center' },
  sub: {
    ...TYPE.body, color: COLORS.textSecondary,
    textAlign: 'center', marginTop: 4, marginBottom: SPACING.xl,
  },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    ...SHADOWS.xs,
  },
  cardFeatured: { borderColor: COLORS.primary },
  ribbon: {
    position: 'absolute', top: -1, right: SPACING.xl,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md, paddingVertical: 5,
    borderBottomLeftRadius: RADIUS.xs, borderBottomRightRadius: RADIUS.xs,
  },
  ribbonText: { ...TYPE.caption, color: COLORS.textInverse, fontSize: 10, letterSpacing: 0.5 },

  cardHead: { flexDirection: 'row', alignItems: 'flex-start' },
  planName: { ...TYPE.h3, color: COLORS.textPrimary },
  planSub: { ...TYPE.small, color: COLORS.textSecondary, marginTop: 2 },
  planIcon: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: COLORS.surfaceMuted,
    alignItems: 'center', justifyContent: 'center',
  },

  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: SPACING.lg },
  price: { fontSize: 36, fontWeight: '800', color: COLORS.textPrimary },
  period: { ...TYPE.body, color: COLORS.textSecondary, marginLeft: 5 },

  features: { marginTop: SPACING.lg, gap: SPACING.md },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  featureIcon: {
    width: 24, height: 24, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  featureText: { ...TYPE.body, color: COLORS.textPrimary },
  featureOff: { color: COLORS.textTertiary },

  currentPill: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm,
    marginTop: SPACING.lg, paddingVertical: SPACING.md,
    backgroundColor: COLORS.successSurface, borderRadius: RADIUS.sm,
  },
  currentText: { ...TYPE.bodyStrong, color: COLORS.success },

  assure: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, justifyContent: 'center' },
  assureText: { ...TYPE.small, color: COLORS.textSecondary, flexShrink: 1 },
});
