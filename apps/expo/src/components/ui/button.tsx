import * as React from 'react'
import {
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native'

import { colors, radii, shadow } from './theme'
import { renderTextChild } from './utils'

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
type ButtonSize = 'default' | 'xs' | 'sm' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg'

export type ButtonProps = PressableProps & {
  variant?: ButtonVariant
  size?: ButtonSize
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  children: React.ReactNode
}

const containerVariants: Record<ButtonVariant, ViewStyle> = {
  default: {
    backgroundColor: colors.primary,
  },
  destructive: {
    backgroundColor: colors.destructive,
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
    borderWidth: StyleSheet.hairlineWidth,
    ...shadow,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  link: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
}

const textVariants: Record<ButtonVariant, TextStyle> = {
  default: {
    color: colors.primaryForeground,
  },
  destructive: {
    color: colors.foreground,
  },
  outline: {
    color: colors.foreground,
  },
  secondary: {
    color: colors.secondaryForeground,
  },
  ghost: {
    color: colors.foreground,
  },
  link: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
}

const sizeVariants: Record<ButtonSize, ViewStyle> = {
  default: {
    borderRadius: radii.md,
    minHeight: 36,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  xs: {
    borderRadius: radii.md,
    minHeight: 24,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  sm: {
    borderRadius: radii.md,
    minHeight: 32,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  lg: {
    borderRadius: radii.md,
    minHeight: 40,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  icon: {
    borderRadius: radii.md,
    height: 36,
    width: 36,
  },
  'icon-xs': {
    borderRadius: radii.md,
    height: 24,
    width: 24,
  },
  'icon-sm': {
    borderRadius: radii.md,
    height: 32,
    width: 32,
  },
  'icon-lg': {
    borderRadius: radii.md,
    height: 40,
    width: 40,
  },
}

const textSizes: Record<ButtonSize, TextStyle> = {
  default: {
    fontSize: 14,
    lineHeight: 18,
  },
  xs: {
    fontSize: 12,
    lineHeight: 14,
  },
  sm: {
    fontSize: 13,
    lineHeight: 16,
  },
  lg: {
    fontSize: 15,
    lineHeight: 20,
  },
  icon: {
    fontSize: 16,
    lineHeight: 18,
  },
  'icon-xs': {
    fontSize: 12,
    lineHeight: 12,
  },
  'icon-sm': {
    fontSize: 14,
    lineHeight: 14,
  },
  'icon-lg': {
    fontSize: 18,
    lineHeight: 18,
  },
}

export function Button({
  children,
  disabled,
  size = 'default',
  style,
  textStyle,
  variant = 'default',
  ...props
}: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        containerVariants[variant],
        sizeVariants[size],
        disabled && styles.disabled,
        pressed && variant !== 'link' && styles.pressed,
        style,
      ]}
      {...props}
    >
      {renderTextChild(
        children,
        [styles.text, textVariants[variant], textSizes[size], textStyle],
        1,
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
})
