import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPE } from '../theme';
import { COURSES } from '../constants/data';
import { PrimaryButton, EmptyState } from '../components/ui';
import ShareSheet from '../components/ShareSheet';
import { useApp } from '../context/AppContext';

export default function CourseDetailScreen({ route, navigation }) {
  const { courseId } = route.params || {  };
  const { state, dispatch, courseProgress } = useApp();
  const [shareOpen, setShareOpen] = useState(false);

  const course = COURSES.find((c) => c.id === courseId);

  if (!course) {
    return (
      <SafeAreaView style={styles.root}>
        <EmptyState
          icon3d="book"
          title="Course unavailable"
          message="We couldn't load this course. It may have been moved."
          action="Go back"
          onAction={() => navigation.goBack()}
        />
      </SafeAreaView>
    );
  }

  const prog = courseProgress(course.id);
  const saved = state.wishlist.includes(course.id);
  const locked = !course.free && state.plan !== 'pro';

  const stars = (n) => {
    const out = [];
    for (let i = 1; i <= 5; i++) {
      out.push(
        <Ionicons
          key={i}
          name={i <= Math.floor(n) ? 'star' : i - n < 1 ? 'star-half' : 'star-outline'}
          size={14}
          color={COLORS.gold}
        />
      );
    }
    return out;
  };

  const onStart = () => {
    if (locked) {
      navigation.navigate('Plans');
      return;
    }
    dispatch({ type: 'SET_ACTIVE_COURSE', payload: course.id });
    navigation.navigate('Curriculum', { courseId: course.id });
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.topBar}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </Pressable>
        <View style={styles.topActions}>
          <Pressable
            onPress={() => dispatch({ type: 'TOGGLE_WISHLIST', payload: course.id })}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={saved ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Ionicons
              name={saved ? 'heart' : 'heart-outline'}
              size={23}
              color={saved ? COLORS.error : COLORS.textPrimary}
            />
          </Pressable>
          <Pressable
            onPress={() => setShareOpen(true)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Share this course"
          >
            <Ionicons name="share-outline" size={23} color={COLORS.textPrimary} />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.videoWrap}>
          <Image source={course.image} style={styles.video} resizeMode="cover" />
          <View style={styles.playBtn}>
            <Ionicons name="play" size={26} color={COLORS.primary} />
          </View>
          {locked ? (
            <View style={styles.lockChip}>
              <Ionicons name="lock-closed" size={12} color={COLORS.textInverse} />
              <Text style={styles.lockChipText}>Pro</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.body}>
          <Text style={styles.title}>{course.title}</Text>
          <Text style={styles.tagline}>{course.tagline}</Text>

          <Text style={styles.createdBy}>
            Created by <Text style={styles.author}>{course.author}</Text>
          </Text>

          <View style={styles.ratingRow}>
            <Text style={styles.ratingNum}>{course.rating}</Text>
            <View style={styles.starRow}>{stars(course.rating)}</View>
          </View>
          <Text style={styles.students}>
            {course.students.toLocaleString()} students ({course.ratings} ratings)
          </Text>

          <View style={styles.metaList}>
            <View style={styles.metaRow}>
              <Ionicons name="warning-outline" size={15} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>last updated {course.updated}</Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="globe-outline" size={15} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>{course.language}</Text>
            </View>
            <View style={styles.metaRow}>
              <Ionicons name="text-outline" size={15} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>{course.captions}</Text>
            </View>
          </View>

          {prog.done > 0 ? (
            <View style={styles.progNote}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
              <Text style={styles.progNoteText}>
                You're {prog.percent}% through — {prog.done} of {prog.total} lessons done
              </Text>
            </View>
          ) : null}

          <View style={styles.priceRow}>
            {course.free ? (
              <>
                <Text style={styles.free}>Free</Text>
                <Text style={styles.strike}>
                  {course.currency}{course.price.toLocaleString()}
                </Text>
                <Text style={styles.off}>100% off</Text>
              </>
            ) : (
              <Text style={styles.free}>
                {course.currency}{course.price.toLocaleString()}
              </Text>
            )}
          </View>
          {course.free ? (
            <View style={styles.limited}>
              <Ionicons name="alarm-outline" size={15} color={COLORS.error} />
              <Text style={styles.limitedText}>Limited time offer</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          title={locked ? 'Unlock with Pro' : prog.done > 0 ? 'Continue learning' : 'Get started now'}
          onPress={onStart}
          icon={locked ? 'lock-closed' : undefined}
        />
      </View>

      <ShareSheet
        visible={shareOpen}
        onClose={() => setShareOpen(false)}
        title={course.title}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.surface },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md,
  },
  topActions: { flexDirection: 'row', gap: SPACING.xl },
  scroll: { paddingBottom: 120 },

  videoWrap: { height: 220, backgroundColor: COLORS.surfaceSunken, justifyContent: 'center', alignItems: 'center' },
  video: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  playBtn: {
    width: 62, height: 62, borderRadius: 31,
    backgroundColor: 'rgba(255,255,255,0.82)',
    alignItems: 'center', justifyContent: 'center',
  },
  lockChip: {
    position: 'absolute', top: SPACING.md, right: SPACING.lg,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md, paddingVertical: 5, borderRadius: RADIUS.pill,
  },
  lockChipText: { ...TYPE.caption, color: COLORS.textInverse },

  body: { padding: SPACING.xl },
  title: { ...TYPE.h1, color: COLORS.textPrimary, fontSize: 27 },
  tagline: { ...TYPE.bodyLg, color: COLORS.textSecondary, marginTop: SPACING.sm, lineHeight: 23 },
  createdBy: { ...TYPE.small, color: COLORS.textSecondary, marginTop: SPACING.lg },
  author: { color: COLORS.primary, fontWeight: '600' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginTop: SPACING.md },
  ratingNum: { ...TYPE.bodyStrong, color: COLORS.textPrimary },
  starRow: { flexDirection: 'row', gap: 2 },
  students: { ...TYPE.small, color: COLORS.textSecondary, marginTop: 5 },
  metaList: { marginTop: SPACING.md, gap: 7 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  metaText: { ...TYPE.small, color: COLORS.textSecondary },

  progNote: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    backgroundColor: COLORS.successSurface,
    padding: SPACING.md, borderRadius: RADIUS.sm, marginTop: SPACING.lg,
  },
  progNoteText: { ...TYPE.small, color: COLORS.textPrimary, flex: 1 },

  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: SPACING.sm, marginTop: SPACING.lg },
  free: { ...TYPE.h2, color: COLORS.textPrimary },
  strike: { ...TYPE.body, color: COLORS.textTertiary, textDecorationLine: 'line-through' },
  off: { ...TYPE.body, color: COLORS.textSecondary },
  limited: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  limitedText: { ...TYPE.small, color: COLORS.error, fontWeight: '600' },

  footer: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    padding: SPACING.xl, paddingBottom: SPACING.xxl,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1, borderTopColor: COLORS.divider,
  },
});
