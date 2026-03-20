import { Text, type TextProps } from 'react-native'

import { colors } from '../theme'
import { useFormField } from './useFormField'

export function FormMessage({ children, style, ...props }: TextProps) {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? '') : children

  if (!body) {
    return null
  }

  return (
    <Text
      nativeID={formMessageId}
      style={[{ color: colors.destructive, fontSize: 14, lineHeight: 20 }, style]}
      {...props}
    >
      {body}
    </Text>
  )
}
