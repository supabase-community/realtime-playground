import { StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native'

import { useCollapsibleContext } from './CollapsibleContext'

export type CollapsibleContentProps = ViewProps & {
  forceMount?: boolean
  style?: StyleProp<ViewStyle>
}

export function CollapsibleContent({
  children,
  forceMount = false,
  style,
  ...props
}: CollapsibleContentProps) {
  const { open } = useCollapsibleContext()

  if (!open && !forceMount) {
    return null
  }

  return (
    <View style={[!open && styles.hidden, style]} {...props}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  hidden: {
    display: 'none',
  },
})
