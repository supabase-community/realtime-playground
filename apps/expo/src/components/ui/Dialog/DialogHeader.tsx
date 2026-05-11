import { type StyleProp, StyleSheet, View, type ViewProps, type ViewStyle } from 'react-native'

export type DialogHeaderProps = ViewProps & {
  style?: StyleProp<ViewStyle>
}

export function DialogHeader({ style, ...props }: DialogHeaderProps) {
  return <View style={[styles.header, style]} {...props} />
}

const styles = StyleSheet.create({
  header: {
    gap: 8,
  },
})
