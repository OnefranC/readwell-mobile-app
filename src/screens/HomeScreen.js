import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, Pressable, RefreshControl, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPE, SHADOWS, LAYOUT } from '../theme';
import { IMAGES, COURSES, NOTIFICATIONS } from '../constants/data';
import {
  Card, Icon3D, ProgressBar, Chip, Avatar, SectionTitle, Banner,
} from '../components/ui';
import { useApp } from '../context/AppContext';

export default function HomeScreen({ navigation }) {
  const { state, courseProgress, level } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const [activeLang, setActiveLang] = useState('English');

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  }, []);

  const name = state.user?.name || 'Learner';
  const prog = courseProgress(state.activeCourseId);
  const unread = NOTIFICATIONS.filter((n) => n.unread && !state.notificationsRead.includes(n.id)).length;
  const goalPct = Math.min(100, Math.round((state.todayMinutes / state.dailyGoalMinutes) * 100));

  const recommended = COURSES.filter((c) => c.language === activeLang || activeLang === 'All');

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }
      >
        {/* header */}
        <View style={styles.header}>
          <Pressable
            style={styles.headerUser}
            onPress={() => navigation.navigate('Profile')}
            accessibilityRole="button"
            accessibilityLabel="Open profile"
          >
            <Avatar name={name} uri={state.user?.avatar} size={44} />
            <View style={{ marginLeft: SPACING.md }}>
              <Text style={styles.welcomeBack}>Welcome back</Text>
              <Text style={styles.name} numberOfLines={1}>{name}</Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('Notifications')}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={unread ? `Notifications, ${unread} unread` : 'Notifications'}
            style={styles.bell}
          >
            <Ionicons name="notifications-outline" size={25} color={COLORS.textPrimary} />
            {unread > 0 ? <View style={styles.badge} /> : null}
          </Pressable>
        </View>

        {/* search entry */}
        <Pressable
          style={styles.searchBar}
          onPress={() => navigation.navigate('Search')}
          accessibilityRole="search"
          accessibilityLabel="Search lessons, books or topics"
        >
          <Ionicons name="search" size={19} color={COLORS.textTertiary} />
          <Text style={styles.searchPlaceholder}>Search lessons, books, or topics...</Text>
        </Pressable>

        {state.isGuest ? (
          <Banner
            tone="info"
            title="You're browsing as a guest"
            message="Create an account to save your progress."
            action="Sign up"
            onAction={() => navigation.navigate('SignUp')}
            style={{ marginBottom: SPACING.lg }}
          />
        ) : null}

        {/* hero */}
        <Pressable
          style={styles.hero}
          onPress={() => navigation.navigate('CourseDetail', { courseId: 'english' })}
          accessibilityRole="button"
          accessibilityLabel="Unlocking Literacy Excellence"
        >
          <Image source={IMAGES.heroLiteracy} style={styles.heroImg} resizeMode="cover" />
          <View style={styles.heroShade} />
          <View style={styles.heroCopy}>
            <Text style={styles.heroTitle}>Unlocking Literacy Excellence</Text>
            <Text style={styles.heroSub}>Where Every Word Sparks a Journey</Text>
          </View>
        </Pressable>

        {/* stat cards */}
        <View style={styles.statRow}>
          <Card style={styles.statCard} elevation="xs">
            <View style={styles.statHead}>
              <Text style={styles.statLabel}>My Progress</Text>
              <Icon3D name="trophy" size={22} />
            </View>
            <View style={styles.statValueRow}>
              <Text style={styles.statValue}>{prog.percent}%</Text>
              <View style={styles.lvlPill}>
                <Text style={styles.lvlText}>Lvl {level}</Text>
              </View>
            </View>
            <ProgressBar value={prog.percent} height={7} style={{ marginTop: SPACING.sm }} />
            <Text style={styles.statFoot}>{prog.done}/{prog.total} Lessons Completed</Text>
          </Card>

          <Card style={styles.statCard} elevation="xs">
            <View style={styles.statHead}>
              <Text style={styles.statLabelMuted}>Daily Goal</Text>
              <Icon3D name="flame" size={22} />
            </View>
            <View style={styles.statValueRow}>
              <Text style={styles.statValue}>{state.todayMinutes}</Text>
              <Text style={styles.statUnit}> / {state.dailyGoalMinutes} min</Text>
            </View>
            <ProgressBar
              value={goalPct}
              height={7}
              fillColor={COLORS.orange}
              style={{ marginTop: SPACING.sm }}
            />
            <View style={styles.streakPill}>
              <Text style={styles.streakText}>
                {state.streak > 0 ? `${state.streak} Day Streak` : 'Start your streak'}
              </Text>
            </View>
          </Card>
        </View>

        {/* topics */}
        <View style={styles.section}>
          <SectionTitle
            title="Explore Topics"
            actionLabel="See all ›"
            onAction={() => navigation.navigate('Search')}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            {['English', 'Spanish', 'Hindi', 'French', 'Portuguese'].map((l) => (
              <Chip
                key={l}
                label={l}
                onPress={() => setActiveLang(l)}
                tone={activeLang === l ? 'teal' : 'default'}
                style={activeLang === l ? styles.chipActive : undefined}
              />
            ))}
          </ScrollView>
        </View>

        {/* recommended */}
        <View style={styles.section}>
          <SectionTitle
            title="Recommended Books"
            actionLabel="View all"
            onAction={() => navigation.navigate('Search')}
          />
          {recommended.length === 0 ? (
            <Card style={styles.noneCard} elevation="xs">
              <Icon3D name="book" size={44} />
              <Text style={styles.noneTitle}>Nothing here yet</Text>
              <Text style={styles.noneMsg}>
                We have no {activeLang} titles right now. Try another language.
              </Text>
            </Card>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: SPACING.md, paddingRight: SPACING.xl }}
            >
              {recommended.map((c) => (
                <Pressable
                  key={c.id}
                  onPress={() => navigation.navigate('CourseDetail', { courseId: c.id })}
                  accessibilityRole="button"
                  accessibilityLabel={c.title}
                  style={({ pressed }) => [styles.bookCard, SHADOWS.xs, pressed && { opacity: 0.9 }]}
                >
                  <Image source={c.image} style={styles.bookImg} resizeMode="cover" />
                  <View style={styles.bookBody}>
                    <Text style={styles.bookTitle} numberOfLines={2}>{c.title}</Text>
                    <View style={styles.bookMeta}>
                      <Ionicons name="star" size={12} color={COLORS.gold} />
                      <Text style={styles.bookMetaText}>{c.rating}</Text>
                      <Text style={styles.bookDot}>•</Text>
                      <Text style={styles.bookMetaText}>{c.level}</Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingBottom: LAYOUT.tabBarHeight + SPACING.xxl },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl, paddingTop: SPACING.sm, paddingBottom: SPACING.lg,
  },
  headerUser: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  welcomeBack: { ...TYPE.small, color: COLORS.textSecondary },
  name: { ...TYPE.h3, color: COLORS.textPrimary },
  bell: { padding: 4 },
  badge: {
    position: 'absolute', top: 3, right: 3,
    width: 9, height: 9, borderRadius: 5, backgroundColor: COLORS.error,
    borderWidth: 1.5, borderColor: COLORS.background,
  },

  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    marginHorizontal: SPACING.xl, marginBottom: SPACING.lg,
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border,
    paddingHorizontal: SPACING.lg, minHeight: 52,
  },
  searchPlaceholder: { ...TYPE.body, color: COLORS.textTertiary },

  hero: {
    marginHorizontal: SPACING.xl, borderRadius: RADIUS.lg, overflow: 'hidden',
    height: 190, backgroundColor: COLORS.surfaceSunken, marginBottom: SPACING.lg,
  },
  heroImg: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  heroShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,20,26,0.34)',
  },
  heroCopy: { position: 'absolute', left: SPACING.lg, right: SPACING.lg, bottom: SPACING.lg },
  heroTitle: { ...TYPE.h2, color: COLORS.textInverse, fontSize: 22 },
  heroSub: { ...TYPE.small, color: 'rgba(255,255,255,0.92)', marginTop: 2 },

  statRow: { flexDirection: 'row', gap: SPACING.md, paddingHorizontal: SPACING.xl, marginBottom: SPACING.xl },
  statCard: { flex: 1, padding: SPACING.lg, borderRadius: RADIUS.md },
  statHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statLabel: { ...TYPE.smallStrong, color: COLORS.primary },
  statLabelMuted: { ...TYPE.smallStrong, color: COLORS.textSecondary },
  statValueRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: SPACING.md },
  statValue: { fontSize: 27, fontWeight: '800', color: COLORS.textPrimary },
  statUnit: { ...TYPE.small, color: COLORS.textSecondary },
  lvlPill: {
    marginLeft: 'auto', backgroundColor: COLORS.surfaceMuted,
    paddingHorizontal: 9, paddingVertical: 3, borderRadius: RADIUS.pill,
  },
  lvlText: { ...TYPE.caption, color: COLORS.textSecondary },
  statFoot: { ...TYPE.small, color: COLORS.textTertiary, marginTop: 7, fontSize: 11 },
  streakPill: {
    alignSelf: 'flex-start', marginTop: 7,
    backgroundColor: COLORS.orangeSurface,
    paddingHorizontal: 9, paddingVertical: 3, borderRadius: RADIUS.xs,
  },
  streakText: { ...TYPE.caption, color: COLORS.orange },

  section: { paddingHorizontal: SPACING.xl, marginBottom: SPACING.xl },
  chipRow: { gap: SPACING.sm, paddingRight: SPACING.xl },
  chipActive: { backgroundColor: COLORS.primarySurfaceSoft, borderColor: COLORS.primary },

  bookCard: {
    width: 168, backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md, overflow: 'hidden',
  },
  bookImg: { width: '100%', height: 104, backgroundColor: COLORS.surfaceSunken },
  bookBody: { padding: SPACING.md },
  bookTitle: { ...TYPE.smallStrong, color: COLORS.textPrimary, fontSize: 14, lineHeight: 19 },
  bookMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4 },
  bookMetaText: { ...TYPE.small, color: COLORS.textSecondary, fontSize: 12 },
  bookDot: { color: COLORS.textTertiary, fontSize: 12 },

  noneCard: { alignItems: 'center', paddingVertical: SPACING.xxl },
  noneTitle: { ...TYPE.h4, color: COLORS.textPrimary, marginTop: SPACING.md },
  noneMsg: { ...TYPE.small, color: COLORS.textSecondary, textAlign: 'center', marginTop: 4 },
});
