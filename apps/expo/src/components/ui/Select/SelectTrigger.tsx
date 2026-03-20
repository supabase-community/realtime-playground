import {
  Pressable,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native'

import { useSelectContext } from './SelectContext'
import { selectStyles } from './selectStyles'

export type SelectTriggerProps = PressableProps & {
  children: React.ReactNode
  size?: 'default' | 'sm'
  style?: StyleProp<ViewStyle>
}

export function SelectTrigger({
  children,
  size = 'default',
  style,
  ...props
}: SelectTriggerProps) {
  const { open, setOpen } = useSelectContext()

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ expanded: open }}
      onPress={() => setOpen(!open)}
      style={({ pressed }) => [
        selectStyles.trigger,
        size === 'sm' ? selectStyles.triggerSmall : selectStyles.triggerDefault,
        pressed && selectStyles.triggerPressed,
        style,
      ]}
      {...props}
    >
      <View style={selectStyles.triggerInner}>{children}</View>
      <Text style={selectStyles.chevron}>v</Text>
    </Pressable>
  )
}
