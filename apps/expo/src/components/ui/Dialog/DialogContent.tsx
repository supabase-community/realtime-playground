import * as React from 'react'
import {
  Modal,
  Pressable,
  Text,
  View,
  type AccessibilityRole,
  type StyleProp,
  type ViewStyle,
} from 'react-native'

import { useDialogContext } from './DialogContext'
import { DialogOverlay } from './DialogOverlay'
import { dialogStyles } from './dialogStyles'

export type DialogContentProps = React.PropsWithChildren<{
  showCloseButton?: boolean
  style?: StyleProp<ViewStyle>
}>

export function DialogContent({
  children,
  showCloseButton = true,
  style,
}: DialogContentProps) {
  const { open, setOpen } = useDialogContext()

  return (
    <Modal animationType="fade" onRequestClose={() => setOpen(false)} transparent visible={open}>
      <View style={dialogStyles.modalRoot}>
        <DialogOverlay
          accessibilityRole={'button' as AccessibilityRole}
          onPress={() => setOpen(false)}
        />
        <View style={[dialogStyles.content, style]}>
          {children}
          {showCloseButton ? (
            <Pressable accessibilityRole="button" onPress={() => setOpen(false)} style={dialogStyles.closeButton}>
              <Text style={dialogStyles.closeText}>x</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </Modal>
  )
}
