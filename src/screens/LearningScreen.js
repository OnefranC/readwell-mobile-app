import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, Pressable, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPE, SHADOWS, LAYOUT } from '../theme';
import { COURSES, NOTIFICATIONS } from '../constants/data';
import { ProgressBar, EmptyState, Chip, PrimaryButton } from '../components/ui';
import { useApp } from '../context/AppContext';

const TRACK_TINT = {
  english: COLORS.primary,
  spanish: '#F87171',
  writing: '#3B82F6',
  swahili: COLORS.accentDark,
};

export default function LearningScreen({ navigation }) {
  const { state, courseProgress } = useApp();

  // "in progress" = has at least one completed lesson, or is the active course
  const inProgress = COURSES.filter((c) => {
    const p = courseProgress(c.id);
    return p.done > 0 || c.id === state.activeCourseId;
  });

  const unread = NOTIFICATIONS.filter(
    (n) => n.unread && !state.notificationsRead.includes(n.id)
  ).length;

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>My Learning Path</Text>
        <Pressable
          onPress={() => navigation.navigate('Notifications')}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Notifications"
        >
          <Ionicons name="notifications-outline" size={25} color={COLORS.textPrimary} />
          {unread > 0 ? <View style={styles.badge} /> : null}
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.sub}>Continue where you left off</Text>

        {inProgress.length === 0 ? (
          <EmptyState
            icon3d="rocket"
            title="No courses yet"
            message="Pick a course and your progress will show up here."
            action="Browse courses"
            onAction={() => navigation.navigate('Search')}
          />
        ) : (
          inProgress.map((c) => {
            const p = courseProgress(c.id);
            return (
              <View key={c.id} style={[styles.card, SHADOWS.xs]}>
                <View style={styles.cardTop}>
                  <Image source={c.image} style={styles.thumb} resizeMode="cover" />
                  <View style={styles.cardBody}>
                    <Text style={styles.cardTitle} numberOfLines={1}>{c.title}</Text>
                    <Text style={styles.cardMeta}>
                      Lesson {Math.max(1, p.done)} • {c.level}
                    </Text>
                    <Text style={styles.cardPct}>{p.percent}% Complete</Text>
                    <ProgressBar
                      value={p.percent}
                      height={7}
                      fillColor={TRACK_TINT[c.id] || COLORS.primary}
                      style={{ marginTop: 7 }}
                    />
                  </View>
                </View>
                <PrimaryButton
                  title={p.done > 0 ? 'Resume' : 'Start'}
                  size="md"
                  onPress={() => navigation.navigate('Curriculum', { courseId: c.id })}
                  style={{ marginTop: SPACING.md }}
                />
              </View>
            );
          })
        )}

        <Text style={styles.sectionTitle}>Available Languages</Text>
        <View style={styles.langWrap}>
          {['English', 'Spanish', 'Hindi', 'French', 'Portuguese', 'Mandarin', 'Russian', 'Swahili']
            .map((l) => (
              <Chip
                key={l}
                label={l}
                tone={l === 'English' ? 'teal' : 'default'}
                onPress={() => navigation.navigate('Search')}
                style={l === 'English' ? styles.langActive : undefined}
              />
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl, paddingTop: SPACING.sm, paddingBottom: SPACING.xs,
  },
  title: { ...TYPE.h1, color: COLORS.textPrimary, fontSize: 26 },
  badge: {
    position: 'absolute', top: -1, right: -1,
    width: 9, height: 9, borderRadius: 5, backgroundColor: COLORS.error,
    borderWidth: 1.5, borderColor: COLORS.background,
  },
  scroll: { paddingHorizontal: SPACING.xl, paddingBottom: LAYOUT.tabBarHeight + SPACING.xxl },
  sub: { ...TYPE.body, color: COLORS.textSecondary, marginBottom: SPACING.lg },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  cardTop: { flexDirection: 'row', gap: SPACING.md },
  thumb: {
    width: 92, height: 92, borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceSunken,
  },
  cardBody: { flex: 1, justifyContent: 'center' },
  cardTitle: { ...TYPE.h4, color: COLORS.textPrimary },
  cardMeta: { ...TYPE.small, color: COLORS.textSecondary, marginTop: 2 },
  cardPct: { ...TYPE.small, color: COLORS.textSecondary, marginTop: 2 },

  sectionTitle: { ...TYPE.h3, color: COLORS.textPrimary, marginTop: SPACING.xl, marginBottom: SPACING.md },
  langWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  langActive: { backgroundColor: COLORS.primarySurfaceSoft, borderColor: COLORS.primary },
});
