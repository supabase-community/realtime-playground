import { useHeaderHeight } from '@react-navigation/elements'
import type { StyleProp, ViewProps, ViewStyle } from 'react-native'
import { ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { colors } from '../theme'

export type ScreenProps = ViewProps & {
  style?: StyleProp<ViewStyle>
  scrollable?: boolean
}

export function Screen({ style, scrollable = true, ...props }: ScreenProps) {
  const headerHeight = useHeaderHeight()
  const insets = useSafeAreaInsets()

  const topInset = Math.max(headerHeight, insets.top)

  if (scrollable) {
    return (
      <SafeAreaView style={[styles.root]} {...props} edges={['left', 'right', 'bottom']}>
        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: topInset }, style]}>
          {props.children}
        </ScrollView>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.root, style]} {...props} edges={['left', 'right', 'bottom']} />
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingTop: 16,
  },
})
