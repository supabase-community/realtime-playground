import { SymbolView } from 'expo-symbols'
import type * as React from 'react'
import {
  type AccessibilityRole,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { getKeyboardAvoidingBehavior, getKeyboardDismissMode } from '../keyboard'
import { colors, radii, shadow } from '../theme'
import { useDialogContext } from './DialogContext'
import { DialogOverlay } from './DialogOverlay'

export type DialogContentProps = React.PropsWithChildren<{
  showCloseButton?: boolean
  style?: StyleProp<ViewStyle>
}>

export function DialogContent({ children, showCloseButton = true, style }: DialogContentProps) {
  const { open, setOpen } = useDialogContext()
  const insets = useSafeAreaInsets()

  return (
    <Modal animationType="fade" onRequestClose={() => setOpen(false)} transparent visible={open}>
      <View style={styles.modalRoot}>
        <DialogOverlay
          accessibilityRole={'button' as AccessibilityRole}
          onPress={() => setOpen(false)}
        />
        <KeyboardAvoidingView behavior={getKeyboardAvoidingBehavior()} style={styles.sheetFrame}>
          <ScrollView
            bounces={false}
            contentContainerStyle={styles.scrollContent}
            keyboardDismissMode={getKeyboardDismissMode()}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={styles.scrollView}
          >
            <View style={[styles.content, { paddingBottom: 24 + insets.bottom }, style]}>
              {children}
              {showCloseButton ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setOpen(false)}
                  style={styles.closeButton}
                >
                  <SymbolView name="xmark" size={16} tintColor={colors.mutedForeground} />
                </Pressable>
              ) : null}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  closeButton: {
    alignItems: 'center',
    borderRadius: radii.full,
    height: 28,
    justifyContent: 'center',
    position: 'absolute',
    right: 12,
    top: 12,
    width: 28,
  },
  content: {
    gap: 16,
    padding: 24,
    width: '100%',
  },
  modalRoot: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrollContent: {
    flexGrow: 1,
  },
  scrollView: {
    width: '100%',
  },
  sheetFrame: {
    backgroundColor: colors.popover,
    borderColor: colors.border,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    borderWidth: StyleSheet.hairlineWidth,
    maxHeight: '100%',
    maxWidth: 720,
    width: '100%',
    zIndex: 2,
    ...shadow,
  },
})
