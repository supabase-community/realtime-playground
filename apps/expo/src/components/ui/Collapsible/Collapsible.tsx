import * as React from 'react'

import { useControllableState } from '../utils'
import { CollapsibleContext } from './CollapsibleContext'

export type CollapsibleProps = React.PropsWithChildren<{
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
}>

export function CollapsibleRoot({
  children,
  defaultOpen = false,
  onOpenChange,
  open,
}: CollapsibleProps) {
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

  return <CollapsibleContext.Provider value={value}>{children}</CollapsibleContext.Provider>
}
