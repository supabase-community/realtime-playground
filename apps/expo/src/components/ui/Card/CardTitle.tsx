import { Text } from 'react-native'
import type { CardTextSectionProps } from './Card.types'
import { cardStyles } from './cardStyles'

export function CardTitle({ children, style }: CardTextSectionProps) {
  return <Text style={[cardStyles.title, style]}>{children}</Text>
}
