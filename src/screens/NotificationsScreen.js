import React, { useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPE, SHADOWS } from '../theme';
import { NOTIFICATIONS } from '../constants/data';
import { Header, EmptyState } from '../components/ui';
import { useApp } from '../context/AppContext';

export default function NotificationsScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const read = state.notificationsRead;

  const groups = useMemo(() => {
    const out = {};
    NOTIFICATIONS.forEach((n) => {
      (out[n.group] = out[n.group] || []).push(n);
    });
    return out;
  }, []);

  const unreadCount = NOTIFICATIONS.filter((n) => n.unread && !read.includes(n.id)).length;

  const markAll = () =>
    dispatch({ type: 'MARK_NOTIFICATIONS_READ', payload: NOTIFICATIONS.map((n) => n.id) });

  if (NOTIFICATIONS.length === 0) {
    return (
      <SafeAreaView style={styles.root}>
        <Header title="Notifications" onBack={() => navigation.goBack()} />
        <EmptyState
          icon3d="bell"
          title="You're all caught up"
          message="New reminders and achievements will appear here."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Notifications" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {Object.entries(groups).map(([group, items], gi) => (
          <View key={group} style={gi > 0 ? { marginTop: SPACING.xl } : null}>
            <View style={styles.groupHead}>
              <Text style={styles.groupTitle}>{group}</Text>
              {group === 'Today' && unreadCount > 0 ? (
                <View style={styles.newPill}>
                  <Text style={styles.newText}>{unreadCount} New</Text>
                </View>
              ) : null}
              {gi === 0 && unreadCount > 0 ? (
                <Pressable onPress={markAll} hitSlop={8} style={{ marginLeft: 'auto' }} accessibilityRole="button">
                  <Text style={styles.markAll}>Mark all as read</Text>
                </Pressable>
              ) : null}
            </View>

            {items.map((n) => {
              const isUnread = n.unread && !read.includes(n.id);
              return (
                <Pressable
                  key={n.id}
                  onPress={() =>
                    dispatch({ type: 'MARK_NOTIFICATIONS_READ', payload: [...read, n.id] })
                  }
                  style={({ pressed }) => [
                    styles.item,
                    isUnread && styles.itemUnread,
                    pressed && { opacity: 0.85 },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`${n.title}. ${n.body}${isUnread ? '. Unread' : ''}`}
                >
                  <View style={[styles.icon, { backgroundColor: n.tint }]}>
                    <Ionicons name={n.icon} size={20} color={n.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.itemHead}>
                      <Text style={styles.itemTitle} numberOfLines={1}>{n.title}</Text>
                      <Text style={styles.time}>{n.time}</Text>
                      {isUnread ? <View style={styles.dot} /> : null}
                    </View>
                    <Text style={styles.body} numberOfLines={2}>{n.body}</Text>
                    {n.detail ? (
                      <Text style={styles.detail} numberOfLines={1}>{n.detail}</Text>
                    ) : null}
                  </View>
                </Pressable>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingHorizontal: SPACING.xl, paddingBottom: SPACING.huge },

  groupHead: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  groupTitle: { ...TYPE.bodyStrong, color: COLORS.textSecondary },
  newPill: {
    backgroundColor: COLORS.accentSurface,
    paddingHorizontal: SPACING.sm, paddingVertical: 3, borderRadius: RADIUS.xs,
  },
  newText: { ...TYPE.caption, color: COLORS.primaryDark },
  markAll: { ...TYPE.smallStrong, color: COLORS.accentDark },

  item: {
    flexDirection: 'row', gap: SPACING.md,
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1, borderColor: 'transparent',
  },
  itemUnread: { backgroundColor: COLORS.surface, borderColor: COLORS.border, ...SHADOWS.xs },
  icon: {
    width: 46, height: 46, borderRadius: 23,
    alignItems: 'center', justifyContent: 'center',
  },
  itemHead: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  itemTitle: { ...TYPE.h4, color: COLORS.textPrimary, flex: 1, fontSize: 16 },
  time: { ...TYPE.small, color: COLORS.textTertiary },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary },
  body: { ...TYPE.body, color: COLORS.textPrimary, marginTop: 3 },
  detail: { ...TYPE.small, color: COLORS.textSecondary, marginTop: 2 },
});
