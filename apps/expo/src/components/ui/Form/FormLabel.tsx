import { type TextProps } from 'react-native'

import { colors } from '../theme'
import { Label } from '../label'
import { useFormField } from './useFormField'

export function FormLabel({ style, ...props }: TextProps) {
  const { error, formLabelId } = useFormField()

  return (
    <Label
      nativeID={formLabelId}
      style={[error ? { color: colors.destructive } : null, style]}
      {...props}
      accessibilityLabel={undefined}
      accessible={false}
    />
  )
}
