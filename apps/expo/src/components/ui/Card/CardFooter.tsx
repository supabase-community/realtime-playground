import { View } from 'react-native'
import type { CardSectionProps } from './Card.types'
import { cardStyles } from './cardStyles'

export function CardFooter({ style, ...props }: CardSectionProps) {
  return <View style={[cardStyles.footer, style]} {...props} />
}
