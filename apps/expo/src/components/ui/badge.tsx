import * as React from 'react'
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native'

import { colors, radii } from './theme'
import { renderTextChild } from './utils'

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'

type BadgeProps = React.PropsWithChildren<{
  variant?: BadgeVariant
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
}>

const containerVariants: Record<BadgeVariant, ViewStyle> = {
  default: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  destructive: {
    backgroundColor: colors.destructive,
    borderColor: colors.destructive,
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  link: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    paddingHorizontal: 0,
  },
}

const textVariants: Record<BadgeVariant, TextStyle> = {
  default: {
    color: colors.primaryForeground,
  },
  secondary: {
    color: colors.secondaryForeground,
  },
  destructive: {
    color: colors.foreground,
  },
  outline: {
    color: colors.foreground,
  },
  ghost: {
    color: colors.foreground,
  },
  link: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
}

export function Badge({ children, variant = 'default', style, textStyle }: BadgeProps) {
  return (
    <View style={[styles.base, containerVariants[variant], style]}>
      {renderTextChild(children, [styles.text, textVariants[variant], textStyle], 1)}
    </View>
  )
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    borderRadius: radii.full,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 4,
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
})
