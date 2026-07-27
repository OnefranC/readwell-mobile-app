import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Switch, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPE } from '../theme';
import { Header, Icon3D } from '../components/ui';
import { useApp } from '../context/AppContext';

const TEXT_SIZES = ['Small', 'Medium', 'Large', 'Extra Large'];

export default function SettingsScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const s = state.settings;
  const set = (patch) => dispatch({ type: 'UPDATE_SETTINGS', payload: patch });

  const cycleTextSize = () => {
    const i = TEXT_SIZES.indexOf(s.textSize);
    set({ textSize: TEXT_SIZES[(i + 1) % TEXT_SIZES.length] });
  };

  const expiry = state.subscription?.nextBilling
    ? new Date(state.subscription.nextBilling).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric', year: 'numeric',
      })
    : '—';

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Settings" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* accessibility */}
        <Section icon="accessibility" title="Accessibility" />
        <View style={styles.group}>
          <Row
            icon="volume-high"
            title="Read Aloud"
            subtitle="Hear text spoken"
            right={
              <Switch
                value={s.readAloud}
                onValueChange={(v) => set({ readAloud: v })}
                trackColor={{ false: COLORS.surfaceSunken, true: COLORS.primary }}
                thumbColor="#FFFFFF"
                accessibilityLabel="Read aloud"
              />
            }
          />
          <Divider />
          <Row
            icon="contrast"
            title="High Contrast"
            subtitle="Clearer colors"
            right={
              <Switch
                value={s.highContrast}
                onValueChange={(v) => set({ highContrast: v })}
                trackColor={{ false: COLORS.surfaceSunken, true: COLORS.primary }}
                thumbColor="#FFFFFF"
                accessibilityLabel="High contrast"
              />
            }
          />
          <Divider />
          <Row
            icon="text"
            title="Text Size"
            onPress={cycleTextSize}
            right={
              <View style={styles.valueRow}>
                <Text style={styles.value}>{s.textSize}</Text>
                <Ionicons name="chevron-forward" size={18} color={COLORS.textTertiary} />
              </View>
            }
          />
        </View>

        {/* notifications */}
        <Section icon="notifications" title="Notifications" />
        <View style={styles.group}>
          <Row
            icon="notifications-outline"
            title="Daily Reminder"
            right={
              <Switch
                value={s.dailyReminder}
                onValueChange={(v) => set({ dailyReminder: v })}
                trackColor={{ false: COLORS.surfaceSunken, true: COLORS.accent }}
                thumbColor="#FFFFFF"
                accessibilityLabel="Daily reminder"
              />
            }
          />
          <Divider />
          <Row
            icon="time-outline"
            title="Time"
            disabled={!s.dailyReminder}
            right={
              <View style={[styles.timePill, !s.dailyReminder && { opacity: 0.4 }]}>
                <Text style={styles.timeText}>{s.reminderTime}</Text>
              </View>
            }
          />
        </View>

        {/* subscription */}
        <Section icon="card" title="Subscription" />
        <View style={styles.group}>
          <Pressable
            onPress={() => navigation.navigate('ManageSubscription')}
            style={({ pressed }) => [styles.subRow, pressed && { opacity: 0.8 }]}
            accessibilityRole="button"
            accessibilityLabel="Manage subscription"
          >
            <View style={styles.subIcon}>
              <Icon3D name={state.plan === 'pro' ? 'crown' : 'book'} size={26} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.subLabel}>Current Plan</Text>
              <View style={styles.planPill}>
                <Text style={styles.planPillText}>
                  {state.plan === 'pro' ? 'ReadWell Pro' : 'ReadWell Free'}
                </Text>
              </View>
            </View>
            {state.plan === 'pro' ? (
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.subLabel}>Expiry Date</Text>
                <Text style={styles.subValue}>{expiry}</Text>
              </View>
            ) : (
              <Ionicons name="chevron-forward" size={19} color={COLORS.textTertiary} />
            )}
          </Pressable>
        </View>

        {/* about */}
        <Section icon="information-circle" title="About" />
        <View style={styles.group}>
          <Row icon="document-text-outline" title="Terms of Service" chevron />
          <Divider />
          <Row icon="shield-checkmark-outline" title="Privacy Policy" chevron />
          <Divider />
          <Row icon="help-circle-outline" title="Help & Support" chevron />
        </View>

        <Text style={styles.version}>ReadWell v2.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ icon, title }) {
  return (
    <View style={styles.sectionRow}>
      <Ionicons name={icon} size={19} color={COLORS.textPrimary} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function Row({ icon, title, subtitle, right, onPress, chevron, disabled }) {
  const body = (
    <View style={[styles.row, disabled && { opacity: 0.55 }]}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={19} color={COLORS.textPrimary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle} numberOfLines={1}>{title}</Text>
        {subtitle ? <Text style={styles.rowSub} numberOfLines={1}>{subtitle}</Text> : null}
      </View>
      {right}
      {chevron ? <Ionicons name="chevron-forward" size={19} color={COLORS.textTertiary} /> : null}
    </View>
  );
  if (!onPress) return body;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => pressed && { opacity: 0.75 }}
    >
      {body}
    </Pressable>
  );
}

const Divider = () => <View style={styles.divider} />;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingHorizontal: SPACING.xl, paddingBottom: SPACING.huge },

  sectionRow: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    marginTop: SPACING.xl, marginBottom: SPACING.md,
  },
  sectionTitle: { ...TYPE.h3, color: COLORS.textPrimary, fontSize: 19 },

  group: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1, borderColor: COLORS.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    padding: SPACING.md, minHeight: 66,
  },
  rowIcon: {
    width: 40, height: 40, borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceMuted,
    alignItems: 'center', justifyContent: 'center',
  },
  rowTitle: { ...TYPE.h4, color: COLORS.textPrimary, fontSize: 17 },
  rowSub: { ...TYPE.small, color: COLORS.textSecondary, marginTop: 1 },
  divider: { height: 1, backgroundColor: COLORS.divider, marginLeft: 68 },

  valueRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  value: { ...TYPE.body, color: COLORS.textSecondary },
  timePill: {
    backgroundColor: COLORS.surfaceMuted,
    paddingHorizontal: SPACING.lg, paddingVertical: 9, borderRadius: RADIUS.xs,
  },
  timeText: { ...TYPE.bodyStrong, color: COLORS.textPrimary },

  subRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.md },
  subIcon: {
    width: 44, height: 44, borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceMuted,
    alignItems: 'center', justifyContent: 'center',
  },
  subLabel: { ...TYPE.small, color: COLORS.textSecondary },
  subValue: { ...TYPE.bodyStrong, color: COLORS.textPrimary, marginTop: 2 },
  planPill: {
    alignSelf: 'flex-start', marginTop: 4,
    backgroundColor: COLORS.accentSurface,
    paddingHorizontal: SPACING.md, paddingVertical: 4, borderRadius: RADIUS.pill,
  },
  planPillText: { ...TYPE.smallStrong, color: COLORS.primaryDark },

  version: { ...TYPE.small, color: COLORS.textTertiary, textAlign: 'center', marginTop: SPACING.xl },
});
