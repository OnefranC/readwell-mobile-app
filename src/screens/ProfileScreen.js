import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Switch, SafeAreaView, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPE } from '../theme';
import { Header, Avatar, SecondaryButton, Icon3D } from '../components/ui';
import { useApp } from '../context/AppContext';

export default function ProfileScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const { user, settings } = state;
  const name = user?.name || 'Learner';

  const logout = () => {
    Alert.alert('Log out', 'You can sign back in any time. Your progress is saved.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () => {
          dispatch({ type: 'LOGOUT' });
          navigation.reset({ index: 0, routes: [{ name: 'SignIn' }] });
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.root}>
      <Header
        title="My Profile"
        onBack={() => navigation.goBack()}
        right={
          <Pressable
            onPress={() => navigation.navigate('Settings')}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Settings"
          >
            <Ionicons name="settings-sharp" size={22} color={COLORS.textPrimary} />
          </Pressable>
        }
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.avatarWrap}>
            <View style={styles.dashRing}>
              <Avatar name={name} uri={user?.avatar} size={104} />
            </View>
            <Pressable
              style={styles.camera}
              accessibilityRole="button"
              accessibilityLabel="Change profile photo"
            >
              <Ionicons name="camera" size={15} color={COLORS.textInverse} />
            </Pressable>
          </View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.role}>
            {state.plan === 'pro' ? 'ReadWell Pro Member' : 'Passionate Learner'}
          </Text>
          <SecondaryButton
            title="Edit Profile"
            size="md"
            onPress={() => navigation.navigate('EditProfile')}
            style={styles.editBtn}
          />
        </View>

        {state.isGuest ? (
          <View style={styles.guestCard}>
            <Icon3D name="rocket" size={40} />
            <View style={{ flex: 1, marginLeft: SPACING.md }}>
              <Text style={styles.guestTitle}>Save your progress</Text>
              <Text style={styles.guestMsg}>Create a free account to keep your streak and badges.</Text>
            </View>
          </View>
        ) : null}

        <View style={styles.statsCard}>
          <View style={styles.statsHead}>
            <Ionicons name="stats-chart" size={17} color={COLORS.primary} />
            <Text style={styles.statsTitle}>Total Progress</Text>
          </View>
          <View style={styles.statsRow}>
            <Stat value={state.daysActive} label="DAYS ACTIVE" />
            <View style={styles.vRule} />
            <Stat value={(state.minutesLearned / 60).toFixed(1)} label="HOURS LEARNED" />
            <View style={styles.vRule} />
            <Stat value={state.earnedBadges.length} label="BADGES" />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Preferences</Text>

        <ToggleRow
          icon="volume-high"
          tint={COLORS.primarySurface}
          color={COLORS.primary}
          title="Audio Support"
          subtitle="Read aloud text"
          value={settings.audioSupport}
          onChange={(v) => dispatch({ type: 'UPDATE_SETTINGS', payload: { audioSupport: v } })}
        />
        <ToggleRow
          icon="notifications"
          tint={COLORS.orangeSurface}
          color={COLORS.orange}
          title="Notification Reminders"
          subtitle="Daily goal alerts"
          value={settings.notifications}
          onChange={(v) => dispatch({ type: 'UPDATE_SETTINGS', payload: { notifications: v } })}
        />

        <Text style={styles.sectionTitle}>Account</Text>

        <LinkRow
          icon="trophy-outline"
          title="My Achievements"
          onPress={() => navigation.navigate('Main', { screen: 'Achievements' })}
        />
        <LinkRow
          icon="card-outline"
          title="Manage Subscription"
          value={state.plan === 'pro' ? 'Pro' : 'Free'}
          onPress={() => navigation.navigate('ManageSubscription')}
        />
        <LinkRow
          icon="settings-outline"
          title="Settings"
          onPress={() => navigation.navigate('Settings')}
        />

        <Pressable
          onPress={logout}
          style={styles.logout}
          accessibilityRole="button"
          accessibilityLabel="Log out"
        >
          <Ionicons name="log-out-outline" size={19} color={COLORS.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>

        <Text style={styles.version}>ReadWell v2.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ value, label }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ToggleRow({ icon, tint, color, title, subtitle, value, onChange }) {
  return (
    <View style={styles.row}>
      <View style={[styles.rowIcon, { backgroundColor: tint }]}>
        <Ionicons name={icon} size={19} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        {subtitle ? <Text style={styles.rowSub}>{subtitle}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: COLORS.surfaceSunken, true: COLORS.primary }}
        thumbColor="#FFFFFF"
        accessibilityLabel={title}
      />
    </View>
  );
}

function LinkRow({ icon, title, value, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View style={[styles.rowIcon, { backgroundColor: COLORS.surfaceMuted }]}>
        <Ionicons name={icon} size={19} color={COLORS.textPrimary} />
      </View>
      <Text style={[styles.rowTitle, { flex: 1 }]}>{title}</Text>
      {value ? <Text style={styles.rowValue}>{value}</Text> : null}
      <Ionicons name="chevron-forward" size={19} color={COLORS.textTertiary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingHorizontal: SPACING.xl, paddingBottom: SPACING.huge },

  hero: { alignItems: 'center', paddingVertical: SPACING.lg },
  avatarWrap: { position: 'relative' },
  dashRing: {
    padding: 5, borderRadius: 62,
    borderWidth: 2, borderColor: COLORS.primary, borderStyle: 'dashed',
  },
  camera: {
    position: 'absolute', bottom: 4, right: 4,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2.5, borderColor: COLORS.background,
  },
  name: { ...TYPE.h2, color: COLORS.textPrimary, marginTop: SPACING.md },
  role: { ...TYPE.body, color: COLORS.textSecondary, marginTop: 1 },
  editBtn: { marginTop: SPACING.md, paddingHorizontal: SPACING.xxl, borderRadius: RADIUS.pill },

  guestCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.accentSoft,
    borderRadius: RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.lg,
  },
  guestTitle: { ...TYPE.h4, color: COLORS.textPrimary },
  guestMsg: { ...TYPE.small, color: COLORS.textSecondary, marginTop: 1 },

  statsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    borderWidth: 1, borderColor: COLORS.border,
  },
  statsHead: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  statsTitle: { ...TYPE.h4, color: COLORS.textPrimary },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginTop: SPACING.lg },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { ...TYPE.h2, color: COLORS.primary, fontSize: 26 },
  statLabel: { ...TYPE.caption, color: COLORS.textSecondary, marginTop: 2, fontSize: 10 },
  vRule: { width: 1, height: 38, backgroundColor: COLORS.divider },

  sectionTitle: { ...TYPE.h3, color: COLORS.textPrimary, marginTop: SPACING.xl, marginBottom: SPACING.md },

  row: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1, borderColor: COLORS.border,
  },
  rowIcon: {
    width: 40, height: 40, borderRadius: RADIUS.sm,
    alignItems: 'center', justifyContent: 'center',
  },
  rowTitle: { ...TYPE.bodyStrong, color: COLORS.textPrimary, fontSize: 16 },
  rowSub: { ...TYPE.small, color: COLORS.textSecondary, marginTop: 1 },
  rowValue: { ...TYPE.small, color: COLORS.textSecondary, marginRight: 2 },

  logout: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm,
    marginTop: SPACING.xl, paddingVertical: SPACING.lg,
    backgroundColor: COLORS.errorSurface, borderRadius: RADIUS.md,
  },
  logoutText: { ...TYPE.button, color: COLORS.error },
  version: { ...TYPE.small, color: COLORS.textTertiary, textAlign: 'center', marginTop: SPACING.lg },
});
