import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native'

import { dialogStyles } from './dialogStyles'

export type DialogOverlayProps = PressableProps & {
  style?: StyleProp<ViewStyle>
}

export function DialogOverlay({ style, ...props }: DialogOverlayProps) {
  return <Pressable style={[dialogStyles.overlay, style]} {...props} />
}
