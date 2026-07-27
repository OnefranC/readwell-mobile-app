import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPE } from '../theme';
import { QUIZZES, CURRICULUM } from '../constants/data';
import { Header, PrimaryButton, ProgressBar, Icon3D, EmptyState } from '../components/ui';
import { useApp } from '../context/AppContext';

export default function QuizScreen({ route, navigation }) {
  const { courseId = 'english', moduleId = 'm1', lessonId } = route.params || {};
  const { completeLesson } = useApp();

  const questions = QUIZZES[moduleId] || QUIZZES.m1 || [];
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [locked, setLocked] = useState(false);
  const [score, setScore] = useState(0);

  const q = questions[index];
  const isLast = index === questions.length - 1;

  const lesson = useMemo(() => {
    const mod = CURRICULUM[courseId]?.modules.find((m) => m.id === moduleId);
    return mod?.lessons.find((l) => l.id === lessonId);
  }, [courseId, moduleId, lessonId]);

  if (!q) {
    return (
      <SafeAreaView style={styles.root}>
        <Header title="Quiz" onBack={() => navigation.goBack()} />
        <EmptyState
          icon3d="check"
          title="No quiz here"
          message="This module has no quiz yet — your lesson progress is already saved."
          action="Back"
          onAction={() => navigation.goBack()}
        />
      </SafeAreaView>
    );
  }

  const choose = (i) => {
    if (locked) return;
    setPicked(i);
    setLocked(true);
    if (i === q.correct) setScore((s) => s + 1);
  };

  const advance = () => {
    const finalScore = score;
    if (isLast) {
      completeLesson({
        courseId,
        lessonId: lessonId || lesson?.id || 'unknown',
        minutes: 5,
        correct: finalScore,
        total: questions.length,
      });
      navigation.replace('LessonComplete', {
        courseId,
        moduleId,
        lessonId,
        correct: finalScore,
        total: questions.length,
      });
    } else {
      setIndex((n) => n + 1);
      setPicked(null);
      setLocked(false);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <Header
        title={`Module ${moduleId.replace('m', '')} Review`}
        onBack={() => navigation.goBack()}
      />

      <View style={styles.progressWrap}>
        <ProgressBar value={((index + 1) / questions.length) * 100} height={7} />
        <Text style={styles.progressText}>{index + 1}/{questions.length}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.quizTitle}>Quick Quiz</Text>

        <View style={styles.promptCard}>
          <View style={styles.promptIcon}>
            <Ionicons name="volume-medium" size={18} color={COLORS.primary} />
          </View>
          <Text style={styles.promptText}>{q.prompt}</Text>
        </View>

        {q.image ? (
          <View style={styles.imageCard}>
            <Icon3D name={q.image} size={128} />
          </View>
        ) : null}

        <View style={{ gap: SPACING.md, marginTop: SPACING.lg }}>
          {q.options.map((opt, i) => {
            const isCorrect = i === q.correct;
            const isPicked = picked === i;
            const showRight = locked && isCorrect;
            const showWrong = locked && isPicked && !isCorrect;

            return (
              <Pressable
                key={i}
                onPress={() => choose(i)}
                disabled={locked}
                accessibilityRole="radio"
                accessibilityState={{ selected: isPicked, disabled: locked }}
                accessibilityLabel={opt}
                style={({ pressed }) => [
                  styles.option,
                  showRight && styles.optRight,
                  showWrong && styles.optWrong,
                  pressed && !locked && { opacity: 0.9 },
                ]}
              >
                <View style={styles.optSpeaker}>
                  <Ionicons name="volume-medium" size={16} color={COLORS.primary} />
                </View>
                <Text
                  style={[
                    styles.optText,
                    showRight && { color: COLORS.success },
                    showWrong && { color: COLORS.error },
                  ]}
                >
                  {opt}
                </Text>
                <View
                  style={[
                    styles.radio,
                    showRight && styles.radioRight,
                    showWrong && styles.radioWrong,
                  ]}
                >
                  {showRight ? <Ionicons name="checkmark" size={14} color={COLORS.textInverse} /> : null}
                  {showWrong ? <Ionicons name="close" size={14} color={COLORS.textInverse} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>

        {locked ? (
          <View
            style={[
              styles.feedback,
              picked === q.correct ? styles.feedbackGood : styles.feedbackBad,
            ]}
          >
            <Ionicons
              name={picked === q.correct ? 'checkmark-circle' : 'information-circle'}
              size={19}
              color={picked === q.correct ? COLORS.success : COLORS.error}
            />
            <Text style={styles.feedbackText}>
              {picked === q.correct
                ? 'Correct — well done!'
                : `Not quite. The answer is "${q.options[q.correct]}".`}
            </Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          title={isLast ? 'Finish' : 'Next question'}
          onPress={advance}
          disabled={!locked}
        />
        {!locked ? <Text style={styles.hint}>Pick an answer to continue</Text> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  progressWrap: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    paddingHorizontal: SPACING.xl, paddingBottom: SPACING.md,
  },
  progressText: { ...TYPE.smallStrong, color: COLORS.textSecondary, minWidth: 34, textAlign: 'right' },
  scroll: { paddingHorizontal: SPACING.xl, paddingBottom: 130 },
  quizTitle: { ...TYPE.h1, color: COLORS.textPrimary, textAlign: 'center', marginBottom: SPACING.lg },

  promptCard: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: RADIUS.md, padding: SPACING.lg,
  },
  promptIcon: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: COLORS.surfaceSunken,
    alignItems: 'center', justifyContent: 'center',
  },
  promptText: { ...TYPE.h4, color: COLORS.textPrimary, flex: 1, lineHeight: 22 },

  imageCard: {
    height: 210, borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
    marginTop: SPACING.lg,
  },

  option: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: RADIUS.pill,
    paddingVertical: SPACING.md, paddingHorizontal: SPACING.md,
    borderWidth: 2, borderColor: 'transparent',
  },
  optRight: { backgroundColor: COLORS.successSurface, borderColor: COLORS.success },
  optWrong: { backgroundColor: COLORS.errorSurface, borderColor: COLORS.error },
  optSpeaker: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: COLORS.surfaceSunken,
    alignItems: 'center', justifyContent: 'center',
  },
  optText: { ...TYPE.h4, color: COLORS.textPrimary, flex: 1, fontSize: 18 },
  radio: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, borderColor: COLORS.borderStrong,
    alignItems: 'center', justifyContent: 'center',
  },
  radioRight: { backgroundColor: COLORS.success, borderColor: COLORS.success },
  radioWrong: { backgroundColor: COLORS.error, borderColor: COLORS.error },

  feedback: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    padding: SPACING.md, borderRadius: RADIUS.sm, marginTop: SPACING.lg,
  },
  feedbackGood: { backgroundColor: COLORS.successSurface },
  feedbackBad: { backgroundColor: COLORS.errorSurface },
  feedbackText: { ...TYPE.small, color: COLORS.textPrimary, flex: 1 },

  footer: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    padding: SPACING.xl, paddingBottom: SPACING.xxl,
    backgroundColor: COLORS.background,
    borderTopWidth: 1, borderTopColor: COLORS.divider,
  },
  hint: { ...TYPE.small, color: COLORS.textTertiary, textAlign: 'center', marginTop: SPACING.sm },
});
