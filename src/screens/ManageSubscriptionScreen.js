import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, SafeAreaView, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPE } from '../theme';
import { Header, PrimaryButton, EmptyState } from '../components/ui';
import { useApp } from '../context/AppContext';

export default function ManageSubscriptionScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const isPro = state.plan === 'pro';
  const method = state.paymentMethods[0];

  const nextBilling = state.subscription?.nextBilling
    ? new Date(state.subscription.nextBilling).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric', year: 'numeric',
      })
    : '—';

  const cancel = () => {
    Alert.alert(
      'Cancel subscription?',
      `You'll keep Pro access until ${nextBilling}, then move to the Free plan.`,
      [
        { text: 'Keep Pro', style: 'cancel' },
        {
          text: 'Cancel Pro',
          style: 'destructive',
          onPress: () => dispatch({ type: 'CANCEL_SUBSCRIPTION' }),
        },
      ]
    );
  };

  if (!isPro) {
    return (
      <SafeAreaView style={styles.root}>
        <Header title="Manage Subscription" onBack={() => navigation.goBack()} />
        <EmptyState
          icon3d="crown"
          title="You're on the Free plan"
          message="Upgrade to Pro for unlimited books, offline mode and audio narration."
          action="See plans"
          onAction={() => navigation.navigate('Plans')}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Manage Subscription" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionRow}>
          <View style={styles.starDot}>
            <Ionicons name="star" size={13} color={COLORS.textInverse} />
          </View>
          <Text style={styles.sectionTitle}>Current Plan</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.planPill}>
            <Text style={styles.planPillText}>ReadWell Pro</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.price}>$9.99</Text>
            <Text style={styles.period}>/month</Text>
          </View>
          <View style={styles.rule} />
          <Text style={styles.label}>Next Billing Date</Text>
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={17} color={COLORS.textPrimary} />
            <Text style={styles.date}>{nextBilling}</Text>
          </View>
        </View>

        <View style={styles.sectionRow}>
          <Ionicons name="wallet" size={19} color={COLORS.accentDark} />
          <Text style={styles.sectionTitle}>Payment Method</Text>
        </View>

        <View style={styles.methodCard}>
          <View style={styles.methodIcon}>
            <Ionicons name="card" size={21} color={COLORS.accentDark} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.methodNum}>•••• {method?.last4 || '1234'}</Text>
            <Text style={styles.methodSub}>
              {method?.brand || 'Visa'} ending in {method?.last4 || '1234'}
            </Text>
          </View>
          <Pressable
            onPress={() => navigation.navigate('PaymentDetails')}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Edit payment method"
          >
            <Text style={styles.edit}>Edit</Text>
          </Pressable>
        </View>

        <PrimaryButton
          title="Change Plan"
          onPress={() => navigation.navigate('Plans')}
          style={{ marginTop: SPACING.xl }}
        />

        <Pressable
          onPress={cancel}
          style={styles.cancel}
          accessibilityRole="button"
          accessibilityLabel="Cancel subscription"
        >
          <Text style={styles.cancelText}>Cancel Subscription</Text>
        </Pressable>

        <View style={styles.note}>
          <Ionicons name="information-circle-outline" size={16} color={COLORS.textTertiary} />
          <Text style={styles.noteText}>
            Cancelling keeps Pro active until the end of the current billing period.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingHorizontal: SPACING.xl, paddingBottom: SPACING.huge },

  sectionRow: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    marginBottom: SPACING.md, marginTop: SPACING.lg,
  },
  starDot: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: COLORS.accentDark,
    alignItems: 'center', justifyContent: 'center',
  },
  sectionTitle: { ...TYPE.h3, color: COLORS.textPrimary, fontSize: 20 },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.xl,
    borderWidth: 1, borderColor: COLORS.border,
  },
  planPill: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.accentSurface,
    paddingHorizontal: SPACING.lg, paddingVertical: 7,
    borderRadius: RADIUS.pill,
  },
  planPillText: { ...TYPE.bodyStrong, color: COLORS.primaryDark },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: SPACING.md },
  price: { fontSize: 34, fontWeight: '800', color: COLORS.textPrimary },
  period: { ...TYPE.body, color: COLORS.textSecondary, marginLeft: 4 },
  rule: { height: 1, backgroundColor: COLORS.divider, marginVertical: SPACING.lg },
  label: { ...TYPE.small, color: COLORS.textSecondary },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: 6 },
  date: { ...TYPE.h4, color: COLORS.textPrimary, fontSize: 18 },

  methodCard: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md, padding: SPACING.lg,
    borderWidth: 1, borderColor: COLORS.border,
  },
  methodIcon: {
    width: 44, height: 44, borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceMuted,
    alignItems: 'center', justifyContent: 'center',
  },
  methodNum: { ...TYPE.h4, color: COLORS.textPrimary, fontSize: 18 },
  methodSub: { ...TYPE.small, color: COLORS.textSecondary, marginTop: 1 },
  edit: { ...TYPE.bodyStrong, color: COLORS.accentDark },

  cancel: { alignSelf: 'center', marginTop: SPACING.lg, padding: SPACING.md },
  cancelText: { ...TYPE.bodyStrong, color: COLORS.error },

  note: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.sm, alignItems: 'flex-start' },
  noteText: { ...TYPE.small, color: COLORS.textTertiary, flex: 1 },
});
