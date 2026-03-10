import { useState } from 'react'
import type { RealtimeChannel, REALTIME_POSTGRES_CHANGES_LISTEN_EVENT } from '@supabase/supabase-js'
import type { PostgresChange } from '@/types/realtime'

export function usePostgresChanges() {
  const [changes, setChanges] = useState<PostgresChange[]>([])

  const addListener = (
    channel: RealtimeChannel,
    channelName: string,
    event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
    schema: string,
    table?: string,
  ) => {
    channel.on('postgres_changes', { event, schema, table }, (payload) => {
      setChanges((prev) => [
        ...prev,
        {
          ...payload,
          timestamp: new Date().toISOString(),
          channel: channelName,
        } as PostgresChange,
      ])
    })
  }

  const clear = () => setChanges([])

  return { changes, addListener, clear }
}
