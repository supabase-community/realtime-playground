import { SymbolView } from 'expo-symbols'
import { Pressable, StyleSheet } from 'react-native'

import { colors, radii } from '../ui/theme'

const infoSymbol = {
  ios: 'info.circle',
  android: 'info',
  web: 'info',
} as const

type HeaderInfoButtonProps = {
  onPress: () => void
}

export function HeaderInfoButton({ onPress }: HeaderInfoButtonProps) {
  return (
    <Pressable
      accessibilityHint="Opens the info sheet"
      accessibilityLabel="Open info sheet"
      accessibilityRole="button"
      hitSlop={10}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
    >
      <SymbolView
        fallback={null}
        name={infoSymbol}
        size={20}
        tintColor={colors.foreground}
        weight="semibold"
      />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.75,
  },
})
