import * as React from 'react'
import { StyleProp, Text, TextStyle } from 'react-native'

type ControllableStateProps<T> = {
  value?: T
  defaultValue?: T
  onChange?: (value: T) => void
}

export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: ControllableStateProps<T>) {
  const [internalValue, setInternalValue] = React.useState<T | undefined>(defaultValue)
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  const setValue = React.useCallback(
    (nextValue: T | ((previousValue: T) => T)) => {
      const resolvedValue =
        typeof nextValue === 'function'
          ? (nextValue as (previousValue: T | undefined) => T)(currentValue)
          : nextValue

      if (!isControlled) {
        setInternalValue(resolvedValue)
      }

      onChange?.(resolvedValue)
    },
    [currentValue, isControlled, onChange],
  )

  return [currentValue, setValue] as const
}

export function composeEventHandlers<E>(
  originalHandler?: ((event: E) => void) | null,
  nextHandler?: ((event: E) => void) | null,
) {
  return (event: E) => {
    originalHandler?.(event)
    nextHandler?.(event)
  }
}

export function renderTextChild(
  children: React.ReactNode,
  textStyle?: StyleProp<TextStyle>,
  numberOfLines?: number,
) {
  if (typeof children === 'string' || typeof children === 'number') {
    return (
      <Text numberOfLines={numberOfLines} style={textStyle}>
        {children}
      </Text>
    )
  }

  return children
}
