/**
 * ReadWell design system — derived from the Figma redesign.
 * Deep teal primary, bright turquoise accent, soft neutral canvas.
 */

export const COLORS = {
  // Brand — deep teal (primary buttons, headings, active states)
  primary: '#0F766E',
  primaryDark: '#0B5C55',
  primaryDeep: '#094F49',
  primaryLight: '#14907F',
  primarySurface: '#DCEAE8',
  primarySurfaceSoft: '#EAF3F1',

  // Accent — bright turquoise (pills, XP, highlights)
  accent: '#2DD4BF',
  accentDark: '#14B8A6',
  accentSurface: '#CFF8F1',
  accentSoft: '#E6FAF6',

  // Canvas
  background: '#F6F8F9',
  backgroundAlt: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceMuted: '#F1F3F5',
  surfaceSunken: '#EDEFF2',

  // Lines
  border: '#E6E9EC',
  borderStrong: '#D5D9DE',
  divider: '#EEF0F3',

  // Text
  textPrimary: '#14181F',
  textSecondary: '#6B7280',
  textTertiary: '#9AA1AC',
  textInverse: '#FFFFFF',

  // Semantic
  success: '#16A34A',
  successSurface: '#E7F7EC',
  error: '#E5484D',
  errorSurface: '#FDECEC',
  warning: '#F5B921',
  warningSurface: '#FEF6E0',
  info: '#3B82F6',
  infoSurface: '#E8F0FE',

  // Feature accents (category tiles, badges, goal icons)
  gold: '#F5B921',
  goldSurface: '#FEF3D7',
  orange: '#FF6B35',
  orangeSurface: '#FFEDE4',
  purple: '#8B5CF6',
  purpleSurface: '#F1EAFE',
  blue: '#3B82F6',
  blueSurface: '#E7EFFE',
  pink: '#EC4899',
  pinkSurface: '#FDEAF3',
  green: '#22C55E',
  greenSurface: '#E6F9ED',

  // Leaderboard medals
  medalGold: '#F5B921',
  medalSilver: '#9CA3AF',
  medalBronze: '#C2703C',

  overlay: 'rgba(16, 22, 28, 0.55)',
  scrim: 'rgba(16, 22, 28, 0.35)',
};

export const SPACING = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  giant: 56,
};

export const RADIUS = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 32,
  pill: 999,
};

export const TYPE = {
  display: { fontSize: 34, fontWeight: '800', lineHeight: 41 },
  h1: { fontSize: 28, fontWeight: '800', lineHeight: 35 },
  h2: { fontSize: 24, fontWeight: '800', lineHeight: 31 },
  h3: { fontSize: 20, fontWeight: '700', lineHeight: 27 },
  h4: { fontSize: 17, fontWeight: '700', lineHeight: 23 },
  bodyLg: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  body: { fontSize: 15, fontWeight: '400', lineHeight: 22 },
  bodyStrong: { fontSize: 15, fontWeight: '600', lineHeight: 22 },
  small: { fontSize: 13, fontWeight: '400', lineHeight: 19 },
  smallStrong: { fontSize: 13, fontWeight: '600', lineHeight: 19 },
  caption: { fontSize: 11, fontWeight: '600', lineHeight: 15 },
  button: { fontSize: 16, fontWeight: '700', lineHeight: 22 },
};

export const SHADOWS = {
  none: {},
  xs: {
    shadowColor: '#0B1B2B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#0B1B2B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: '#0B1B2B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0B1B2B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.13,
    shadowRadius: 24,
    elevation: 10,
  },
  teal: {
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const LAYOUT = {
  screenPadding: 20,
  tabBarHeight: 76,
  headerHeight: 56,
  minTouch: 48,
};

export default { COLORS, SPACING, RADIUS, TYPE, SHADOWS, LAYOUT };
