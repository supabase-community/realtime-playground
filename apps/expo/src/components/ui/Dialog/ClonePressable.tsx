import * as React from 'react'
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native'

import { composeEventHandlers } from '../utils'

export type TriggerProps = PressableProps & {
  asChild?: boolean
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
}

export function ClonePressable({
  asChild = false,
  children,
  onPress,
  style,
  ...props
}: TriggerProps) {
  if (asChild && React.isValidElement(children)) {
    const childElement = children as React.ReactElement<PressableProps>
    const childProps = childElement.props as PressableProps & {
      style?: StyleProp<ViewStyle>
    }

    return React.cloneElement(childElement, {
      ...props,
      ...childProps,
      onPress: composeEventHandlers(childProps.onPress, onPress),
      style: [style, childProps.style],
    })
  }

  return (
    <Pressable onPress={onPress} style={style} {...props}>
      {children}
    </Pressable>
  )
}
