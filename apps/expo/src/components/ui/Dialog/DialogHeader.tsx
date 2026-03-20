import { View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native'

import { dialogStyles } from './dialogStyles'

export type DialogHeaderProps = ViewProps & {
  style?: StyleProp<ViewStyle>
}

export function DialogHeader({ style, ...props }: DialogHeaderProps) {
  return <View style={[dialogStyles.header, style]} {...props} />
}
