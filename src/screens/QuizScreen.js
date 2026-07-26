import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../constants/colors';
import { LESSON_CONTENT } from '../constants/lessons';
import { PrimaryButton } from '../components/Button';
import { useApp } from '../context/AppContext';

export default function QuizScreen({ route, navigation }) {
  const { lesson, topicIndex, topic } = route.params;
  const { dispatch } = useApp();
  const content = LESSON_CONTENT[lesson.id];
  const questions = content?.quiz || [];
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showTopic, setShowTopic] = useState(!!topic);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
    ]).start();
  }, [currentQuestion, showTopic, fadeAnim, scaleAnim]);

  const handleStartQuiz = () => {
    setShowTopic(false);
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.9);
  };

  const handleAnswer = (optionIndex) => {
    setSelectedAnswer(optionIndex);
    const isCorrect = optionIndex === questions[currentQuestion].correct;
    if (isCorrect) setScore((s) => s + 1);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((q) => q + 1);
        setSelectedAnswer(null);
        fadeAnim.setValue(0);
        scaleAnim.setValue(0.9);
      } else {
        dispatch({ type: 'SAVE_QUIZ_SCORE', payload: { lessonId: lesson.id, score: isCorrect ? score + 1 : score, total: questions.length } });
        dispatch({ type: 'COMPLETE_TOPIC', payload: { lessonId: lesson.id, topicIndex } });
        dispatch({ type: 'UPDATE_STREAK' });
        if (topic?.words) {
          dispatch({ type: 'COMPLETE_LESSON', payload: { lessonId: lesson.id, words: topic.words.length } });
        }
        setShowResult(true);
      }
    }, 1000);
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
  };

  const handleBackToDetail = () => {
    navigation.goBack();
  };

  if (showTopic && topic) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackToDetail} style={styles.backButton}>
            <Ionicons name="close" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{lesson.title}</Text>
          <View style={{ width: 44 }} />
        </View>
        <ScrollView contentContainerStyle={styles.topicContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.topicTitle}>{topic.title}</Text>
          <Text style={styles.topicBody}>{topic.content}</Text>
          {topic.words && topic.words.length > 0 && (
            <View style={styles.wordsSection}>
              <Text style={styles.wordsLabel}>Words to practice:</Text>
              <View style={styles.wordsList}>
                {topic.words.map((w, i) => (
                  <View key={i} style={styles.wordChip}>
                    <Text style={styles.wordText}>{w}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          <PrimaryButton title="Take the Quiz" onPress={handleStartQuiz} style={styles.quizButton} />
        </ScrollView>
      </View>
    );
  }

  if (showResult) {
    const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const passed = percentage >= 70;

    return (
      <View style={styles.container}>
        <View style={styles.resultContainer}>
          <Animated.View style={[styles.resultIcon, { transform: [{ scale: scaleAnim }] }]}>
            <Ionicons name={passed ? 'checkmark-circle' : 'refresh-circle'} size={80} color={passed ? COLORS.success : COLORS.secondary} />
          </Animated.View>
          <Text style={styles.resultTitle}>{passed ? 'Great Job!' : 'Keep Practicing!'}</Text>
          <Text style={styles.resultSubtitle}>You scored {score} out of {questions.length}</Text>
          <Text style={styles.resultPercentage}>{percentage}%</Text>
          <View style={styles.resultButtons}>
            {!passed && <PrimaryButton title="Try Again" onPress={handleRetry} style={styles.retryButton} />}
            <PrimaryButton title={passed ? 'Continue' : 'Back to Lessons'} onPress={handleBackToDetail} style={styles.continueButton} />
          </View>
        </View>
      </View>
    );
  }

  const question = questions[currentQuestion];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackToDetail} style={styles.backButton}>
          <Ionicons name="close" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${((currentQuestion + 1) / questions.length) * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>{currentQuestion + 1}/{questions.length}</Text>
      </View>

      <Animated.View style={[styles.questionContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.question}>{question.question}</Text>
      </Animated.View>

      <View style={styles.optionsContainer}>
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === question.correct;
          const showFeedback = selectedAnswer !== null;

          return (
            <TouchableOpacity
              key={index}
              onPress={() => !selectedAnswer && handleAnswer(index)}
              disabled={selectedAnswer !== null}
              style={[styles.option, isSelected && (isCorrect ? styles.optionCorrect : styles.optionIncorrect), showFeedback && isCorrect && styles.optionCorrect]}
              activeOpacity={0.7}
            >
              <Text style={[styles.optionText, isSelected && (isCorrect ? styles.optionTextCorrect : styles.optionTextIncorrect), showFeedback && isCorrect && styles.optionTextCorrect]}>
                {option}
              </Text>
              {showFeedback && (
                <Ionicons name={isCorrect ? 'checkmark-circle' : isSelected ? 'close-circle' : 'ellipse-outline'} size={24} color={isCorrect ? COLORS.success : isSelected ? COLORS.error : COLORS.textTertiary} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: SPACING.xxl },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: SPACING.xxxxxl, paddingBottom: SPACING.xxl, gap: SPACING.md },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, textAlign: 'center' },
  backButton: { width: 44, height: 44, borderRadius: RADIUS.md, backgroundColor: COLORS.surface, alignItems: 'center', justifyContent: 'center' },
  progressBar: { flex: 1, height: 8, backgroundColor: COLORS.border, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 4 },
  progressText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary, minWidth: 40, textAlign: 'right' },
  topicContent: { paddingBottom: SPACING.xxxxxl },
  topicTitle: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary, marginBottom: SPACING.xl },
  topicBody: { fontSize: 16, color: COLORS.textSecondary, lineHeight: 26, marginBottom: SPACING.xxl },
  wordsSection: { marginBottom: SPACING.xxl },
  wordsLabel: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, marginBottom: SPACING.md },
  wordsList: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  wordChip: { backgroundColor: COLORS.primarySurface, borderRadius: RADIUS.sm, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs },
  wordText: { fontSize: 14, fontWeight: '600', color: COLORS.primary },
  quizButton: { marginTop: SPACING.md },
  questionContainer: { marginBottom: SPACING.xxxl },
  question: { fontSize: 24, fontWeight: '700', color: COLORS.textPrimary, lineHeight: 32 },
  optionsContainer: { gap: SPACING.md },
  option: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: SPACING.xl, borderWidth: 2, borderColor: COLORS.border },
  optionCorrect: { backgroundColor: COLORS.successSurface, borderColor: COLORS.success },
  optionIncorrect: { backgroundColor: COLORS.errorSurface, borderColor: COLORS.error },
  optionText: { fontSize: 18, fontWeight: '600', color: COLORS.textPrimary },
  optionTextCorrect: { color: COLORS.success },
  optionTextIncorrect: { color: COLORS.error },
  resultContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: SPACING.xxxxxl },
  resultIcon: { marginBottom: SPACING.xxl },
  resultTitle: { fontSize: 28, fontWeight: '800', color: COLORS.textPrimary, marginBottom: SPACING.sm },
  resultSubtitle: { fontSize: 16, color: COLORS.textSecondary, marginBottom: SPACING.md },
  resultPercentage: { fontSize: 48, fontWeight: '800', color: COLORS.primary, marginBottom: SPACING.xxxxl },
  resultButtons: { width: '100%', gap: SPACING.md },
  retryButton: { marginBottom: SPACING.sm },
  continueButton: {},
});
