import { View } from 'react-native'

import type { CardSectionProps } from './Card.types'
import { cardStyles } from './cardStyles'

export function CardRoot({ style, ...props }: CardSectionProps) {
  return <View style={[cardStyles.card, style]} {...props} />
}
