import React from 'react';
import {
  View, Text, StyleSheet, Pressable, Image, ActivityIndicator, TextInput, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPE, SHADOWS, LAYOUT } from '../../theme';

export { PrimaryButton, SecondaryButton, TonalButton, TextButton } from './Button';

/* ------------------------------------------------------------------ *
 * Screen header — back chevron, centred title, optional right slot
 * ------------------------------------------------------------------ */
export function Header({ title, onBack, right, subtitle, large, style }) {
  return (
    <View style={[styles.header, large && styles.headerLarge, style]}>
      {onBack ? (
        <Pressable
          onPress={onBack}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.5 }]}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </Pressable>
      ) : (
        <View style={styles.headerSpacer} />
      )}
      <View style={styles.headerCenter}>
        <Text style={[TYPE.h3, styles.headerTitle]} numberOfLines={1}>{title}</Text>
        {subtitle ? <Text style={styles.headerSub} numberOfLines={1}>{subtitle}</Text> : null}
      </View>
      <View style={styles.headerRight}>{right || <View style={styles.headerSpacer} />}</View>
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * Card surface
 * ------------------------------------------------------------------ */
export function Card({ children, style, onPress, elevation = 'sm', accessibilityLabel }) {
  const content = (
    <View style={[styles.card, SHADOWS[elevation], style]}>{children}</View>
  );
  if (!onPress) return content;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [pressed && { transform: [{ scale: 0.995 }], opacity: 0.95 }]}
    >
      {content}
    </Pressable>
  );
}

/* ------------------------------------------------------------------ *
 * 3D icon — renders a PNG from assets/icons3d with graceful fallback
 * ------------------------------------------------------------------ */
const ICONS_3D = {
  book: require('../../../assets/icons3d/book.png'),
  star: require('../../../assets/icons3d/star.png'),
  medal: require('../../../assets/icons3d/medal.png'),
  target: require('../../../assets/icons3d/target.png'),
  audio: require('../../../assets/icons3d/audio.png'),
  bolt: require('../../../assets/icons3d/bolt.png'),
  cap: require('../../../assets/icons3d/cap.png'),
  pencil: require('../../../assets/icons3d/pencil.png'),
  globe: require('../../../assets/icons3d/globe.png'),
  crown: require('../../../assets/icons3d/crown.png'),
  rocket: require('../../../assets/icons3d/rocket.png'),
  lock: require('../../../assets/icons3d/lock.png'),
  check: require('../../../assets/icons3d/check.png'),
  bell: require('../../../assets/icons3d/bell.png'),
  chat: require('../../../assets/icons3d/chat.png'),
  sun: require('../../../assets/icons3d/sun.png'),
  heart: require('../../../assets/icons3d/heart.png'),
  abc: require('../../../assets/icons3d/abc.png'),
  apple: require('../../../assets/icons3d/apple.png'),
  trophy: require('../../../assets/icons3d/trophy.png'),
  flame: require('../../../assets/icons3d/flame.png'),
};

export function Icon3D({ name, size = 40, style, dimmed }) {
  const src = ICONS_3D[name];
  if (!src) return <View style={[{ width: size, height: size }, style]} />;
  return (
    <Image
      source={src}
      resizeMode="contain"
      accessible={false}
      style={[{ width: size, height: size }, dimmed && { opacity: 0.35 }, style]}
    />
  );
}

/* ------------------------------------------------------------------ *
 * Progress bar
 * ------------------------------------------------------------------ */
export function ProgressBar({ value = 0, height = 8, trackColor, fillColor, style }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(pct) }}
      style={[styles.track, { height, backgroundColor: trackColor || COLORS.surfaceSunken }, style]}
    >
      <View style={[styles.fill, { width: `${pct}%`, backgroundColor: fillColor || COLORS.primary }]} />
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * Pill / chip
 * ------------------------------------------------------------------ */
