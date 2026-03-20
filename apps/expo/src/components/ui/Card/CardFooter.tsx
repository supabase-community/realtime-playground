import { View } from 'react-native'

import { cardStyles } from './cardStyles'
import type { CardSectionProps } from './Card.types'

export function CardFooter({ style, ...props }: CardSectionProps) {
  return <View style={[cardStyles.footer, style]} {...props} />
}
