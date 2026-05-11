import { View } from 'react-native'
import type { CardSectionProps } from './Card.types'
import { cardStyles } from './cardStyles'

export function CardHeader({ style, ...props }: CardSectionProps) {
  return <View style={[cardStyles.header, style]} {...props} />
}
