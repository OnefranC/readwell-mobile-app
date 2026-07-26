import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/colors';
import { LESSONS } from '../constants/data';
import { LessonCard, ProgressCard } from '../components/Card';
import { useApp } from '../context/AppContext';

export default function HomeScreen({ navigation }) {
  const { state } = useApp();
  const { progress, user } = state;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const completedCount = progress.completedLessons.length;
  const nextLesson = LESSONS.find((l) => !progress.completedLessons.includes(l.id)) || LESSONS[0];

  const handleContinue = () => {
    navigation.navigate('LessonDetail', { lesson: nextLesson });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.name}>{user?.name || 'Learner'}</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
            <Ionicons name="person-circle-outline" size={44} color={COLORS.primary} />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.statsContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <ProgressCard value={completedCount} label="Completed" icon="checkmark-circle-outline" color={COLORS.success} />
          <ProgressCard value={progress.streak} label="Day Streak" icon="flame-outline" color={COLORS.secondary} />
          <ProgressCard value={progress.wordsLearned} label="Words" icon="text-outline" color={COLORS.primary} />
        </Animated.View>

        <Animated.View style={[styles.continueSection, { opacity: fadeAnim }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Continue Learning</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Lessons')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={[styles.continueCard, SHADOWS.lg]} activeOpacity={0.8} onPress={handleContinue}>
            <View style={styles.continueContent}>
              <View style={styles.continueIcon}>
                <Ionicons name="play" size={32} color={COLORS.textInverse} />
              </View>
              <View style={styles.continueText}>
                <Text style={styles.continueTitle}>{completedCount === 0 ? 'Start Your First Lesson' : `Continue: ${nextLesson.title}`}</Text>
                <Text style={styles.continueSubtitle}>{nextLesson.description}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.textInverse} />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.lessonsSection, { opacity: fadeAnim }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Lessons</Text>
          </View>
          {LESSONS.slice(0, 3).map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              onPress={() => navigation.navigate('LessonDetail', { lesson })}
              completed={progress.completedLessons.includes(lesson.id)}
            />
          ))}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.xxl, paddingTop: SPACING.xxxxxl, paddingBottom: SPACING.xl },
  headerLeft: { flex: 1 },
  greeting: { fontSize: 14, color: COLORS.textSecondary },
  name: { fontSize: 26, fontWeight: '800', color: COLORS.textPrimary, marginTop: 2 },
  profileButton: { padding: SPACING.xs },
  statsContainer: { flexDirection: 'row', paddingHorizontal: SPACING.xxl, gap: SPACING.sm, marginBottom: SPACING.xxxl },
  continueSection: { paddingHorizontal: SPACING.xxl, marginBottom: SPACING.xxxl },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary },
  seeAll: { fontSize: 14, color: COLORS.primary, fontWeight: '600' },
  continueCard: { backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, padding: SPACING.xl, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  continueContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  continueIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginRight: SPACING.md },
  continueText: { flex: 1 },
  continueTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textInverse },
  continueSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  lessonsSection: { paddingHorizontal: SPACING.xxl },
});
