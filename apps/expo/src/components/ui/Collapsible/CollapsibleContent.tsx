import { type StyleProp, StyleSheet, View, type ViewProps, type ViewStyle } from 'react-native'

import { useCollapsibleContext } from './CollapsibleContext'

export type CollapsibleContentProps = ViewProps & {
  style?: StyleProp<ViewStyle>
}

export function CollapsibleContent({ children, style, ...props }: CollapsibleContentProps) {
  const { open } = useCollapsibleContext()

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
