import * as React from 'react'
import { View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native'

import { Button } from '../button'
import { DialogClose } from './DialogClose'
import { dialogStyles } from './dialogStyles'

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
    <View style={[dialogStyles.footer, style]} {...props}>
      {children}
      {showCloseButton ? (
        <DialogClose asChild>
          <Button variant="outline">Close</Button>
        </DialogClose>
      ) : null}
    </View>
  )
}
