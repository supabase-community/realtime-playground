import { StyleSheet } from 'react-native'

import { colors, radii, shadow } from '../theme'

export const cardStyles = StyleSheet.create({
  action: {
    marginLeft: 'auto',
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radii.xl,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 20,
    paddingVertical: 24,
    ...shadow,
  },
  content: {
    gap: 12,
    paddingHorizontal: 24,
  },
  description: {
    color: colors.mutedForeground,
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
  },
  header: {
    gap: 8,
    paddingHorizontal: 24,
  },
  title: {
    color: colors.foreground,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
})
