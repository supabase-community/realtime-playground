import { Text } from 'react-native'
import type { CardTextSectionProps } from './Card.types'
import { cardStyles } from './cardStyles'

export function CardDescription({ children, style }: CardTextSectionProps) {
  return <Text style={[cardStyles.description, style]}>{children}</Text>
}
