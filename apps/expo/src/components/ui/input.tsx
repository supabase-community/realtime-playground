import * as React from 'react'
import {
  StyleSheet,
  TextInput,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native'

import { colors, radii } from './theme'

export type InputProps = TextInputProps & {
  style?: StyleProp<TextStyle>
}

export const inputStyles = StyleSheet.create({
  base: {
    backgroundColor: 'transparent',
    borderColor: colors.input,
    borderRadius: radii.md,
    borderWidth: StyleSheet.hairlineWidth,
    color: colors.foreground,
    fontSize: 15,
    minHeight: 36,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  disabled: {
    opacity: 0.5,
  },
})

export const inputContainerStyle = StyleSheet.create({
  invalid: {
    borderColor: colors.destructive,
  } satisfies ViewStyle,
})

export const Input = React.forwardRef<TextInput, InputProps>(function Input(
  { editable = true, placeholderTextColor = colors.mutedForeground, style, ...props },
  ref,
) {
  return (
    <TextInput
      ref={ref}
      editable={editable}
      placeholderTextColor={placeholderTextColor}
      style={[inputStyles.base, !editable && inputStyles.disabled, style]}
      {...props}
    />
  )
})
