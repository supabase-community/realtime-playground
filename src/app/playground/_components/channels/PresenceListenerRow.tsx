'use client'

import { Button } from '@/components/ui/button'

type Props = {
  onAdd: () => void
}

export function PresenceListenerRow({ onAdd }: Props) {
  return (
    <div className="flex items-center gap-2">
      <Button size="sm" variant="secondary" className="h-7 text-xs" onClick={onAdd}>
        Add Presence Listener
      </Button>
    </div>
  )
}
