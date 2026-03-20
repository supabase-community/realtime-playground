import React, { useEffect } from 'react'
import { Pressable, Text, type PressableProps, type StyleProp, type ViewStyle } from 'react-native'

import { useSelectContext } from './SelectContext'
import { selectStyles } from './selectStyles'

export type SelectItemProps = PressableProps & {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
  value: string
}

export function SelectItem({ children, style, value, ...props }: SelectItemProps) {
  const { registerItem, setValue, value: selectedValue } = useSelectContext()
  const label =
    typeof children === 'string' || typeof children === 'number' ? String(children) : value

  useEffect(() => {
    registerItem(value, label)
  }, [label, registerItem, value])

  const selected = selectedValue === value

  return (
    <Pressable
      accessibilityRole="menuitem"
      onPress={() => setValue(value)}
      style={({ pressed }) => [
        selectStyles.item,
        selected && selectStyles.itemSelected,
        pressed && selectStyles.itemPressed,
        style,
      ]}
      {...props}
    >
      <Text style={[selectStyles.itemText, selected && selectStyles.itemTextSelected]}>
        {children}
      </Text>
      {selected ? <Text style={selectStyles.itemCheck}>x</Text> : null}
    </Pressable>
  )
}
