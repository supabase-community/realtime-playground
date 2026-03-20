import * as React from 'react'
import { Text, type StyleProp, type TextStyle } from 'react-native'

import { dialogStyles } from './dialogStyles'

export type DialogTitleProps = React.PropsWithChildren<{
  style?: StyleProp<TextStyle>
}>

export function DialogTitle({ children, style }: DialogTitleProps) {
  return <Text style={[dialogStyles.title, style]}>{children}</Text>
}
