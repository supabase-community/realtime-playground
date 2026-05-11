import type * as React from 'react'
import { type StyleProp, StyleSheet, Text, type TextStyle } from 'react-native'

import { colors } from '../theme'

export type DialogDescriptionProps = React.PropsWithChildren<{
  style?: StyleProp<TextStyle>
}>

export function DialogDescription({ children, style }: DialogDescriptionProps) {
  return <Text style={[styles.description, style]}>{children}</Text>
}

const styles = StyleSheet.create({
  description: {
    color: colors.mutedForeground,
    fontSize: 14,
    lineHeight: 20,
  },
})
