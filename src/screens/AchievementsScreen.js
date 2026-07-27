import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPE, LAYOUT } from '../theme';
import { BADGES } from '../constants/data';
import { Icon3D, Avatar, Card } from '../components/ui';
import { useApp } from '../context/AppContext';

export default function AchievementsScreen({ navigation }) {
  const { state, level } = useApp();
  const name = state.user?.name || 'Learner';
  const earned = state.earnedBadges;

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>My Achievements</Text>

        {/* profile summary */}
        <View style={styles.hero}>
          <View style={styles.avatarWrap}>
            <Avatar name={name} uri={state.user?.avatar} size={92} ring ringColor={COLORS.surface} />
            <View style={styles.lvlBadge}>
              <Text style={styles.lvlText}>Lvl {level}</Text>
            </View>
          </View>
          <Text style={styles.heroName}>{name}</Text>
          <Text style={styles.heroSub}>
            {state.daysActive > 0 ? `Learning for ${state.daysActive} days` : 'Just getting started'}
          </Text>

          <View style={styles.scoreRow}>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>Total Score</Text>
              <View style={styles.scoreValRow}>
                <Ionicons name="star" size={16} color={COLORS.primary} />
                <Text style={styles.scoreVal}>{state.xp.toLocaleString()}</Text>
              </View>
            </View>
            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>Current Streak</Text>
              <View style={styles.scoreValRow}>
                <Ionicons name="flame" size={16} color={COLORS.orange} />
                <Text style={[styles.scoreVal, { color: COLORS.orange }]}>
                  {state.streak} {state.streak === 1 ? 'Day' : 'Days'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* leaderboard entry */}
        <Card
          style={styles.leaderCard}
          elevation="xs"
          onPress={() => navigation.navigate('Leaderboard')}
          accessibilityLabel="Open leaderboard"
        >
          <Icon3D name="trophy" size={38} />
          <View style={{ flex: 1, marginLeft: SPACING.md }}>
            <Text style={styles.leaderTitle}>Leaderboard</Text>
            <Text style={styles.leaderSub}>See how you rank this week</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textTertiary} />
        </Card>

        {/* badges */}
        <View style={styles.badgeHead}>
          <Text style={styles.sectionTitle}>Badges</Text>
          <Text style={styles.badgeCount}>{earned.length}/{BADGES.length} Earned</Text>
        </View>

        <View style={styles.badgeGrid}>
          {BADGES.map((b) => {
            const has = earned.includes(b.id);
            return (
              <View
                key={b.id}
                style={[styles.badge, !has && styles.badgeLocked]}
                accessible
                accessibilityLabel={
                  has ? `${b.title}, earned` : `${b.title}, locked. ${b.requirement}`
                }
              >
                <View style={[styles.badgeIcon, { backgroundColor: has ? b.tint : COLORS.surfaceMuted }]}>
                  <Icon3D name={has ? b.icon3d : 'lock'} size={34} dimmed={!has} />
                </View>
                <Text style={[styles.badgeTitle, !has && { color: COLORS.textTertiary }]} numberOfLines={2}>
                  {b.title}
                </Text>
                {!has ? <Text style={styles.badgeReq} numberOfLines={2}>{b.requirement}</Text> : null}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.xl, paddingBottom: LAYOUT.tabBarHeight + SPACING.xxl },
  title: { ...TYPE.h1, color: COLORS.textPrimary, fontSize: 26, marginBottom: SPACING.lg },

  hero: {
    backgroundColor: COLORS.primarySurface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
  },
  avatarWrap: { alignItems: 'center' },
  lvlBadge: {
    position: 'absolute', bottom: -6, alignSelf: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md, paddingVertical: 3,
    borderRadius: RADIUS.pill,
    borderWidth: 2, borderColor: COLORS.primarySurface,
  },
  lvlText: { ...TYPE.caption, color: COLORS.textInverse },
  heroName: { ...TYPE.h2, color: COLORS.textPrimary, marginTop: SPACING.lg },
  heroSub: { ...TYPE.body, color: COLORS.textSecondary, marginTop: 2 },
  scoreRow: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.lg, width: '100%' },
  scoreCard: {
    flex: 1, backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md, padding: SPACING.lg, alignItems: 'center',
  },
  scoreLabel: { ...TYPE.small, color: COLORS.textSecondary },
  scoreValRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 },
  scoreVal: { ...TYPE.h3, color: COLORS.primary },

  leaderCard: { flexDirection: 'row', alignItems: 'center', marginTop: SPACING.lg },
  leaderTitle: { ...TYPE.h4, color: COLORS.textPrimary },
  leaderSub: { ...TYPE.small, color: COLORS.textSecondary, marginTop: 1 },

  badgeHead: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: SPACING.xl, marginBottom: SPACING.md,
  },
  sectionTitle: { ...TYPE.h3, color: COLORS.textPrimary },
  badgeCount: { ...TYPE.small, color: COLORS.textSecondary },

  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md },
  badge: {
    width: '30.9%',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  badgeLocked: {
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: RADIUS.md,
  },
  badgeIcon: {
    width: 66, height: 66, borderRadius: 33,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  badgeTitle: { ...TYPE.caption, color: COLORS.textPrimary, textAlign: 'center', fontSize: 12 },
  badgeReq: { ...TYPE.caption, color: COLORS.textTertiary, textAlign: 'center', fontSize: 10, marginTop: 2, fontWeight: '400' },
});
