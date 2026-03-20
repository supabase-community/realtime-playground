import { Text } from 'react-native'

import { cardStyles } from './cardStyles'
import type { CardTextSectionProps } from './Card.types'

export function CardDescription({ children, style }: CardTextSectionProps) {
  return <Text style={[cardStyles.description, style]}>{children}</Text>
}
