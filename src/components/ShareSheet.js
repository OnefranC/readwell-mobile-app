import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Modal, Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPE, SHADOWS } from '../theme';
import { SHARE_TARGETS } from '../constants/data';

/**
 * Bottom share sheet. "Copy link" confirms inline rather than silently closing.
 */
export default function ShareSheet({ visible, onClose, title }) {
  const [copied, setCopied] = useState(false);

  const pick = (id) => {
    if (id === 'copy') {
      setCopied(true);
      setTimeout(() => { setCopied(false); onClose && onClose(); }, 900);
      return;
    }
    onClose && onClose();
  };

  const row1 = SHARE_TARGETS.slice(0, 5);
  const row2 = SHARE_TARGETS.slice(5);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close share sheet" />
      <View style={styles.sheet}>
        <View style={styles.grabber} />
        <Text style={styles.title}>Share to</Text>
        {title ? <Text style={styles.subject} numberOfLines={1}>{title}</Text> : null}

        <View style={styles.row}>
          {row1.map((t) => (
            <Pressable
              key={t.id}
              onPress={() => pick(t.id)}
              style={({ pressed }) => [styles.item, pressed && { opacity: 0.7 }]}
              accessibilityRole="button"
              accessibilityLabel={`Share to ${t.label}`}
            >
              <View style={[styles.iconCircle, t.id === 'more' && styles.iconOutline]}>
                <Ionicons name={t.icon} size={26} color={t.color} />
              </View>
              <Text style={styles.label}>{t.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={[styles.row, { marginTop: SPACING.lg }]}>
          {row2.map((t) => (
            <Pressable
              key={t.id}
              onPress={() => pick(t.id)}
              style={({ pressed }) => [styles.item, pressed && { opacity: 0.7 }]}
              accessibilityRole="button"
              accessibilityLabel={t.label}
            >
              <View style={[styles.iconCircle, styles.iconOutline]}>
                <Ionicons name={t.icon} size={24} color={t.color} />
              </View>
              <Text style={styles.label}>
                {t.id === 'copy' && copied ? 'Copied!' : t.label}
              </Text>
            </Pressable>
          ))}
          <View style={styles.item} />
          <View style={styles.item} />
          <View style={styles.item} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: COLORS.scrim },
  sheet: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.xl,
    paddingBottom: SPACING.xxxl,
    ...SHADOWS.lg,
  },
  grabber: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: COLORS.borderStrong,
    alignSelf: 'center', marginBottom: SPACING.lg,
  },
  title: { ...TYPE.h3, color: COLORS.textPrimary },
  subject: { ...TYPE.small, color: COLORS.textSecondary, marginTop: 2 },
  row: { flexDirection: 'row', marginTop: SPACING.xl },
  item: { flex: 1, alignItems: 'center' },
  iconCircle: {
    width: 58, height: 58, borderRadius: 29,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.surface,
    ...SHADOWS.xs,
  },
  iconOutline: { borderWidth: 1.2, borderColor: COLORS.borderStrong, backgroundColor: 'transparent' },
  label: { ...TYPE.small, color: COLORS.textPrimary, marginTop: 7, fontSize: 12 },
});
