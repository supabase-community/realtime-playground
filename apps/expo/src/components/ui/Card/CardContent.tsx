import { View } from 'react-native'

import { cardStyles } from './cardStyles'
import type { CardSectionProps } from './Card.types'

export function CardContent({ style, ...props }: CardSectionProps) {
  return <View style={[cardStyles.content, style]} {...props} />
}
