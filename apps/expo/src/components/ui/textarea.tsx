import * as React from 'react'
import {
  StyleSheet,
  TextInput,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
} from 'react-native'

import { inputStyles } from './input'
import { colors } from './theme'

export type TextareaProps = TextInputProps & {
  style?: StyleProp<TextStyle>
}

export const Textarea = React.forwardRef<TextInput, TextareaProps>(function Textarea(
  {
    editable = true,
    multiline = true,
    numberOfLines = 4,
    placeholderTextColor = colors.mutedForeground,
    style,
    ...props
  },
  ref,
) {
  return (
    <TextInput
      ref={ref}
      editable={editable}
      multiline={multiline}
      numberOfLines={numberOfLines}
      placeholderTextColor={placeholderTextColor}
      style={[styles.base, inputStyles.base, !editable && inputStyles.disabled, style]}
      textAlignVertical="top"
      {...props}
    />
  )
})

const styles = StyleSheet.create({
  base: {
    minHeight: 96,
    paddingTop: 12,
  },
})
