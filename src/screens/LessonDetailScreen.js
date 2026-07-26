import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/colors';
import { LESSON_CONTENT } from '../constants/lessons';
import { PrimaryButton } from '../components/Button';
import { useApp } from '../context/AppContext';

export default function LessonDetailScreen({ route, navigation }) {
  const { lesson } = route.params;
  const { state } = useApp();
  const content = LESSON_CONTENT[lesson.id];
  const completedTopics = state.progress.completedTopics[lesson.id] || [];
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const topics = content?.topics || [];
  const progressPercent = topics.length > 0 ? Math.round((completedTopics.length / topics.length) * 100) : 0;

  const handleTopicPress = (topic, index) => {
    navigation.navigate('Quiz', { lesson, topicIndex: index, topic });
  };

  const handleStartLesson = () => {
    const nextIndex = topics.findIndex((_, i) => !completedTopics.includes(i));
    const idx = nextIndex >= 0 ? nextIndex : 0;
    navigation.navigate('Quiz', { lesson, topicIndex: idx, topic: topics[idx] });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.hero, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <LinearGradient colors={[lesson.color, lesson.color + 'CC']} style={styles.heroGradient}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={COLORS.textInverse} />
            </TouchableOpacity>
            <View style={styles.heroContent}>
              <View style={styles.iconContainer}>
                <Ionicons name={lesson.icon} size={48} color={COLORS.textInverse} />
              </View>
              <Text style={styles.heroTitle}>{lesson.title}</Text>
              <Text style={styles.heroDescription}>{lesson.description}</Text>
            </View>
            <View style={styles.heroMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="layers-outline" size={18} color="rgba(255,255,255,0.8)" />
                <Text style={styles.metaText}>{topics.length} topics</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={18} color="rgba(255,255,255,0.8)" />
                <Text style={styles.metaText}>{lesson.duration}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="bar-chart-outline" size={18} color="rgba(255,255,255,0.8)" />
                <Text style={styles.metaText}>{lesson.level}</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Your Progress</Text>
              <Text style={styles.progressPercent}>{progressPercent}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
            </View>
          </View>

          <View style={styles.topicsSection}>
            <Text style={styles.sectionTitle}>Lesson Topics</Text>
            {topics.map((topic, index) => {
              const isCompleted = completedTopics.includes(index);
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.topicItem, SHADOWS.sm]}
                  onPress={() => handleTopicPress(topic, index)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.topicNumber, isCompleted && styles.topicNumberCompleted]}>
                    {isCompleted ? (
                      <Ionicons name="checkmark" size={16} color={COLORS.textInverse} />
                    ) : (
                      <Text style={styles.topicNumberText}>{index + 1}</Text>
                    )}
                  </View>
                  <View style={styles.topicContent}>
                    <Text style={styles.topicTitle}>{topic.title}</Text>
                    <Text style={styles.topicSubtitle}>{isCompleted ? 'Completed' : 'Tap to start'}</Text>
                  </View>
                  <Ionicons name={isCompleted ? 'checkmark-circle' : 'chevron-forward'} size={20} color={isCompleted ? COLORS.success : COLORS.textTertiary} />
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          title={progressPercent === 100 ? 'Review Lesson' : 'Start Lesson'}
          onPress={handleStartLesson}
          style={styles.startButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingBottom: 120 },
  hero: { marginBottom: SPACING.xl },
  heroGradient: { paddingTop: SPACING.xxxxxl, paddingBottom: SPACING.xxxl, paddingHorizontal: SPACING.xxl },
  backButton: { width: 44, height: 44, borderRadius: RADIUS.md, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.xxl },
  heroContent: { alignItems: 'center', marginBottom: SPACING.xxl },
  iconContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.lg },
  heroTitle: { fontSize: 28, fontWeight: '800', color: COLORS.textInverse, marginBottom: SPACING.sm },
  heroDescription: { fontSize: 16, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 22 },
  heroMeta: { flexDirection: 'row', justifyContent: 'center', gap: SPACING.xxl },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  metaText: { fontSize: 14, color: 'rgba(255,255,255,0.85)' },
  content: { paddingHorizontal: SPACING.xxl },
  progressSection: { marginBottom: SPACING.xxxl },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.md },
  progressTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  progressPercent: { fontSize: 16, fontWeight: '600', color: COLORS.primary },
  progressBar: { height: 8, backgroundColor: COLORS.border, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 4 },
  topicsSection: { marginBottom: SPACING.xxl },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.lg },
  topicItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surfaceElevated, borderRadius: RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.sm },
  topicNumber: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primarySurface, alignItems: 'center', justifyContent: 'center', marginRight: SPACING.md },
  topicNumberCompleted: { backgroundColor: COLORS.primary },
  topicNumberText: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  topicContent: { flex: 1 },
  topicTitle: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary },
  topicSubtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: SPACING.xxl, paddingBottom: SPACING.xxxxxl, paddingTop: SPACING.lg, backgroundColor: COLORS.background, borderTopWidth: 1, borderTopColor: COLORS.borderLight },
  startButton: { marginTop: SPACING.sm },
});
