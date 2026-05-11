import type * as React from 'react'
import { type StyleProp, Text, type TextStyle } from 'react-native'

import { selectStyles } from './selectStyles'

export type SelectLabelProps = React.PropsWithChildren<{
  style?: StyleProp<TextStyle>
}>

export function SelectLabel({ children, style }: SelectLabelProps) {
  return <Text style={[selectStyles.label, style]}>{children}</Text>
}
