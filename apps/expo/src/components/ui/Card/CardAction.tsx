import { View } from 'react-native'
import type { CardSectionProps } from './Card.types'
import { cardStyles } from './cardStyles'

export function CardAction({ style, ...props }: CardSectionProps) {
  return <View style={[cardStyles.action, style]} {...props} />
}
