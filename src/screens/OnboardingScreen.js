import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/colors';
import { ONBOARDING_SLIDES } from '../constants/data';
import { PrimaryButton, TextButton } from '../components/Button';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');

export default function OnboardingScreen({ navigation }) {
  const { dispatch } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems[0]) setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleNext = () => {
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      dispatch({ type: 'COMPLETE_ONBOARDING' });
      navigation.replace('Login');
    }
  };

  const handleSkip = () => {
    dispatch({ type: 'COMPLETE_ONBOARDING' });
    navigation.replace('Login');
  };

  const renderSlide = ({ item, index }) => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    const opacity = scrollX.interpolate({ inputRange, outputRange: [0, 1, 0] });
    const translateY = scrollX.interpolate({ inputRange, outputRange: [50, 0, -50] });

    return (
      <View style={styles.slide}>
        <Animated.View style={[styles.iconWrapper, { opacity, transform: [{ translateY }] }]}>
          <View style={styles.iconCircle}>
            <Ionicons name={item.icon} size={64} color={COLORS.primary} />
          </View>
        </Animated.View>
        <Animated.View style={[styles.textWrapper, { opacity, transform: [{ translateY }] }]}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </Animated.View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.skipContainer}>
        {currentIndex < ONBOARDING_SLIDES.length - 1 && (
          <TextButton title="Skip" onPress={handleSkip} />
        )}
      </View>
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_SLIDES}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        keyExtractor={(item) => item.id}
      />
      <View style={styles.footer}>
        <View style={styles.pagination}>
          {ONBOARDING_SLIDES.map((_, index) => {
            const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
            const dotWidth = scrollX.interpolate({ inputRange, outputRange: [8, 24, 8] });
            const dotOpacity = scrollX.interpolate({ inputRange, outputRange: [0.3, 1, 0.3] });
            return <Animated.View key={index} style={[styles.dot, { width: dotWidth, opacity: dotOpacity }]} />;
          })}
        </View>
        <PrimaryButton
          title={currentIndex === ONBOARDING_SLIDES.length - 1 ? 'Get Started' : 'Next'}
          onPress={handleNext}
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  skipContainer: { position: 'absolute', top: SPACING.xxxxl, right: SPACING.xxl, zIndex: 10 },
  slide: { width, flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.xxxxl },
  iconWrapper: { marginBottom: SPACING.xxxxl },
  iconCircle: { width: 160, height: 160, borderRadius: 80, backgroundColor: COLORS.primarySurface, alignItems: 'center', justifyContent: 'center' },
  textWrapper: { alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.textPrimary, textAlign: 'center', marginBottom: SPACING.md },
  description: { fontSize: 16, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 24, paddingHorizontal: SPACING.lg },
  footer: { paddingHorizontal: SPACING.xxl, paddingBottom: SPACING.xxxxxl },
  pagination: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.xxxl, gap: SPACING.sm },
  dot: { height: 8, borderRadius: 4, backgroundColor: COLORS.primary },
  button: { marginTop: SPACING.sm },
});
