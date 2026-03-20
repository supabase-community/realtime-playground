import { StyleSheet } from 'react-native'

import { colors, radii, shadow } from '../theme'

export const dialogStyles = StyleSheet.create({
  closeButton: {
    alignItems: 'center',
    borderRadius: radii.full,
    height: 28,
    justifyContent: 'center',
    position: 'absolute',
    right: 12,
    top: 12,
    width: 28,
  },
  closeText: {
    color: colors.mutedForeground,
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 18,
  },
  content: {
    backgroundColor: colors.popover,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    borderColor: colors.border,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 16,
    maxWidth: 720,
    padding: 24,
    width: '100%',
    zIndex: 2,
    ...shadow,
  },
  description: {
    color: colors.mutedForeground,
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'flex-end',
  },
  header: {
    gap: 8,
  },
  modalRoot: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
    zIndex: 1,
  },
  title: {
    color: colors.foreground,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
})
