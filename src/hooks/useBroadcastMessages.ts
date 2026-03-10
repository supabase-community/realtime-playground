import { useState } from 'react'
import type { RealtimeChannel } from '@supabase/supabase-js'
import type { BroadcastMessage } from '@/types/realtime'

export function useBroadcastMessages() {
  const [messages, setMessages] = useState<BroadcastMessage[]>([])

  const addListener = (channel: RealtimeChannel, channelName: string, event?: string) => {
    channel.on('broadcast', { event: event ?? '*' }, ({ event: ev, payload }) => {
      setMessages((prev) => [
        ...prev,
        {
          timestamp: new Date().toISOString(),
          channel: channelName,
          event: ev,
          payload,
        },
      ])
    })
  }

  const clear = () => setMessages([])

  return { messages, addListener, clear }
}