export function Chip({ label, active, onPress, style, tone = 'default', size = 'md', icon }) {
  const tones = {
    default: { bg: COLORS.surface, fg: COLORS.textPrimary, border: COLORS.border },
    teal: { bg: COLORS.primarySurface, fg: COLORS.primary, border: COLORS.primarySurface },
    accent: { bg: COLORS.accentSurface, fg: COLORS.primaryDark, border: COLORS.accentSurface },
    blue: { bg: COLORS.blueSurface, fg: COLORS.blue, border: COLORS.blueSurface },
    orange: { bg: COLORS.orangeSurface, fg: COLORS.orange, border: COLORS.orangeSurface },
    grey: { bg: COLORS.surfaceMuted, fg: COLORS.textSecondary, border: COLORS.surfaceMuted },
  };
  const t = active
    ? { bg: COLORS.primary, fg: COLORS.textInverse, border: COLORS.primary }
    : tones[tone] || tones.default;

  const body = (
    <View
      style={[
        styles.chip,
        size === 'sm' && styles.chipSm,
        { backgroundColor: t.bg, borderColor: t.border },
        style,
      ]}
    >
      {icon ? <Ionicons name={icon} size={13} color={t.fg} style={{ marginRight: 5 }} /> : null}
      <Text style={[styles.chipLabel, size === 'sm' && { fontSize: 11 }, { color: t.fg }]}>
        {label}
      </Text>
    </View>
  );
  if (!onPress) return body;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!active }}
      style={({ pressed }) => pressed && { opacity: 0.7 }}
    >
      {body}
    </Pressable>
  );
}

/* ------------------------------------------------------------------ *
 * Text field
 * ------------------------------------------------------------------ */
