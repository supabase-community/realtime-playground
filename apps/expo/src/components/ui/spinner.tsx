import * as React from 'react'
import { ActivityIndicator, type ActivityIndicatorProps } from 'react-native'

import { colors } from './theme'

export function Spinner({
  color = colors.mutedForeground,
  size = 'small',
  ...props
}: ActivityIndicatorProps) {
  return <ActivityIndicator accessibilityLabel="Loading" color={color} size={size} {...props} />
}
