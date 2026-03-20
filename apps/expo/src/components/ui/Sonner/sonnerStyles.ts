import { StyleSheet } from 'react-native'

import { colors, radii, shadow } from '../theme'

export const sonnerStyles = StyleSheet.create({
  close: {
    alignItems: 'center',
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  copyCentered: {
    justifyContent: 'center',
  },
  description: {
    color: colors.mutedForeground,
    fontSize: 13,
    lineHeight: 18,
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: radii.full,
    height: 24,
    justifyContent: 'center',
    marginTop: 2,
    width: 24,
  },
  iconContainerCentered: {
    marginTop: 0,
  },
  root: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    zIndex: 100,
  },
  stack: {
    position: 'relative',
  },
  stackItem: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  stackItemFront: {
    position: 'relative',
  },
  title: {
    color: colors.foreground,
    fontSize: 14,
    fontWeight: '700',
  },
  toast: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: colors.popover,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    ...shadow,
  },
  toastWide: {
    alignSelf: 'center',
    width: 420,
  },
  toastCentered: {
    alignItems: 'center',
  },
})
