import React, { useState, useMemo, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, Pressable, Image, SafeAreaView, Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPE, SHADOWS } from '../theme';
import { SEARCH_CATEGORIES, SEARCH_INDEX, SEARCH_FILTERS } from '../constants/data';
import { Icon3D, Chip, EmptyState, PrimaryButton, Skeleton } from '../components/ui';
import { useApp } from '../context/AppContext';

export default function SearchScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(false);

  const runSearch = useCallback((q) => {
    const term = (q ?? query).trim();
    if (!term) return;
    Keyboard.dismiss();
    setLoading(true);
    setSubmitted(term);
    dispatch({ type: 'ADD_RECENT_SEARCH', payload: term });
    setTimeout(() => setLoading(false), 420);
  }, [query, dispatch]);

  const results = useMemo(() => {
    if (!submitted) return [];
    const term = submitted.toLowerCase();
    return SEARCH_INDEX.filter((item) => {
      const matchesTerm =
        item.title.toLowerCase().includes(term) ||
        item.language.toLowerCase().includes(term) ||
        item.kind.toLowerCase().includes(term);
      const matchesFilter =
        filter === 'All' || item.type === filter.toLowerCase();
      return matchesTerm && matchesFilter;
    });
  }, [submitted, filter]);

  const clear = () => { setQuery(''); setSubmitted(''); };

  /* ---------------- browse state ---------------- */
  const renderBrowse = () => (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      {state.recentSearches.length > 0 ? (
        <>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            <Pressable
              onPress={() => dispatch({ type: 'CLEAR_RECENT_SEARCHES' })}
              hitSlop={8}
              accessibilityRole="button"
            >
              <Text style={styles.clearLink}>Clear</Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recentRow}
          >
            {state.recentSearches.map((r) => (
              <Pressable
                key={r}
                onPress={() => { setQuery(r); runSearch(r); }}
                style={styles.recentChip}
                accessibilityRole="button"
                accessibilityLabel={`Search again for ${r}`}
              >
                <Ionicons name="time-outline" size={15} color={COLORS.accentDark} />
                <Text style={styles.recentText}>{r}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </>
      ) : null}

      <Text style={[styles.sectionTitle, { marginTop: SPACING.xl }]}>Categories</Text>
      <View style={styles.catGrid}>
        {SEARCH_CATEGORIES.map((c) => (
          <Pressable
            key={c.id}
            onPress={() => { setQuery(c.label); runSearch(c.label); }}
            style={({ pressed }) => [styles.catCard, { backgroundColor: c.bg }, pressed && { opacity: 0.9 }]}
            accessibilityRole="button"
            accessibilityLabel={`Browse ${c.label}`}
          >
            <View style={styles.catIcon}>
              <Icon3D name={c.icon3d} size={38} />
            </View>
            <Text style={styles.catLabel}>{c.label}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { marginTop: SPACING.xl }]}>Suggestions for You</Text>
      {SEARCH_INDEX.slice(3, 6).map((item) => (
        <ResultCard key={item.id} item={item} navigation={navigation} />
      ))}
    </ScrollView>
  );

  /* ---------------- results state ---------------- */
  const renderResults = () => (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {SEARCH_FILTERS.map((f) => (
          <Chip key={f} label={f} active={filter === f} onPress={() => setFilter(f)} />
        ))}
      </ScrollView>

      {loading ? (
        <View style={styles.scroll}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={[styles.result, SHADOWS.xs]}>
              <Skeleton width={104} height={104} radius={RADIUS.sm} />
              <View style={{ flex: 1, marginLeft: SPACING.md, gap: 8 }}>
                <Skeleton width="60%" height={12} />
                <Skeleton width="85%" height={16} />
                <Skeleton width="45%" height={12} />
                <Skeleton width="100%" height={40} radius={RADIUS.sm} />
              </View>
            </View>
          ))}
        </View>
      ) : results.length === 0 ? (
        <EmptyState
          icon3d="target"
          title={`No results for "${submitted}"`}
          message="Try a different word, or clear the filter to see everything."
          action={filter !== 'All' ? 'Clear filter' : 'Clear search'}
          onAction={() => (filter !== 'All' ? setFilter('All') : clear())}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.count}>
            {results.length} {results.length === 1 ? 'result' : 'results'}
          </Text>
          {results.map((item) => (
            <ResultCard key={item.id} item={item} navigation={navigation} />
          ))}
        </ScrollView>
      )}
    </>
  );

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.searchRow}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </Pressable>
        <View style={[styles.searchBox, submitted && styles.searchBoxActive]}>
          <Ionicons name="search" size={19} color={submitted ? COLORS.primary : COLORS.textTertiary} />
          <TextInput
            style={styles.input}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => runSearch()}
            returnKeyType="search"
            placeholder="Search lessons, books, or topics..."
            placeholderTextColor={COLORS.textTertiary}
            accessibilityLabel="Search"
            autoFocus={false}
          />
          {query ? (
            <Pressable onPress={clear} hitSlop={10} accessibilityRole="button" accessibilityLabel="Clear search">
              <View style={styles.clearBtn}>
                <Ionicons name="close" size={13} color={COLORS.textInverse} />
              </View>
            </Pressable>
          ) : null}
        </View>
      </View>

      {submitted ? renderResults() : renderBrowse()}
    </SafeAreaView>
  );
}

