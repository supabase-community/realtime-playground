import * as React from 'react'
import { Modal, Pressable, ScrollView, View, type StyleProp, type ViewStyle } from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSelectContext } from './SelectContext'
import { selectStyles } from './selectStyles'

export type SelectContentProps = React.PropsWithChildren<{
  align?: 'center' | 'start' | 'end'
  position?: 'item-aligned' | 'popper'
  style?: StyleProp<ViewStyle>
}>

export function SelectContent({ children, style }: SelectContentProps) {
  const { open, setOpen } = useSelectContext()
  const insets = useSafeAreaInsets()

  return (
    <Modal animationType="fade" onRequestClose={() => setOpen(false)} transparent visible={open}>
      <View style={selectStyles.modalRoot}>
        <Pressable onPress={() => setOpen(false)} style={{ position: 'absolute', inset: 0 }} />
        <View style={[selectStyles.content, style]}>
          <ScrollView
            contentContainerStyle={[
              selectStyles.scrollViewContent,
              { paddingBottom: insets.bottom },
            ]}
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}
