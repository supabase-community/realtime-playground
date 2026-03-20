import { Text, type StyleProp, type TextStyle } from 'react-native'

import { useSelectContext } from './SelectContext'
import { selectStyles } from './selectStyles'

export type SelectValueProps = {
  placeholder?: string
  style?: StyleProp<TextStyle>
}

export function SelectValue({ placeholder = 'Select an option', style }: SelectValueProps) {
  const { selectedLabel } = useSelectContext()

  return (
    <Text
      numberOfLines={1}
      style={[selectStyles.value, !selectedLabel && selectStyles.placeholder, style]}
    >
      {selectedLabel ?? placeholder}
    </Text>
  )
}
