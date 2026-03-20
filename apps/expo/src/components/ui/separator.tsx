import * as React from 'react'
import { StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native'

import { colors } from './theme'

type SeparatorProps = ViewProps & {
  decorative?: boolean
  orientation?: 'horizontal' | 'vertical'
  style?: StyleProp<ViewStyle>
}

export function Separator({
  accessibilityElementsHidden = true,
  decorative = true,
  importantForAccessibility = 'no-hide-descendants',
  orientation = 'horizontal',
  style,
  ...props
}: SeparatorProps) {
  return (
    <View
      accessibilityElementsHidden={decorative ? accessibilityElementsHidden : undefined}
      importantForAccessibility={decorative ? importantForAccessibility : undefined}
      style={[styles.base, orientation === 'horizontal' ? styles.horizontal : styles.vertical, style]}
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.border,
    flexShrink: 0,
  },
  horizontal: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
  vertical: {
    height: '100%',
    width: StyleSheet.hairlineWidth,
  },
})
