import * as React from 'react'

export type DialogContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
}

export const DialogContext = React.createContext<DialogContextValue | null>(null)

export function useDialogContext() {
  const context = React.useContext(DialogContext)

  if (!context) {
    throw new Error('Dialog components must be used inside <Dialog>.')
  }

  return context
}
