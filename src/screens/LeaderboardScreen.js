import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPE, SHADOWS } from '../theme';
import { LEADERBOARD } from '../constants/data';
import { Header, Avatar } from '../components/ui';
import { useApp } from '../context/AppContext';

const MEDALS = [COLORS.medalGold, COLORS.medalSilver, COLORS.medalBronze];

export default function LeaderboardScreen({ navigation }) {
  const { state } = useApp();
  const [tab, setTab] = useState('all');

  const rows = useMemo(() => {
    const base = LEADERBOARD.map((u) =>
      u.isMe
        ? { ...u, name: `${state.user?.name || 'You'} (You)`, xp: state.xp || u.xp }
        : u
    );
    const scaled = tab === 'weekly'
      ? base.map((u) => ({ ...u, xp: Math.round(u.xp * 0.18) }))
      : base;
    return [...scaled].sort((a, b) => b.xp - a.xp);
  }, [tab, state.xp, state.user]);

  const myRank = rows.findIndex((r) => r.isMe) + 1;

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Leaderboard" onBack={() => navigation.goBack()} />

      <View style={styles.tabs}>
        {[['weekly', 'Weekly'], ['all', 'All Time']].map(([id, label]) => (
          <Pressable
            key={id}
            onPress={() => setTab(id)}
            style={[styles.tab, tab === id && styles.tabActive]}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === id }}
          >
            <Text style={[styles.tabText, tab === id && styles.tabTextActive]}>{label}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {rows.map((u, i) => {
          const rank = i + 1;
          const medal = rank <= 3 ? MEDALS[rank - 1] : null;
          return (
            <View
              key={u.id}
              style={[
                styles.row,
                medal && { borderBottomColor: medal, borderBottomWidth: 2 },
                u.isMe && styles.rowMe,
              ]}
              accessible
              accessibilityLabel={`Rank ${rank}, ${u.name}, ${u.xp.toLocaleString()} XP`}
            >
              <View style={styles.rankCol}>
                {medal ? (
                  <Ionicons name="trophy" size={26} color={medal} />
                ) : (
                  <Text style={[styles.rankNum, u.isMe && { color: COLORS.accentDark }]}>{rank}</Text>
                )}
              </View>

              <Avatar
                name={u.name}
                size={52}
                ring
                ringColor={medal || (u.isMe ? COLORS.accentDark : COLORS.border)}
              />

              <View style={styles.nameCol}>
                <Text style={[styles.name, u.isMe && styles.nameMe]} numberOfLines={1}>
                  {u.name}
                </Text>
                {u.tagline ? <Text style={styles.tagline} numberOfLines={1}>{u.tagline}</Text> : null}
              </View>

              <View style={styles.xpCol}>
                <Text style={[styles.xp, (rank <= 3 || u.isMe) && { color: COLORS.accentDark }]}>
                  {u.xp.toLocaleString()}
                </Text>
                <Text style={styles.xpLabel}>XP</Text>
              </View>
            </View>
          );
        })}

        <View style={styles.footNote}>
          <Ionicons name="information-circle-outline" size={16} color={COLORS.textTertiary} />
          <Text style={styles.footText}>
            You're ranked #{myRank || '—'} {tab === 'weekly' ? 'this week' : 'of all time'}. Keep learning to climb!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: SPACING.xl,
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: RADIUS.md,
    padding: 5,
    marginBottom: SPACING.lg,
  },
  tab: { flex: 1, paddingVertical: 11, borderRadius: RADIUS.sm, alignItems: 'center' },
  tabActive: { backgroundColor: COLORS.accent },
  tabText: { ...TYPE.bodyStrong, color: COLORS.textSecondary },
  tabTextActive: { color: COLORS.textInverse },

  scroll: { paddingHorizontal: SPACING.xl, paddingBottom: SPACING.huge },
  row: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    gap: SPACING.md,
    ...SHADOWS.xs,
  },
  rowMe: {
    borderWidth: 2,
    borderColor: COLORS.accentDark,
    backgroundColor: COLORS.accentSoft,
  },
  rankCol: { width: 30, alignItems: 'center' },
  rankNum: { ...TYPE.h4, color: COLORS.textSecondary },
  nameCol: { flex: 1 },
  name: { ...TYPE.h4, color: COLORS.textPrimary },
  nameMe: { color: COLORS.textPrimary },
  tagline: { ...TYPE.small, color: COLORS.textSecondary, marginTop: 1 },
  xpCol: { alignItems: 'flex-end' },
  xp: { ...TYPE.h4, color: COLORS.textPrimary },
  xpLabel: { ...TYPE.caption, color: COLORS.textSecondary },

  footNote: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    marginTop: SPACING.md, paddingHorizontal: SPACING.xs,
  },
  footText: { ...TYPE.small, color: COLORS.textTertiary, flex: 1 },
});
