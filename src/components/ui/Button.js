import React from 'react';
import { Text, StyleSheet, ActivityIndicator, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPE, SHADOWS, LAYOUT } from '../../theme';

/**
 * Primary CTA — solid deep teal, full width by default.
 */
export function PrimaryButton({
  title, onPress, loading, disabled, style, icon, iconRight, size = 'lg', testID,
}) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: !!isDisabled, busy: !!loading }}
      style={({ pressed }) => [
        styles.base,
        size === 'md' && styles.md,
        styles.primary,
        !isDisabled && SHADOWS.sm,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.textInverse} size="small" />
      ) : (
        <View style={styles.row}>
          {icon ? <Ionicons name={icon} size={19} color={COLORS.textInverse} style={styles.iconL} /> : null}
          <Text style={[styles.primaryLabel, size === 'md' && styles.labelMd]} numberOfLines={1}>
            {title}
          </Text>
          {iconRight ? <Ionicons name={iconRight} size={19} color={COLORS.textInverse} style={styles.iconR} /> : null}
        </View>
      )}
    </Pressable>
  );
}

/**
 * Secondary — outlined, used for "Keep free", "Review Lesson".
 */
export function SecondaryButton({ title, onPress, disabled, style, icon, size = 'lg', testID }) {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [
        styles.base,
        size === 'md' && styles.md,
        styles.secondary,
        pressed && !disabled && styles.pressedLight,
        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.row}>
        {icon ? <Ionicons name={icon} size={19} color={COLORS.primary} style={styles.iconL} /> : null}
        <Text style={[styles.secondaryLabel, size === 'md' && styles.labelMd]} numberOfLines={1}>
          {title}
        </Text>
      </View>
    </Pressable>
  );
}

/**
 * Tonal — filled with the pale teal surface. Lower emphasis than primary.
 */
export function TonalButton({ title, onPress, disabled, style, icon, size = 'lg', testID }) {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [
        styles.base,
        size === 'md' && styles.md,
        styles.tonal,
        pressed && !disabled && styles.pressedLight,
        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.row}>
        {icon ? <Ionicons name={icon} size={19} color={COLORS.primary} style={styles.iconL} /> : null}
        <Text style={[styles.secondaryLabel, size === 'md' && styles.labelMd]}>{title}</Text>
      </View>
    </Pressable>
  );
}

export function TextButton({ title, onPress, style, color, testID }) {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      hitSlop={10}
      style={({ pressed }) => [style, pressed && { opacity: 0.6 }]}
    >
      <Text style={[styles.textLabel, color && { color }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 54,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  md: { minHeight: LAYOUT.minTouch, borderRadius: RADIUS.sm },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  primary: { backgroundColor: COLORS.primary },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.borderStrong,
  },
  tonal: { backgroundColor: COLORS.primarySurface },
  pressed: { backgroundColor: COLORS.primaryDark, transform: [{ scale: 0.99 }] },
  pressedLight: { backgroundColor: COLORS.surfaceMuted },
  disabled: { opacity: 0.45 },
  primaryLabel: { ...TYPE.button, color: COLORS.textInverse },
  secondaryLabel: { ...TYPE.button, color: COLORS.primary },
  labelMd: { fontSize: 15 },
  textLabel: { ...TYPE.bodyStrong, color: COLORS.primary },
  iconL: { marginRight: SPACING.sm },
  iconR: { marginLeft: SPACING.sm },
});

export default PrimaryButton;
