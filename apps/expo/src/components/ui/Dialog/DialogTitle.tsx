import type * as React from 'react'
import { type StyleProp, StyleSheet, Text, type TextStyle } from 'react-native'

import { colors } from '../theme'

export type DialogTitleProps = React.PropsWithChildren<{
  style?: StyleProp<TextStyle>
}>

export function DialogTitle({ children, style }: DialogTitleProps) {
  return <Text style={[styles.title, style]}>{children}</Text>
}

const styles = StyleSheet.create({
  title: {
    color: colors.foreground,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
})
