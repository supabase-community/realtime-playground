import { Platform, StyleSheet, type TextStyle, type ViewStyle } from 'react-native'

export const colors = {
  background: '#111315',
  foreground: '#f3f4f6',
  card: '#1b1f22',
  cardForeground: '#f3f4f6',
  popover: '#1b1f22',
  popoverForeground: '#f3f4f6',
  primary: '#53d18d',
  primaryForeground: '#08110c',
  secondary: '#23272b',
  secondaryForeground: '#f3f4f6',
  muted: '#23272b',
  mutedForeground: '#9ca3af',
  accent: '#17342b',
  accentForeground: '#53d18d',
  destructive: '#e35d5d',
  border: 'rgba(255, 255, 255, 0.12)',
  input: 'rgba(255, 255, 255, 0.14)',
  ring: '#53d18d',
  overlay: 'rgba(0, 0, 0, 0.65)',
  success: '#53d18d',
  info: '#60a5fa',
  warning: '#fbbf24',
  error: '#f87171',
} as const

export const radii = {
  sm: 6,
  md: 8,
  lg: 10,
  xl: 16,
  full: 999,
} as const

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const

export const typography = StyleSheet.create({
  title: {
    color: colors.foreground,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30,
  } satisfies TextStyle,
  sectionTitle: {
    color: colors.foreground,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  } satisfies TextStyle,
  body: {
    color: colors.foreground,
    fontSize: 15,
    lineHeight: 22,
  } satisfies TextStyle,
  muted: {
    color: colors.mutedForeground,
    fontSize: 14,
    lineHeight: 20,
  } satisfies TextStyle,
  label: {
    color: colors.foreground,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  } satisfies TextStyle,
  caption: {
    color: colors.mutedForeground,
    fontSize: 12,
    lineHeight: 16,
  } satisfies TextStyle,
})

export const surfaces = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  } satisfies ViewStyle,
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radii.xl,
    borderWidth: StyleSheet.hairlineWidth,
  } satisfies ViewStyle,
})

export const shadow = Platform.select<ViewStyle>({
  ios: {
    shadowColor: '#000000',
    shadowOpacity: 0.24,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  android: {
    elevation: 6,
  },
  default: {
    shadowColor: '#000000',
    shadowOpacity: 0.24,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
})!
