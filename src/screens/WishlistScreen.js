import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPE, SHADOWS, LAYOUT } from '../theme';
import { COURSES } from '../constants/data';
import { EmptyState, PrimaryButton } from '../components/ui';
import { useApp } from '../context/AppContext';

export default function WishlistScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const saved = COURSES.filter((c) => state.wishlist.includes(c.id));

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>My Wishlist</Text>
        <Pressable
          onPress={() => navigation.navigate('Notifications')}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Notifications"
        >
          <Ionicons name="notifications-outline" size={25} color={COLORS.textPrimary} />
        </Pressable>
      </View>

      {saved.length === 0 ? (
        <EmptyState
          icon3d="heart"
          title="Your wishlist is empty"
          message="Tap the heart on any course to save it here for later."
          action="Browse courses"
          onAction={() => navigation.navigate('Search')}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.count}>{saved.length} {saved.length === 1 ? 'Book' : 'Books'}</Text>
          <View style={styles.grid}>
            {saved.map((c) => (
              <View key={c.id} style={[styles.card, SHADOWS.xs]}>
                <View style={styles.imgWrap}>
                  <Image source={c.image} style={styles.img} resizeMode="cover" />
                  <View style={styles.levelPill}>
                    <Text style={styles.levelText}>{c.level}</Text>
                  </View>
                  <Pressable
                    onPress={() => dispatch({ type: 'TOGGLE_WISHLIST', payload: c.id })}
                    hitSlop={8}
                    style={styles.heart}
                    accessibilityRole="button"
                    accessibilityLabel={`Remove ${c.title} from wishlist`}
                  >
                    <Ionicons name="heart" size={17} color={COLORS.error} />
                  </Pressable>
                </View>
                <View style={styles.body}>
                  <Text style={styles.cardTitle} numberOfLines={2}>{c.title}</Text>
                  <PrimaryButton
                    title="Read Now"
                    size="md"
                    onPress={() => navigation.navigate('CourseDetail', { courseId: c.id })}
                    style={{ marginTop: SPACING.sm }}
                  />
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl, paddingTop: SPACING.sm, paddingBottom: SPACING.sm,
  },
  title: { ...TYPE.h1, color: COLORS.textPrimary, fontSize: 26 },
  scroll: { paddingHorizontal: SPACING.xl, paddingBottom: LAYOUT.tabBarHeight + SPACING.xxl },
  count: { ...TYPE.small, color: COLORS.textSecondary, textAlign: 'right', marginBottom: SPACING.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md },
  card: {
    width: '47.7%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  imgWrap: { position: 'relative' },
  img: { width: '100%', height: 132, backgroundColor: COLORS.surfaceSunken },
  levelPill: {
    position: 'absolute', top: SPACING.sm, left: SPACING.sm,
    backgroundColor: 'rgba(255,255,255,0.94)',
    paddingHorizontal: 9, paddingVertical: 3, borderRadius: RADIUS.pill,
  },
  levelText: { ...TYPE.caption, color: COLORS.primary },
  heart: {
    position: 'absolute', top: SPACING.sm, right: SPACING.sm,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.94)',
    alignItems: 'center', justifyContent: 'center',
  },
  body: { padding: SPACING.md },
  cardTitle: { ...TYPE.bodyStrong, color: COLORS.textPrimary, minHeight: 40 },
});
