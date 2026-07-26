import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/colors';
import { LESSONS } from '../constants/data';
import { LESSON_CONTENT } from '../constants/lessons';
import { ProgressCard } from '../components/Card';
import { useApp } from '../context/AppContext';

export default function ProgressScreen() {
  const { state } = useApp();
  const { progress } = state;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, [fadeAnim]);

  const completedCount = progress.completedLessons.length;
  const totalWords = LESSONS.reduce((sum, l) => {
    const content = LESSON_CONTENT[l.id];
    return sum + (content?.topics?.reduce((s, t) => s + (t.words?.length || 0), 0) || 0);
  }, 0);
  const wordsPercent = totalWords > 0 ? Math.round((progress.wordsLearned / totalWords) * 100) : 0; void wordsPercent;

  const achievements = [
    { icon: 'star', title: 'First Lesson', earned: completedCount >= 1 },
    { icon: 'flame', title: '3 Day Streak', earned: progress.streak >= 3 },
    { icon: 'trophy', title: '5 Lessons', earned: completedCount >= 5 },
    { icon: 'ribbon', title: '100 Words', earned: progress.wordsLearned >= 100 },
  ];

  const weeklyData = [
    { day: 'Mon', minutes: progress.lastActiveDate ? Math.floor(Math.random() * 20 + 5) : 0 },
    { day: 'Tue', minutes: progress.lastActiveDate ? Math.floor(Math.random() * 25 + 5) : 0 },
    { day: 'Wed', minutes: progress.lastActiveDate ? Math.floor(Math.random() * 15 + 5) : 0 },
    { day: 'Thu', minutes: progress.lastActiveDate ? Math.floor(Math.random() * 30 + 5) : 0 },
    { day: 'Fri', minutes: 0 },
    { day: 'Sat', minutes: 0 },
    { day: 'Sun', minutes: 0 },
  ];
  const maxMinutes = Math.max(...weeklyData.map((d) => d.minutes), 1);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <Text style={styles.title}>Progress</Text>
        </Animated.View>

        <Animated.View style={[styles.statsGrid, { opacity: fadeAnim }]}>
          <View style={styles.statsRow}>
            <ProgressCard value={completedCount} label="Completed" icon="checkmark-circle-outline" color={COLORS.success} />
            <ProgressCard value={progress.streak} label="Day Streak" icon="flame-outline" color={COLORS.secondary} />
          </View>
          <View style={styles.statsRow}>
            <ProgressCard value={progress.wordsLearned} label="Words" icon="text-outline" color={COLORS.primary} />
            <ProgressCard value={`${progress.timeSpent}m`} label="Time Spent" icon="time-outline" color="#8B5CF6" />
          </View>
        </Animated.View>

        <Animated.View style={[styles.chartSection, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <View style={[styles.chartCard, SHADOWS.md]}>
            <View style={styles.chart}>
              {weeklyData.map((data, index) => (
                <View key={index} style={styles.chartBar}>
                  <View style={styles.barContainer}>
                    <View style={[styles.bar, { height: `${(data.minutes / maxMinutes) * 100}%`, backgroundColor: data.minutes > 0 ? COLORS.primary : COLORS.border }]} />
                  </View>
                  <Text style={styles.barLabel}>{data.day}</Text>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[styles.achievementsSection, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsGrid}>
            {achievements.map((achievement, index) => (
              <View key={index} style={[styles.achievementItem, !achievement.earned && styles.achievementLocked]}>
                <View style={[styles.achievementIcon, !achievement.earned && styles.achievementIconLocked]}>
                  <Ionicons name={achievement.icon} size={28} color={achievement.earned ? COLORS.secondary : COLORS.textTertiary} />
                </View>
                <Text style={[styles.achievementTitle, !achievement.earned && styles.achievementTitleLocked]}>
                  {achievement.title}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingBottom: 100 },
  header: { paddingHorizontal: SPACING.xxl, paddingTop: SPACING.xxxxxl, paddingBottom: SPACING.xl },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.textPrimary },
  statsGrid: { paddingHorizontal: SPACING.xxl, gap: SPACING.sm, marginBottom: SPACING.xxxl },
  statsRow: { flexDirection: 'row', gap: SPACING.sm },
  chartSection: { paddingHorizontal: SPACING.xxl, marginBottom: SPACING.xxxl },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.lg },
  chartCard: { backgroundColor: COLORS.surfaceElevated, borderRadius: RADIUS.lg, padding: SPACING.lg },
  chart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 140 },
  chartBar: { flex: 1, alignItems: 'center', gap: SPACING.sm },
  barContainer: { flex: 1, width: 24, justifyContent: 'flex-end' },
  bar: { width: '100%', borderRadius: 4, minHeight: 4 },
  barLabel: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '500' },
  achievementsSection: { paddingHorizontal: SPACING.xxl },
  achievementsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md },
  achievementItem: { width: '47%', backgroundColor: COLORS.surfaceElevated, borderRadius: RADIUS.lg, padding: SPACING.lg, alignItems: 'center', ...SHADOWS.sm },
  achievementLocked: { opacity: 0.6 },
  achievementIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.secondarySurface, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.md },
  achievementIconLocked: { backgroundColor: COLORS.surface },
  achievementTitle: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, textAlign: 'center' },
  achievementTitleLocked: { color: COLORS.textTertiary },
});
