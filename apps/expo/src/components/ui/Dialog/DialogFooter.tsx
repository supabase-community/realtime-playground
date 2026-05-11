import type * as React from 'react'
import { type StyleProp, StyleSheet, View, type ViewProps, type ViewStyle } from 'react-native'

import { Button } from '../button'
import { DialogClose } from './DialogClose'

export type DialogFooterProps = ViewProps & {
  showCloseButton?: boolean
  style?: StyleProp<ViewStyle>
}

export function DialogFooter({
  children,
  showCloseButton = false,
  style,
  ...props
}: React.PropsWithChildren<DialogFooterProps>) {
  return (
    <View style={[styles.footer, style]} {...props}>
      {children}
      {showCloseButton ? (
        <DialogClose asChild>
          <Button variant="outline">Close</Button>
        </DialogClose>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'flex-end',
  },
})
