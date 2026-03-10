'use client'

import { useCallback, useEffect } from 'react'
import { RealtimeClient } from '@/app/playground/_components/RealtimeClient'
import { RealtimeChannels } from '@/app/playground/_components/RealtimeChannels'
import Auth from '@/app/playground/_components/Auth'
import { useBroadcastMessages } from '@/hooks/useBroadcastMessages'
import { useLogMessages } from '@/hooks/useLogMessages'
import { usePostgresChanges } from '@/hooks/usePostgresChanges'
import { usePresenceState } from '@/hooks/usePresenceState'
import {
  BroadcastMessagesTable,
  LogsTable,
  PostgresChangesTable,
  PresenceStateTable,
} from '@/app/playground/_components/tables'
import { useRealtimeStore } from '@/store/realtimeStore'
import { useSupabaseStore } from '@/store/supabaseStore'
import { ActiveChannels, ListenerCallbacks } from './_components/ActiveChannels'

export default function Playground() {
  const status = useRealtimeStore((s) => s.status)
  const socketConfig = useRealtimeStore((s) => s.socketConfig)

  const { logs, addLog, clear: clearLogs } = useLogMessages()

  const {
    messages: broadcastMessages,
    addListener: registerBroadcastListener,
    clear: clearBroadcastMessages,
  } = useBroadcastMessages()

  const {
    changes: postgresChanges,
    addListener: registerPostgresListener,
    clear: clearPostgresChanges,
  } = usePostgresChanges()

  const {
    presenceState,
    addListener: registerPresenceListener,
    clear: clearPresenceState,
  } = usePresenceState()

  useEffect(() => {
    useSupabaseStore.getState().init()
    const interval = setInterval(() => useRealtimeStore.getState().syncStatus(), 500)
    useRealtimeStore.getState().syncStatus()
    return () => {
      clearInterval(interval)
      useRealtimeStore.getState().destroy()
    }
  }, [])

  const addBroadcastListener = useCallback(
    (name: string, event: string) => {
      const ch = useRealtimeStore.getState().channels.get(name)
      if (!ch) return
      registerBroadcastListener(ch, name, event)
      useRealtimeStore.getState().syncChannels()
    },
    [registerBroadcastListener],
  )

  const addPresenceListener = useCallback(
    (name: string) => {
      const ch = useRealtimeStore.getState().channels.get(name)
      if (!ch) return
      registerPresenceListener(ch, name)
      useRealtimeStore.getState().syncChannels()
    },
    [registerPresenceListener],
  )

  const addPostgresChangesListener = useCallback<ListenerCallbacks['addPostgresChangesListener']>(
    (name, schema, event, table) => {
      const ch = useRealtimeStore.getState().channels.get(name)
      if (!ch) return
      registerPostgresListener(ch, name, event, schema, table)
      useRealtimeStore.getState().syncChannels()
    },
    [registerPostgresListener],
  )

  return (
    <div className="grid h-full grid-cols-2 gap-2 overflow-hidden">
      <div className="flex flex-col gap-4 overflow-y-auto">
        <RealtimeClient
          onSubmit={(config) => useRealtimeStore.getState().create(config, addLog)}
          onDelete={() => useRealtimeStore.getState().destroy()}
          onConnect={() => useRealtimeStore.getState().connect()}
          onDisconnect={() => useRealtimeStore.getState().disconnect()}
          disabled={!!socketConfig}
          status={status}
        />
        <Auth />
        <RealtimeChannels />
        <ActiveChannels
          listenerCallbacks={{
            addBroadcastListener,
            addPresenceListener,
            addPostgresChangesListener,
          }}
        />
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto">
        <LogsTable logs={logs} onClear={clearLogs} />
        <BroadcastMessagesTable messages={broadcastMessages} onClear={clearBroadcastMessages} />
        <PostgresChangesTable changes={postgresChanges} onClear={clearPostgresChanges} />
        <PresenceStateTable presenceState={presenceState} onClear={clearPresenceState} />
      </div>
    </div>
  )
}
