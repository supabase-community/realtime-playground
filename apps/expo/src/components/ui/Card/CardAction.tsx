import { View } from 'react-native'

import { cardStyles } from './cardStyles'
import type { CardSectionProps } from './Card.types'

export function CardAction({ style, ...props }: CardSectionProps) {
  return <View style={[cardStyles.action, style]} {...props} />
}
