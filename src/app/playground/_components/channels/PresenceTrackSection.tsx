'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Props = {
  onTrack: (payload: Record<string, unknown>) => void
  onUntrack: () => void
  isTracked: boolean
}

export function PresenceTrackSection({ onTrack, onUntrack, isTracked }: Props) {
  const [value, setValue] = useState('{"status": "online"}')

  const handleTrack = () => {
    try {
      onTrack(JSON.parse(value))
    } catch {
      toast.error('Invalid JSON payload')
    }
  }

  return (
    <div className="flex items-center gap-2">
      {isTracked ? (
        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={onUntrack}>
          Untrack
        </Button>
      ) : (
        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={handleTrack}>
          Track
        </Button>
      )}

      <Input
        disabled={isTracked}
        className="h-7 flex-1 resize-none font-mono text-xs"
        placeholder='{"status": "online"}'
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  )
}
