import { View } from 'react-native'

import { cardStyles } from './cardStyles'
import type { CardSectionProps } from './Card.types'

export function CardHeader({ style, ...props }: CardSectionProps) {
  return <View style={[cardStyles.header, style]} {...props} />
}
