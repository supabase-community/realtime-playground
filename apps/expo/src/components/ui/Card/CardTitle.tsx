import { Text } from 'react-native'

import { cardStyles } from './cardStyles'
import type { CardTextSectionProps } from './Card.types'

export function CardTitle({ children, style }: CardTextSectionProps) {
  return <Text style={[cardStyles.title, style]}>{children}</Text>
}
