import { useState } from 'react'
import type { RealtimeChannel } from '@supabase/supabase-js'
import type { PresenceByChannel } from '@/types/realtime'

export function usePresenceState() {
  const [presenceState, setPresenceState] = useState<PresenceByChannel>({})

  const addListener = (channel: RealtimeChannel, channelName: string) => {
    const syncState = () => {
      setPresenceState((prev) => ({
        ...prev,
        [channelName]: channel.presenceState() as Record<string, unknown[]>,
      }))
    }

    channel.on('presence', { event: 'sync' }, syncState)
    channel.on('presence', { event: 'join' }, syncState)
    channel.on('presence', { event: 'leave' }, syncState)
  }

  const clear = () => setPresenceState({})

  return { presenceState, addListener, clear }
}
