'use client'

import {
  type SocketStatus,
  useBroadcastMessages,
  useEnv,
  useLogMessages,
  usePostgresChanges,
  usePresenceState,
  useRealtimeStore,
  useSupabaseStore,
} from '@realtime-playground/realtime-core'
import { useCallback, useEffect, useState } from 'react'
import Auth from '@/app/playground/_components/Auth'
import { RealtimeChannels } from '@/app/playground/_components/RealtimeChannels'
import { RealtimeClient } from '@/app/playground/_components/RealtimeClient'
import {
  BroadcastMessagesTable,
  LogsTable,
  PostgresChangesTable,
  PresenceStateTable,
} from '@/app/playground/_components/tables'
import SettingsModal from '@/components/SettingsModal'
import { ActiveChannels, type ListenerCallbacks } from './_components/ActiveChannels'

export default function Playground() {
  const [status, setStatus] = useState<SocketStatus | undefined>()
  const { supabaseUrl, supabaseKey } = useEnv()

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

  const client = useRealtimeStore(({ client }) => client)

  useEffect(() => {
    if (supabaseUrl && supabaseKey) {
      useSupabaseStore.getState().init(supabaseUrl, supabaseKey)
    }
    return () => useRealtimeStore.getState().destroy()
  }, [supabaseUrl, supabaseKey])

  useEffect(() => {
    if (!client) {
      setStatus(undefined)
      return
    }
    setStatus(client.connectionState() as SocketStatus)
    const id = setInterval(() => setStatus(client.connectionState() as SocketStatus), 500)
    return () => clearInterval(id)
  }, [client])

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
    (name, schema, event, table, filter, select) => {
      const ch = useRealtimeStore.getState().channels.get(name)
      if (!ch) return
      registerPostgresListener(ch, name, event, schema, table, filter, select)
      useRealtimeStore.getState().syncChannels()
    },
    [registerPostgresListener],
  )

  if (!supabaseUrl || !supabaseKey) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground text-sm">
          No Supabase project configured. Set your URL and API key to get started.
        </p>
        <SettingsModal>
          <button
            type="button"
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium"
          >
            Configure project
          </button>
        </SettingsModal>
      </div>
    )
  }

  return (
    <div className="grid h-full grid-cols-2 gap-2 overflow-hidden">
      <div className="flex flex-col gap-4 overflow-y-auto">
        <RealtimeClient status={status} logger={addLog} />
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
