import { View } from 'react-native'
import type { CardSectionProps } from './Card.types'
import { cardStyles } from './cardStyles'

export function CardContent({ style, ...props }: CardSectionProps) {
  return <View style={[cardStyles.content, style]} {...props} />
}
