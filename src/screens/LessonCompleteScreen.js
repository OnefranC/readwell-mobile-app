import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPE } from '../theme';
import { CURRICULUM } from '../constants/data';
import { PrimaryButton, SecondaryButton, Icon3D } from '../components/ui';
import AchievementModal from '../components/AchievementModal';
import { useApp } from '../context/AppContext';

const CONFETTI = [
  { x: 0.16, y: 0.14, c: '#F87171', s: 11, r: 3 },
  { x: 0.78, y: 0.10, c: '#F5B921', s: 15, r: 3 },
  { x: 0.86, y: 0.30, c: '#60A5FA', s: 10, r: 5 },
  { x: 0.10, y: 0.34, c: '#F5B921', s: 13, r: 3 },
  { x: 0.70, y: 0.42, c: '#2DD4BF', s: 9, r: 4 },
  { x: 0.26, y: 0.44, c: '#A78BFA', s: 11, r: 5 },
];

export default function LessonCompleteScreen({ route, navigation }) {
  const { courseId = 'english', moduleId, lessonId, correct = 0, total = 0 } = route.params || {  };
  const { state, nextLesson } = useApp();

  const pop = useRef(new Animated.Value(0.6)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const [showBadge, setShowBadge] = useState(false);

  const pct = total > 0 ? Math.round((correct / total) * 100) : 100;
  const name = state.user?.name?.split(' ')[0] || 'friend';
  const lesson = CURRICULUM[courseId]?.modules
    .find((m) => m.id === moduleId)?.lessons.find((l) => l.id === lessonId);
  const upNext = nextLesson(courseId);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(pop, { toValue: 1, tension: 60, friction: 6, useNativeDriver: true }),
      Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();

    // first lesson ever → celebrate with the achievement modal
    const firstEver = state.earnedBadges.includes('first-word')
      && Object.values(state.completedLessons).flat().length <= 1;
    if (firstEver) {
      const t = setTimeout(() => setShowBadge(true), 700);
      return () => clearTimeout(t);
    }
  }, [pop, fade, state.earnedBadges, state.completedLessons]);

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.top}>
        {CONFETTI.map((c, i) => (
          <Animated.View
            key={i}
            style={[
              styles.confetti,
              {
                left: `${c.x * 100}%`,
                top: `${c.y * 100}%`,
                width: c.s, height: c.s, borderRadius: c.r,
                backgroundColor: c.c,
                opacity: fade,
              },
            ]}
          />
        ))}

        <Animated.View style={[styles.trophyRing, { transform: [{ scale: pop }] }]}>
          <Icon3D name="trophy" size={96} />
        </Animated.View>
      </View>

      <Animated.View style={[styles.body, { opacity: fade }]}>
        <Text style={styles.title}>Great Job, {name}!</Text>
        <Text style={styles.sub}>
          You finished {lesson ? lesson.title.replace(/^Lesson /, 'Lesson ') : 'this lesson'}
        </Text>
        {lesson?.letter ? (
          <Text style={styles.lessonName}>The Letter {lesson.letter}</Text>
        ) : null}

        <View style={styles.stats}>
          <View style={styles.stat}>
            <View style={[styles.statIcon, { backgroundColor: COLORS.successSurface }]}>
              <Ionicons name="checkmark-circle" size={22} color={COLORS.success} />
            </View>
            <Text style={styles.statVal}>{pct}%</Text>
            <Text style={styles.statLabel}>CORRECT</Text>
          </View>
          <View style={styles.stat}>
            <View style={[styles.statIcon, { backgroundColor: COLORS.infoSurface }]}>
              <Ionicons name="timer-outline" size={22} color={COLORS.info} />
            </View>
            <Text style={styles.statVal}>5m</Text>
            <Text style={styles.statLabel}>TIME</Text>
          </View>
          <View style={styles.stat}>
            <View style={[styles.statIcon, { backgroundColor: COLORS.warningSurface }]}>
              <Ionicons name="star" size={22} color={COLORS.gold} />
            </View>
            <Text style={styles.statVal}>+{50 + (pct === 100 ? 100 : 0)}</Text>
            <Text style={styles.statLabel}>XP</Text>
          </View>
        </View>
      </Animated.View>

      <View style={styles.footer}>
        <PrimaryButton
          title={upNext ? 'Continue to Lesson' : 'Back to Curriculum'}
          icon="thumbs-up"
          onPress={() => {
            if (upNext) {
              navigation.replace('Lesson', {
                courseId,
                moduleId: upNext.moduleId,
                lessonId: upNext.id,
              });
            } else {
              navigation.navigate('Curriculum', { courseId });
            }
          }}
        />
        <SecondaryButton
          title="Review Lesson"
          icon="refresh"
          onPress={() => navigation.replace('Lesson', { courseId, moduleId, lessonId })}
          style={{ marginTop: SPACING.md }}
        />
      </View>

      <AchievementModal
        visible={showBadge}
        onClose={() => setShowBadge(false)}
        title="New Achievement!"
        message="You completed your first lesson!"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  top: {
    height: 300,
    backgroundColor: COLORS.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confetti: { position: 'absolute' },
  trophyRing: {
    width: 168, height: 168, borderRadius: 84,
    backgroundColor: 'rgba(255,255,255,0.72)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 6, borderColor: 'rgba(255,255,255,0.9)',
  },
  body: { alignItems: 'center', paddingHorizontal: SPACING.xl, paddingTop: SPACING.xxl },
  title: { ...TYPE.h1, color: COLORS.textPrimary, textAlign: 'center' },
  sub: { ...TYPE.bodyLg, color: COLORS.textSecondary, marginTop: 6, textAlign: 'center' },
  lessonName: { ...TYPE.h4, color: COLORS.primary, marginTop: 2 },

  stats: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.xxl, width: '100%' },
  stat: {
    flex: 1, backgroundColor: COLORS.surfaceMuted,
    borderRadius: RADIUS.md, paddingVertical: SPACING.lg, alignItems: 'center',
  },
  statIcon: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm,
  },
  statVal: { ...TYPE.h3, color: COLORS.textPrimary },
  statLabel: { ...TYPE.caption, color: COLORS.textSecondary, marginTop: 1, letterSpacing: 0.4 },

  footer: {
    marginTop: 'auto',
    padding: SPACING.xl,
    paddingBottom: SPACING.xxl,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
});
