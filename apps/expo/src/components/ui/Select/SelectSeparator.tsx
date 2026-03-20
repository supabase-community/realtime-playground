import { View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native'

import { selectStyles } from './selectStyles'

export type SelectSeparatorProps = ViewProps & {
  style?: StyleProp<ViewStyle>
}

export function SelectSeparator({ style, ...props }: SelectSeparatorProps) {
  return <View style={[selectStyles.separator, style]} {...props} />
}
