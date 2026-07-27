import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, Animated, Easing } from 'react-native';
import { COLORS, SPACING, RADIUS, TYPE, SHADOWS } from '../theme';
import { PrimaryButton, Icon3D } from './ui';

const SPARKS = [
  { x: 0.14, y: 0.16, c: '#2DD4BF', s: 9 },
  { x: 0.80, y: 0.12, c: '#5EEAD4', s: 8 },
  { x: 0.88, y: 0.34, c: '#FCD34D', s: 12 },
  { x: 0.10, y: 0.42, c: '#FCD34D', s: 10 },
];

/**
 * Celebration modal — trophy inside a glowing halo.
 */
export default function AchievementModal({
  visible, onClose, title = 'New Achievement!', message, cta = 'Awesome',
}) {
  const pop = useRef(new Animated.Value(0.7)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) { pop.setValue(0.7); glow.setValue(0); return; }
    Animated.parallel([
      Animated.spring(pop, { toValue: 1, tension: 55, friction: 6, useNativeDriver: true }),
      Animated.timing(glow, {
        toValue: 1, duration: 600, easing: Easing.out(Easing.quad), useNativeDriver: true,
      }),
    ]).start();
  }, [visible, pop, glow]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Animated.View style={[styles.sheet, { transform: [{ scale: pop }] }]}>
          <View style={styles.art}>
            {SPARKS.map((s, i) => (
              <Animated.View
                key={i}
                style={{
                  position: 'absolute',
                  left: `${s.x * 100}%`,
                  top: `${s.y * 100}%`,
                  width: s.s, height: s.s, borderRadius: s.s / 2,
                  backgroundColor: s.c,
                  opacity: glow,
                }}
              />
            ))}
            <Animated.View style={[styles.halo, { opacity: glow }]} />
            <View style={styles.disc}>
              <Icon3D name="trophy" size={68} />
            </View>
          </View>

          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}

          <PrimaryButton
            title={cta}
            icon="thumbs-up"
            onPress={onClose}
            style={{ marginTop: SPACING.xl, alignSelf: 'stretch' }}
          />
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  sheet: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  art: { width: '100%', height: 210, alignItems: 'center', justifyContent: 'center' },
  halo: {
    position: 'absolute',
    width: 190, height: 190, borderRadius: 95,
    backgroundColor: '#FEF3C7',
  },
  disc: {
    width: 116, height: 116, borderRadius: 58,
    backgroundColor: COLORS.gold,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 5, borderColor: '#FFFFFF',
    ...SHADOWS.md,
  },
  title: { ...TYPE.h1, color: COLORS.textPrimary, textAlign: 'center', marginTop: SPACING.md },
  message: { ...TYPE.bodyLg, color: COLORS.accentDark, textAlign: 'center', marginTop: SPACING.sm },
});
