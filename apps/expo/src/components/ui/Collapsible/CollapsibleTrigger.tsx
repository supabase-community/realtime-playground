import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native'

import { composeEventHandlers } from '../utils'
import { useCollapsibleContext } from './CollapsibleContext'

export type CollapsibleTriggerProps = PressableProps & {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
}

export function CollapsibleTrigger({
  children,
  onPress,
  style,
  ...props
}: CollapsibleTriggerProps) {
  const { open, setOpen } = useCollapsibleContext()

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ expanded: open }}
      onPress={composeEventHandlers(onPress, () => setOpen(!open))}
      style={style}
      {...props}
    >
      {children}
    </Pressable>
  )
}
