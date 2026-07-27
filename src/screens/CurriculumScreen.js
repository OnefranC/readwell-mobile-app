import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPE, SHADOWS } from '../theme';
import { CURRICULUM, COURSES } from '../constants/data';
import { Header, ProgressBar, EmptyState } from '../components/ui';
import { useApp } from '../context/AppContext';

export default function CurriculumScreen({ route, navigation }) {
  const { courseId = 'english' } = route.params || {  };
  const { state, courseProgress, nextLesson, isLessonUnlocked } = useApp();

  const curriculum = CURRICULUM[courseId];
  const course = COURSES.find((c) => c.id === courseId);

  if (!curriculum) {
    return (
      <SafeAreaView style={styles.root}>
        <Header title="Curriculum" onBack={() => navigation.goBack()} />
        <EmptyState
          icon3d="rocket"
          title="Coming soon"
          message={`The ${course?.title || 'course'} curriculum is being written. Check back shortly.`}
          action="Browse other courses"
          onAction={() => navigation.navigate('Search')}
        />
      </SafeAreaView>
    );
  }

  const prog = courseProgress(courseId);
  const done = state.completedLessons[courseId] || [];
  const resume = nextLesson(courseId);

  const openLesson = (lesson, moduleId) => {
    navigation.navigate('Lesson', { courseId, moduleId, lessonId: lesson.id });
  };

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Curriculum" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.summary}>
          <View style={styles.summaryTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.courseName}>{curriculum.title}</Text>
              <Text style={styles.courseMeta}>
                {prog.done} of {prog.total} lessons completed
              </Text>
            </View>
            <Text style={styles.pct}>{prog.percent}%</Text>
          </View>
          <ProgressBar value={prog.percent} height={9} style={{ marginTop: SPACING.md }} />
        </View>

        {curriculum.modules.map((mod) => {
          const modDone = mod.lessons.filter((l) => done.includes(l.id)).length;
          const complete = modDone === mod.lessons.length;
          const started = modDone > 0;

          return (
            <View key={mod.id} style={styles.module}>
              <View style={styles.moduleHead}>
                <Text style={styles.moduleTitle} numberOfLines={1}>{mod.title}</Text>
                <View
                  style={[
                    styles.statusPill,
                    complete && styles.statusDone,
                    !complete && started && styles.statusProgress,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      complete && { color: COLORS.success },
                      !complete && started && { color: COLORS.primaryDark },
                    ]}
                  >
                    {complete ? 'Completed' : started ? 'In Progress' : `${mod.lessons.length} Lessons`}
                  </Text>
                </View>
              </View>

              {mod.lessons.map((lesson) => {
                const isDone = done.includes(lesson.id);
                const unlocked = isLessonUnlocked(courseId, lesson.id);
                const isNext = resume?.id === lesson.id;

                return (
                  <Pressable
                    key={lesson.id}
                    onPress={() => unlocked && openLesson(lesson, mod.id)}
                    disabled={!unlocked}
                    accessibilityRole="button"
                    accessibilityLabel={
                      `${lesson.title}, ${lesson.duration}` +
                      (isDone ? ', completed' : unlocked ? '' : ', locked')
                    }
                    accessibilityState={{ disabled: !unlocked }}
                    style={({ pressed }) => [
                      styles.lesson,
                      isNext && styles.lessonNext,
                      !unlocked && styles.lessonLocked,
                      pressed && unlocked && { opacity: 0.85 },
                    ]}
                  >
                    {isNext ? <View style={styles.nextBar} /> : null}
                    <View
                      style={[
                        styles.playCircle,
                        isDone && styles.playDone,
                        !unlocked && styles.playLocked,
                      ]}
                    >
                      <Ionicons
                        name={!unlocked ? 'lock-closed' : isDone ? 'checkmark' : 'play'}
                        size={16}
                        color={unlocked ? COLORS.textInverse : COLORS.textTertiary}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.lessonTitle,
                          isNext && { color: COLORS.primary },
                          !unlocked && { color: COLORS.textTertiary },
                        ]}
                        numberOfLines={1}
                      >
                        {lesson.title}
                      </Text>
                      <Text style={styles.lessonMeta}>
                        {lesson.duration}
                        {isNext && !isDone ? ' • up next' : ''}
                        {isDone ? ' • done' : ''}
                      </Text>
                    </View>
                    {unlocked ? (
                      <Ionicons
                        name="chevron-forward"
                        size={19}
                        color={isNext ? COLORS.primary : COLORS.textTertiary}
                      />
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          );
        })}
      </ScrollView>

      {resume ? (
        <Pressable
          style={styles.resumeBar}
          onPress={() => openLesson(resume, resume.moduleId)}
          accessibilityRole="button"
          accessibilityLabel={`Resume learning, ${resume.title}`}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.resumeLabel}>RESUME LEARNING</Text>
            <Text style={styles.resumeTitle} numberOfLines={1}>{resume.title}</Text>
          </View>
          <View style={styles.resumePlay}>
            <Ionicons name="play" size={19} color={COLORS.textInverse} />
          </View>
        </Pressable>
      ) : (
        <View style={styles.doneBar}>
          <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
          <Text style={styles.doneText}>Course complete — nice work!</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingHorizontal: SPACING.xl, paddingBottom: 130 },

  summary: { marginBottom: SPACING.xxl },
  summaryTop: { flexDirection: 'row', alignItems: 'flex-start' },
  courseName: { ...TYPE.h2, color: COLORS.primary, fontSize: 22 },
  courseMeta: { ...TYPE.small, color: COLORS.textSecondary, marginTop: 2 },
  pct: { ...TYPE.h3, color: COLORS.primary },

  module: { marginBottom: SPACING.xl },
  moduleHead: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: SPACING.md, gap: SPACING.md,
  },
  moduleTitle: { ...TYPE.h3, color: COLORS.textPrimary, flex: 1, fontSize: 19 },
  statusPill: {
    paddingHorizontal: SPACING.md, paddingVertical: 5,
    borderRadius: RADIUS.xs, backgroundColor: COLORS.surfaceMuted,
  },
  statusProgress: { backgroundColor: COLORS.accentSurface },
  statusDone: { backgroundColor: COLORS.successSurface },
  statusText: { ...TYPE.caption, color: COLORS.textSecondary },

  lesson: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    overflow: 'hidden',
  },
  lessonNext: { backgroundColor: COLORS.surface, ...SHADOWS.xs },
  lessonLocked: { opacity: 0.62 },
  nextBar: {
    position: 'absolute', left: 0, top: 0, bottom: 0,
    width: 4, backgroundColor: COLORS.primary,
    borderTopLeftRadius: RADIUS.md, borderBottomLeftRadius: RADIUS.md,
  },
  playCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  playDone: { backgroundColor: COLORS.success },
  playLocked: { backgroundColor: COLORS.surfaceSunken },
  lessonTitle: { ...TYPE.bodyStrong, color: COLORS.textPrimary, fontSize: 16 },
  lessonMeta: { ...TYPE.small, color: COLORS.textSecondary, marginTop: 1 },

  resumeBar: {
    position: 'absolute', left: SPACING.xl, right: SPACING.xl, bottom: SPACING.xl,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.primaryDeep,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg,
    ...SHADOWS.lg,
  },
  resumeLabel: { ...TYPE.caption, color: 'rgba(255,255,255,0.75)', letterSpacing: 0.6 },
  resumeTitle: { ...TYPE.h4, color: COLORS.textInverse, marginTop: 2 },
  resumePlay: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
  doneBar: {
    position: 'absolute', left: SPACING.xl, right: SPACING.xl, bottom: SPACING.xl,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm,
    backgroundColor: COLORS.successSurface,
    borderRadius: RADIUS.md, paddingVertical: SPACING.lg,
  },
  doneText: { ...TYPE.bodyStrong, color: COLORS.success },
});
