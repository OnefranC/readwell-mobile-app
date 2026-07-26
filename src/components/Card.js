import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/colors';

export function LessonCard({ lesson, onPress, completed }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={[styles.card, SHADOWS.md]}>
      <View style={[styles.iconContainer, { backgroundColor: lesson.color + '15' }]}>
        <Ionicons name={lesson.icon} size={28} color={lesson.color} />
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>{lesson.title}</Text>
          {completed && (
            <View style={styles.badge}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
            </View>
          )}
        </View>
        <Text style={styles.description} numberOfLines={2}>{lesson.description}</Text>
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Ionicons name="layers-outline" size={14} color={COLORS.textTertiary} />
            <Text style={styles.metaText}>{lesson.lessons} lessons</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color={COLORS.textTertiary} />
            <Text style={styles.metaText}>{lesson.duration}</Text>
          </View>
          <View style={[styles.levelBadge, { backgroundColor: lesson.color + '20' }]}>
            <Text style={[styles.levelText, { color: lesson.color }]}>{lesson.level}</Text>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.textTertiary} />
    </TouchableOpacity>
  );
}

export function ProgressCard({ value, label, icon, color }) {
  return (
    <View style={[styles.progressCard, SHADOWS.sm]}>
      <View style={[styles.progressIcon, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text style={styles.progressValue}>{value}</Text>
      <Text style={styles.progressLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
  },
  badge: {
    marginLeft: SPACING.xs,
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    lineHeight: 18,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  levelBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  levelText: {
    fontSize: 11,
    fontWeight: '600',
  },
  progressCard: {
    flex: 1,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    minWidth: 100,
  },
  progressIcon: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  progressValue: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  progressLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
