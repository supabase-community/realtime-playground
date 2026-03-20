import React, { useContext } from 'react'

export type CollapsibleContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
}

export const CollapsibleContext = React.createContext<CollapsibleContextValue | null>(null)

export function useCollapsibleContext() {
  const context = useContext(CollapsibleContext)

  if (!context) {
    throw new Error('Collapsible components must be used inside <Collapsible>.')
  }

  return context
}
