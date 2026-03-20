import * as React from 'react'
import { Text, type StyleProp, type TextStyle } from 'react-native'

import { selectStyles } from './selectStyles'

export type SelectLabelProps = React.PropsWithChildren<{
  style?: StyleProp<TextStyle>
}>

export function SelectLabel({ children, style }: SelectLabelProps) {
  return <Text style={[selectStyles.label, style]}>{children}</Text>
}
