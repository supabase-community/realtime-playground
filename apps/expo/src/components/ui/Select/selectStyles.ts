import { StyleSheet } from 'react-native'

import { colors, radii, shadow } from '../theme'

export const selectStyles = StyleSheet.create({
  chevron: {
    color: colors.mutedForeground,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
  },
  content: {
    backgroundColor: colors.popover,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    borderColor: colors.border,
    borderWidth: StyleSheet.hairlineWidth,
    maxHeight: '70%',
    width: '100%',
    ...shadow,
  },
  item: {
    alignItems: 'center',
    borderRadius: radii.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  itemCheck: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  itemPressed: {
    backgroundColor: colors.secondary,
  },
  itemSelected: {
    backgroundColor: colors.accent,
  },
  itemText: {
    color: colors.foreground,
    fontSize: 14,
    lineHeight: 18,
  },
  itemTextSelected: {
    color: colors.accentForeground,
  },
  label: {
    color: colors.mutedForeground,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  modalRoot: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  placeholder: {
    color: colors.mutedForeground,
  },
  separator: {
    backgroundColor: colors.border,
    height: StyleSheet.hairlineWidth,
    marginVertical: 6,
  },
  trigger: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: colors.input,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minWidth: 180,
    paddingHorizontal: 12,
  },
  triggerDefault: {
    minHeight: 36,
    paddingVertical: 8,
  },
  triggerInner: {
    flex: 1,
    marginRight: 12,
  },
  triggerPressed: {
    opacity: 0.85,
  },
  triggerSmall: {
    minHeight: 32,
    paddingVertical: 6,
  },
  value: {
    color: colors.foreground,
    fontSize: 14,
    lineHeight: 18,
  },
  scrollViewContent: {
    paddingHorizontal: 12,
    paddingTop: 16,
  },
})
