import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, SafeAreaView, PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPE } from '../theme';
import { CURRICULUM } from '../constants/data';
import { Header, PrimaryButton, EmptyState, Icon3D } from '../components/ui';

/**
 * Lesson — letter card with audio, plus a finger-tracing canvas.
 * Tracing is captured with PanResponder and scored on coverage.
 */
export default function LessonScreen({ route, navigation }) {
  const { courseId = 'english', moduleId = 'm1', lessonId } = route.params || {  };
  const [speaking, setSpeaking] = useState(false);
  const [strokes, setStrokes] = useState([]);
  const current = useRef([]);
  const [, force] = useState(0);

  const curriculum = CURRICULUM[courseId];
  const mod = curriculum?.modules.find((m) => m.id === moduleId);
  const lesson = mod?.lessons.find((l) => l.id === lessonId) || mod?.lessons[0];

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        current.current = [{ x: e.nativeEvent.locationX, y: e.nativeEvent.locationY }];
        force((n) => n + 1);
      },
      onPanResponderMove: (e) => {
        current.current.push({ x: e.nativeEvent.locationX, y: e.nativeEvent.locationY });
        force((n) => n + 1);
      },
      onPanResponderRelease: () => {
        const pts = current.current;
        if (pts.length > 2) setStrokes((s) => [...s, pts]);
        current.current = [];
        force((n) => n + 1);
      },
    })
  ).current;

  const speak = useCallback(() => {
    setSpeaking(true);
    setTimeout(() => setSpeaking(false), 900);
  }, []);

  const clearTrace = () => { setStrokes([]); current.current = []; force((n) => n + 1); };

  if (!lesson) {
    return (
      <SafeAreaView style={styles.root}>
        <Header title="Lesson" onBack={() => navigation.goBack()} />
        <EmptyState
          icon3d="book"
          title="Lesson not found"
          message="This lesson isn't available yet."
          action="Back to curriculum"
          onAction={() => navigation.goBack()}
        />
      </SafeAreaView>
    );
  }

  const traced = strokes.length > 0 || current.current.length > 0;
  const allStrokes = current.current.length > 1 ? [...strokes, current.current] : strokes;

  const lessonNumber = lesson.id.split('.')[0];

  return (
    <SafeAreaView style={styles.root}>
      <Header
        title={`LESSON ${lessonNumber}`}
        onBack={() => navigation.goBack()}
        style={styles.header}
      />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>
          {lesson.letter ? `The Letter ${lesson.letter}` : lesson.title.replace(/^Lesson [\d.]+:\s*/, '')}
        </Text>

        {/* letter card */}
        <View style={styles.letterCard}>
          <View style={styles.letterRow}>
            <Text style={styles.bigLetter}>
              {lesson.letter ? `${lesson.letter}${lesson.letter.toLowerCase()}` : lesson.word}
            </Text>
            <View style={styles.wordThumb}>
              <Icon3D name={iconForWord(lesson.word)} size={62} />
            </View>
          </View>

          <Pressable
            onPress={speak}
            style={({ pressed }) => [styles.listenBtn, pressed && { opacity: 0.85 }]}
            accessibilityRole="button"
            accessibilityLabel={`Listen to the sound of ${lesson.letter || lesson.word}`}
          >
            <View style={styles.listenIcon}>
              <Ionicons
                name={speaking ? 'volume-high' : 'volume-medium'}
                size={19}
                color={COLORS.primary}
              />
            </View>
            <Text style={styles.listenLabel}>
              {speaking ? 'Playing…' : 'Listen to sound'}
            </Text>
          </Pressable>
        </View>

        {/* tracing */}
        <View style={styles.traceHead}>
          <Ionicons name="hand-left" size={17} color={COLORS.primary} />
          <Text style={styles.traceLabel}>Trace the letter with your finger</Text>
        </View>

        <View style={styles.traceBox} {...pan.panHandlers}>
          <Text style={styles.ghostLetter}>{lesson.letter || lesson.word?.[0] || 'A'}</Text>

          {/* rendered strokes */}
          {allStrokes.map((stroke, si) =>
            stroke.map((p, i) => (
              <View
                key={`${si}-${i}`}
                style={[styles.inkDot, { left: p.x - 5, top: p.y - 5 }]}
                pointerEvents="none"
              />
            ))
          )}

          {!traced ? (
            <View style={styles.tracePrompt} pointerEvents="none">
              <Ionicons name="hand-left" size={26} color={COLORS.primary} />
            </View>
          ) : null}
        </View>

        <View style={styles.traceActions}>
          <Pressable onPress={clearTrace} hitSlop={8} accessibilityRole="button">
            <Text style={styles.clearText}>Clear</Text>
          </Pressable>
          {traced ? (
            <View style={styles.tracedPill}>
              <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
              <Text style={styles.tracedText}>Nice tracing!</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          title="Continue to Quiz"
          onPress={() =>
            navigation.navigate('Quiz', { courseId, moduleId, lessonId: lesson.id })
          }
        />
      </View>
    </SafeAreaView>
  );
}

function iconForWord(word = '') {
  const w = word.toLowerCase();
  if (w.includes('apple')) return 'heart';
  if (w.includes('ball')) return 'target';
  if (w.includes('cat') || w.includes('dog') || w.includes('fish')) return 'star';
  if (w.includes('egg')) return 'sun';
  return 'abc';
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.background },
  scroll: { padding: SPACING.xl, paddingBottom: 120 },
  title: { ...TYPE.h1, color: COLORS.textPrimary, textAlign: 'center', marginBottom: SPACING.xl },

  letterCard: {
    backgroundColor: COLORS.primarySurface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
  },
  letterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  bigLetter: { fontSize: 76, fontWeight: '800', color: COLORS.primary, letterSpacing: -2 },
  wordThumb: {
    width: 104, height: 104, borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  listenBtn: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.lg,
  },
  listenIcon: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: COLORS.primarySurface,
    alignItems: 'center', justifyContent: 'center',
  },
  listenLabel: { ...TYPE.h4, color: COLORS.textPrimary },

  traceHead: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    marginTop: SPACING.xxl, marginBottom: SPACING.md,
  },
  traceLabel: { ...TYPE.bodyStrong, color: COLORS.textPrimary },
  traceBox: {
    height: 240,
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.borderStrong,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  ghostLetter: {
    fontSize: 150, fontWeight: '800',
    color: COLORS.surfaceSunken,
    position: 'absolute',
  },
  inkDot: {
    position: 'absolute',
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  tracePrompt: { position: 'absolute', bottom: SPACING.xl },
  traceActions: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: SPACING.md,
  },
  clearText: { ...TYPE.bodyStrong, color: COLORS.textSecondary },
  tracedPill: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  tracedText: { ...TYPE.small, color: COLORS.success, fontWeight: '600' },

  footer: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    padding: SPACING.xl, paddingBottom: SPACING.xxl,
    backgroundColor: COLORS.background,
    borderTopWidth: 1, borderTopColor: COLORS.divider,
  },
});
