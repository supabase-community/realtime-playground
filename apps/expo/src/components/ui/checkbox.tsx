import * as React from 'react'
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native'

import { colors } from './theme'

export type CheckboxProps = Omit<PressableProps, 'onChange'> & {
  checked?: boolean | 'indeterminate'
  disabled?: boolean
  onCheckedChange?: (checked: boolean) => void
  style?: StyleProp<ViewStyle>
  indicatorStyle?: StyleProp<TextStyle>
}

export function Checkbox({
  accessibilityLabel,
  checked = false,
  disabled = false,
  indicatorStyle,
  onCheckedChange,
  style,
  ...props
}: CheckboxProps) {
  const isChecked = checked === true
  const isIndeterminate = checked === 'indeterminate'

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="checkbox"
      accessibilityState={{
        checked: isIndeterminate ? 'mixed' : isChecked,
        disabled,
      }}
      disabled={disabled}
      onPress={() => onCheckedChange?.(!isChecked)}
      style={({ pressed }) => [
        styles.base,
        isChecked || isIndeterminate ? styles.checked : styles.unchecked,
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
      {...props}
    >
      {(isChecked || isIndeterminate) && (
        <View style={styles.indicatorContainer}>
          <Text style={[styles.indicator, indicatorStyle]}>{isIndeterminate ? '-' : 'x'}</Text>
        </View>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    height: 18,
    justifyContent: 'center',
    width: 18,
  },
  checked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  indicator: {
    color: colors.primaryForeground,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 12,
    textAlign: 'center',
  },
  indicatorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
  unchecked: {
    backgroundColor: colors.input,
    borderColor: colors.input,
  },
})