export function Field({
  label, value, onChangeText, placeholder, secureTextEntry, icon, error, keyboardType,
  autoCapitalize, maxLength, style, hint, autoComplete, onBlur, editable = true, testID,
}) {
  const [focused, setFocused] = React.useState(false);
  const [reveal, setReveal] = React.useState(false);
  return (
    <View style={[{ marginBottom: SPACING.lg }, style]}>
      {label ? <Text style={styles.fieldLabel}>{label}</Text> : null}
      <View
        style={[
          styles.fieldBox,
          focused && styles.fieldFocused,
          !!error && styles.fieldError,
          !editable && { backgroundColor: COLORS.surfaceMuted },
        ]}
      >
        {icon ? (
          <Ionicons
            name={icon}
            size={19}
            color={focused ? COLORS.primary : COLORS.textTertiary}
            style={{ marginRight: SPACING.sm }}
          />
        ) : null}
        <TextInput
          testID={testID}
          style={styles.fieldInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textTertiary}
          secureTextEntry={secureTextEntry && !reveal}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          maxLength={maxLength}
          editable={editable}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); onBlur && onBlur(); }}
          accessibilityLabel={label}
        />
        {secureTextEntry ? (
          <Pressable
            onPress={() => setReveal((v) => !v)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={reveal ? 'Hide password' : 'Show password'}
          >
            <Ionicons name={reveal ? 'eye-off-outline' : 'eye-outline'} size={19} color={COLORS.textTertiary} />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={13} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : hint ? (
        <Text style={styles.hintText}>{hint}</Text>
      ) : null}
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * Empty state
 * ------------------------------------------------------------------ */
export function EmptyState({ icon3d = 'book', title, message, action, onAction, style }) {
  return (
    <View style={[styles.empty, style]}>
      <View style={styles.emptyIcon}>
        <Icon3D name={icon3d} size={72} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      {message ? <Text style={styles.emptyMsg}>{message}</Text> : null}
      {action ? (
        <Pressable onPress={onAction} style={styles.emptyAction} accessibilityRole="button">
          <Text style={styles.emptyActionText}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * Skeleton loading block
 * ------------------------------------------------------------------ */
export function Skeleton({ width, height = 14, radius = RADIUS.xs, style }) {
  return (
    <View
      accessible={false}
      style={[{ width, height, borderRadius: radius, backgroundColor: COLORS.surfaceSunken }, style]}
    />
  );
}

/* ------------------------------------------------------------------ *
 * Offline / inline banner
 * ------------------------------------------------------------------ */
export function Banner({ tone = 'info', icon, title, message, action, onAction, style }) {
  const tones = {
    info: { bg: COLORS.infoSurface, fg: COLORS.info, icon: 'information-circle' },
    warn: { bg: COLORS.warningSurface, fg: '#9A6B00', icon: 'warning' },
    error: { bg: COLORS.errorSurface, fg: COLORS.error, icon: 'alert-circle' },
    success: { bg: COLORS.successSurface, fg: COLORS.success, icon: 'checkmark-circle' },
    offline: { bg: COLORS.surfaceMuted, fg: COLORS.textSecondary, icon: 'cloud-offline' },
  };
  const t = tones[tone] || tones.info;
  return (
    <View style={[styles.banner, { backgroundColor: t.bg }, style]} accessibilityRole="alert">
      <Ionicons name={icon || t.icon} size={19} color={t.fg} style={{ marginTop: 1 }} />
      <View style={{ flex: 1, marginLeft: SPACING.sm }}>
        {title ? <Text style={[styles.bannerTitle, { color: t.fg }]}>{title}</Text> : null}
        {message ? <Text style={styles.bannerMsg}>{message}</Text> : null}
      </View>
      {action ? (
        <Pressable onPress={onAction} hitSlop={8} accessibilityRole="button">
          <Text style={[styles.bannerAction, { color: t.fg }]}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * Section heading with optional trailing link
 * ------------------------------------------------------------------ */
export function SectionTitle({ title, actionLabel, onAction, style }) {
  return (
    <View style={[styles.sectionRow, style]}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionLabel ? (
        <Pressable onPress={onAction} hitSlop={8} accessibilityRole="button">
          <Text style={styles.sectionAction}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * Avatar with fallback initials
 * ------------------------------------------------------------------ */
export function Avatar({ uri, name = '', size = 44, ring, ringColor, style }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
  const inner = size - (ring ? 6 : 0);
  return (
    <View
      style={[
        {
          width: size, height: size, borderRadius: size / 2,
          alignItems: 'center', justifyContent: 'center',
        },
        ring && { borderWidth: 2.5, borderColor: ringColor || COLORS.accent },
        style,
      ]}
    >
      {uri ? (
        <Image
          source={typeof uri === 'string' ? { uri } : uri}
          style={{ width: inner, height: inner, borderRadius: inner / 2 }}
        />
      ) : (
        <View
          style={{
            width: inner, height: inner, borderRadius: inner / 2,
            backgroundColor: COLORS.primarySurface,
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Text style={{ color: COLORS.primary, fontWeight: '700', fontSize: inner * 0.38 }}>
            {initials || '?'}
          </Text>
        </View>
      )}
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * Loading overlay
 * ------------------------------------------------------------------ */
export function Loader({ label, style }) {
  return (
    <View style={[styles.loader, style]}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      {label ? <Text style={styles.loaderText}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: LAYOUT.headerHeight,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  headerLarge: { minHeight: 64 },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { color: COLORS.textPrimary },
  headerSub: { ...TYPE.small, color: COLORS.textSecondary, marginTop: 1 },
  headerRight: { minWidth: 40, alignItems: 'flex-end' },
  headerSpacer: { width: 40 },
  backBtn: { width: 40, height: 40, alignItems: 'flex-start', justifyContent: 'center' },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
  },

  track: { borderRadius: RADIUS.pill, overflow: 'hidden', width: '100%' },
  fill: { height: '100%', borderRadius: RADIUS.pill },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: 9,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
  },
  chipSm: { paddingHorizontal: SPACING.md, paddingVertical: 5 },
  chipLabel: { fontSize: 14, fontWeight: '600' },

  fieldLabel: { ...TYPE.smallStrong, color: COLORS.textPrimary, marginBottom: 7 },
  fieldBox: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 54,
    borderRadius: RADIUS.sm,
    borderWidth: 1.4,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.lg,
  },
  fieldFocused: { borderColor: COLORS.primary },
  fieldError: { borderColor: COLORS.error, backgroundColor: COLORS.errorSurface },
  fieldInput: {
    flex: 1,
    ...TYPE.bodyLg,
    color: COLORS.textPrimary,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
  },
  errorRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 5 },
  errorText: { ...TYPE.small, color: COLORS.error, flex: 1 },
  hintText: { ...TYPE.small, color: COLORS.textTertiary, marginTop: 6 },

  empty: { alignItems: 'center', paddingVertical: SPACING.huge, paddingHorizontal: SPACING.xl },
  emptyIcon: {
    width: 116, height: 116, borderRadius: 58,
    backgroundColor: COLORS.surfaceMuted,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  emptyTitle: { ...TYPE.h3, color: COLORS.textPrimary, textAlign: 'center' },
  emptyMsg: {
    ...TYPE.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
    maxWidth: 300,
  },
  emptyAction: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.primarySurface,
  },
  emptyActionText: { ...TYPE.bodyStrong, color: COLORS.primary },

  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: SPACING.md,
    borderRadius: RADIUS.sm,
  },
  bannerTitle: { ...TYPE.smallStrong },
  bannerMsg: { ...TYPE.small, color: COLORS.textSecondary, marginTop: 1 },
  bannerAction: { ...TYPE.smallStrong, marginLeft: SPACING.sm },

  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  sectionTitle: { ...TYPE.h3, color: COLORS.textPrimary },
  sectionAction: { ...TYPE.smallStrong, color: COLORS.primary },

  loader: { paddingVertical: SPACING.huge, alignItems: 'center', justifyContent: 'center' },
  loaderText: { ...TYPE.small, color: COLORS.textSecondary, marginTop: SPACING.md },
});
