import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Animated } from 'react-native';
import { COLORS, SPACING } from '../constants/colors';
import { LESSONS } from '../constants/data';
import { LessonCard } from '../components/Card';
import { useApp } from '../context/AppContext';

export default function LessonsScreen({ navigation }) {
  const { state } = useApp();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, [fadeAnim]);

  const renderLesson = ({ item }) => (
    <LessonCard
      lesson={item}
      onPress={() => navigation.navigate('LessonDetail', { lesson: item })}
      completed={state.progress.completedLessons.includes(item.id)}
    />
  );

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Lessons</Text>
      </Animated.View>
      <FlatList
        data={LESSONS}
        renderItem={renderLesson}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.xxl, paddingTop: SPACING.xxxxxl, paddingBottom: SPACING.xl },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.textPrimary },
  listContent: { paddingHorizontal: SPACING.xxl, paddingBottom: 100 },
});
