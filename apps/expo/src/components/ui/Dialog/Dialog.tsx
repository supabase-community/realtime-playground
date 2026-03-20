import * as React from 'react'

import { useControllableState } from '../utils'
import { DialogContext } from './DialogContext'

export type DialogProps = React.PropsWithChildren<{
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
}>

export function DialogRoot({ children, defaultOpen = false, onOpenChange, open }: DialogProps) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })

  const value = React.useMemo(
    () => ({
      open: !!isOpen,
      setOpen,
    }),
    [isOpen, setOpen],
  )

  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
}