function ResultCard({ item, navigation }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.result, SHADOWS.xs, pressed && { opacity: 0.94 }]}
      onPress={() => navigation.navigate('CourseDetail', { courseId: 'english' })}
      accessibilityRole="button"
      accessibilityLabel={`${item.title}, ${item.kind}, ${item.duration}`}
    >
      <Image source={item.image} style={styles.resultImg} resizeMode="cover" />
      <View style={{ flex: 1, marginLeft: SPACING.md }}>
        <View style={styles.tagRow}>
          <View style={[styles.langTag, item.language === 'SWAHILI' && styles.langTagAlt]}>
            <Text style={[styles.langTagText, item.language === 'SWAHILI' && { color: COLORS.orange }]}>
              {item.language}
            </Text>
          </View>
          <View style={styles.levelTag}>
            <Text style={styles.levelTagText}>{item.level}</Text>
          </View>
        </View>
        <Text style={styles.resultTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.resultMeta}>{item.kind} • {item.duration}</Text>
        <PrimaryButton
          title={item.cta}
          size="md"
          iconRight={item.ctaIcon}
          onPress={() => navigation.navigate('CourseDetail', { courseId: 'english' })}
          style={{ marginTop: SPACING.sm }}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  searchRow: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md,
  },
  searchBox: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: RADIUS.md, borderWidth: 1.4, borderColor: COLORS.border,
    paddingHorizontal: SPACING.lg, minHeight: 52,
  },
  searchBoxActive: { borderColor: COLORS.accentDark, backgroundColor: COLORS.surface },
  input: { flex: 1, ...TYPE.body, color: COLORS.textPrimary, paddingVertical: 12 },
  clearBtn: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: COLORS.textTertiary,
    alignItems: 'center', justifyContent: 'center',
  },

  scroll: { paddingHorizontal: SPACING.xl, paddingBottom: SPACING.huge },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { ...TYPE.h3, color: COLORS.textPrimary, marginBottom: SPACING.md },
  clearLink: { ...TYPE.bodyStrong, color: COLORS.accentDark, marginBottom: SPACING.md },
  recentRow: { gap: SPACING.md, paddingRight: SPACING.xl },
  recentChip: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.lg, paddingVertical: 11,
    ...SHADOWS.xs,
  },
  recentText: { ...TYPE.bodyStrong, color: COLORS.textPrimary },

  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md },
  catCard: {
    width: '47.6%', borderRadius: RADIUS.md,
    paddingVertical: SPACING.xl, alignItems: 'center',
  },
  catIcon: {
    width: 74, height: 74, borderRadius: 37,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  catLabel: { ...TYPE.h4, color: COLORS.textPrimary },

  filterRow: { gap: SPACING.sm, paddingHorizontal: SPACING.xl, paddingBottom: SPACING.md },
  count: { ...TYPE.small, color: COLORS.textSecondary, marginBottom: SPACING.md },

  result: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  resultImg: {
    width: 104, height: 104, borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceSunken,
  },
  tagRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: 6 },
  langTag: {
    backgroundColor: COLORS.blueSurface,
    paddingHorizontal: SPACING.sm, paddingVertical: 3, borderRadius: RADIUS.xs,
  },
  langTagAlt: { backgroundColor: COLORS.orangeSurface },
  langTagText: { ...TYPE.caption, color: COLORS.blue, fontSize: 10 },
  levelTag: {
    backgroundColor: COLORS.surfaceMuted,
    paddingHorizontal: SPACING.sm, paddingVertical: 3, borderRadius: RADIUS.xs,
  },
  levelTagText: { ...TYPE.caption, color: COLORS.textSecondary, fontSize: 10 },
  resultTitle: { ...TYPE.h4, color: COLORS.textPrimary },
  resultMeta: { ...TYPE.small, color: COLORS.textSecondary, marginTop: 1 },
});
