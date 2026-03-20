import * as React from 'react'
import { Text, type StyleProp, type TextStyle } from 'react-native'

import { dialogStyles } from './dialogStyles'

export type DialogDescriptionProps = React.PropsWithChildren<{
  style?: StyleProp<TextStyle>
}>

export function DialogDescription({ children, style }: DialogDescriptionProps) {
  return <Text style={[dialogStyles.description, style]}>{children}</Text>
}
