import { StyleSheet, View, useWindowDimensions, type StyleProp, type ViewStyle } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useToasts } from './sonnerStore'
import { sonnerStyles } from './sonnerStyles'
import { SonnerToast } from './SonnerToast'

const STACK_OFFSET = 8
const STACK_SCALE_STEP = 0.05

export type ToasterProps = {
  style?: StyleProp<ViewStyle>
}

export function Toaster({ style }: ToasterProps) {
  const toasts = useToasts()
  const { width } = useWindowDimensions()
  const insets = useSafeAreaInsets()

  if (toasts.length === 0) {
    return null
  }

  return (
    <View
      pointerEvents="box-none"
      style={[styles.overlay, sonnerStyles.root, { paddingBottom: Math.max(insets.bottom, 16) }, style]}
    >
      <View pointerEvents="box-none" style={sonnerStyles.stack}>
        {toasts.reverse().map((record, i) => (
          <View
            key={record.id}
            pointerEvents={i === 0 ? 'auto' : 'none'}
            style={[
              sonnerStyles.stackItem,
              {
                transform: [
                  { translateY: i * STACK_OFFSET },
                  { scale: 1 - i * STACK_SCALE_STEP },
                ],
                zIndex: toasts.length - i,
              },
            ]}
          >
            <SonnerToast record={record} wide={width > 480} />
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
})
