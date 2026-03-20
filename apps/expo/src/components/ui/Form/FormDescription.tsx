import { Text, type TextProps } from 'react-native'

import { colors } from '../theme'
import { useFormField } from './useFormField'

export function FormDescription({ style, ...props }: TextProps) {
  const { formDescriptionId } = useFormField()

  return (
    <Text
      nativeID={formDescriptionId}
      style={[{ color: colors.mutedForeground, fontSize: 14, lineHeight: 20 }, style]}
      {...props}
    />
  )
}
