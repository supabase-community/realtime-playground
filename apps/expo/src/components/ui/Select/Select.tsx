import React, { useCallback, useMemo, useState } from 'react'

import { useControllableState } from '../utils'
import { SelectContext } from './SelectContext'

export type SelectProps = React.PropsWithChildren<{
  defaultOpen?: boolean
  defaultValue?: string
  onOpenChange?: (open: boolean) => void
  onValueChange?: (value: string) => void
  open?: boolean
  value?: string
}>

export function SelectRoot({
  children,
  defaultOpen = false,
  defaultValue,
  onOpenChange,
  onValueChange,
  open,
  value,
}: SelectProps) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })
  const [selectedValue, setSelectedValue] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  })
  const [items, setItems] = useState<Record<string, string>>({})

  const registerItem = useCallback((itemValue: string, label: string) => {
    setItems((current) => ({ ...current, [itemValue]: label }))
  }, [])

  const valueObject = useMemo(
    () => ({
      items,
      open: !!isOpen,
      registerItem,
      selectedLabel: selectedValue ? items[selectedValue] : undefined,
      setOpen,
      setValue: (nextValue: string) => {
        setSelectedValue(nextValue)
        setOpen(false)
      },
      value: selectedValue,
    }),
    [isOpen, items, registerItem, selectedValue, setOpen, setSelectedValue],
  )

  return <SelectContext.Provider value={valueObject}>{children}</SelectContext.Provider>
}
