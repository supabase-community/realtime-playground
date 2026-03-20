import * as React from 'react'

export type SelectContextValue = {
  items: Record<string, string>
  open: boolean
  registerItem: (value: string, label: string) => void
  selectedLabel?: string
  setOpen: (open: boolean) => void
  setValue: (value: string) => void
  value?: string
}

export const SelectContext = React.createContext<SelectContextValue | null>(null)

export function useSelectContext() {
  const context = React.useContext(SelectContext)

  if (!context) {
    throw new Error('Select components must be used inside <Select>.')
  }

  return context
}
