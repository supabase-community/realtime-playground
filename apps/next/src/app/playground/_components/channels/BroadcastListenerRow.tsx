'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Props = {
  onAdd: (event: string) => void
}

export function BroadcastListenerRow({ onAdd }: Props) {
  const [event, setEvent] = useState('*')

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="secondary"
        className="h-7 shrink-0 text-xs"
        onClick={() => onAdd(event || '*')}
      >
        Add Broadcast Listener
      </Button>
      <Input
        className="h-7 w-28 shrink-0 text-xs"
        placeholder="event (*)"
        value={event}
        onChange={(e) => setEvent(e.target.value)}
      />
    </div>
  )
}
