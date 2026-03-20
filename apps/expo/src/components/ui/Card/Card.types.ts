import type * as React from 'react'
import type { StyleProp, TextStyle, ViewProps, ViewStyle } from 'react-native'

export type CardSectionProps = ViewProps & {
  style?: StyleProp<ViewStyle>
}

export type CardTextSectionProps = React.PropsWithChildren<{
  style?: StyleProp<TextStyle>
}>
