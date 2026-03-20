import * as React from 'react'
import { StyleSheet, Text, type StyleProp, type TextProps, type TextStyle } from 'react-native'

import { colors } from './theme'

export type LabelProps = TextProps & {
  style?: StyleProp<TextStyle>
}

export function Label({ style, ...props }: LabelProps) {
  return <Text style={[styles.label, style]} {...props} />
}

const styles = StyleSheet.create({
  label: {
    color: colors.foreground,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
})
