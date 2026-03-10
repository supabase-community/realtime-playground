'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useRealtimeStore } from '@/store/realtimeStore'
import { REALTIME_POSTGRES_CHANGES_LISTEN_EVENT, RealtimeChannel } from '@supabase/supabase-js'
import { Database, Radio, Users } from 'lucide-react'
import {
  BroadcastListenerRow,
  BroadcastSendSection,
  PostgresListenerRow,
  PresenceListenerRow,
  PresenceTrackSection,
} from './channels'

export type ListenerCallbacks = {
  addBroadcastListener: (name: string, event: string) => void
  addPresenceListener: (name: string) => void
  addPostgresChangesListener: (
    name: string,
    schema: string,
    event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
    table?: string,
  ) => void
}

type Props = {
  listenerCallbacks: ListenerCallbacks
}

export function ActiveChannels({ listenerCallbacks }: Props) {
  const channels = useRealtimeStore((s) => s.channels)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Active Channels</CardTitle>
      </CardHeader>
      <CardContent>
        {channels.size === 0 ? (
          <div className="rounded-md border border-dashed py-6 text-center">
            <p className="text-muted-foreground text-xs">No channels created yet</p>
            <p className="text-muted-foreground/60 mt-1 text-xs">
              Create a channel above to get started
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {Array.from(channels.entries()).map(([name, channel]) => (
              <ChannelCard
                key={name}
                name={name}
                channel={channel}
                listenerCallbacks={listenerCallbacks}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

type ChannelCardProps = {
  name: string
  channel: RealtimeChannel
  listenerCallbacks: ListenerCallbacks
}

function ChannelCard({ channel, name, listenerCallbacks }: ChannelCardProps) {
  const [listenerCounts, setListenerCounts] = useState({ broadcast: 0, presence: 0, postgres: 0 })
  const [isTracked, setIsTracked] = useState(channel.topic in channel.presence.state)

  const isSubscribed = channel.state === 'joined'
  const { broadcast, presence, postgres } = listenerCounts

  return (
    <div className="rounded-md border">
      <div className="flex items-center justify-between gap-2 border-b px-3 py-2">
        <span className="truncate text-sm font-semibold">{name}</span>
        <div className="flex shrink-0 items-center gap-2">
          <ListenerCounter count={broadcast} icon="broadcast" />
          <ListenerCounter count={presence} icon="presence" />
          <ListenerCounter count={postgres} icon="postgres" />

          {isSubscribed && (
            <Badge variant={isTracked ? 'default' : 'outline'} className="text-xs">
              {isTracked ? 'Tracked' : 'Untracked'}
            </Badge>
          )}
          <Badge variant={channelStateBadgeVariant(channel.state)} className="text-xs">
            {channel.state}
          </Badge>
        </div>
      </div>

      <div className="space-y-2 p-3">
        <BroadcastListenerRow
          onAdd={(event) => {
            listenerCallbacks.addBroadcastListener(name, event)
            setListenerCounts((prev) => ({ ...prev, broadcast: prev.broadcast + 1 }))
          }}
        />
        <PresenceListenerRow
          onAdd={() => {
            listenerCallbacks.addPresenceListener(name)
            setListenerCounts((prev) => ({ ...prev, presence: prev.presence + 1 }))
          }}
        />
        <PostgresListenerRow
          onAdd={({ schema, table, event }) => {
            listenerCallbacks.addPostgresChangesListener(name, schema, event, table)
            setListenerCounts((prev) => ({ ...prev, postgres: prev.postgres + 1 }))
          }}
        />

        {isSubscribed && (
          <>
            <Separator />
            <PresenceTrackSection
              onTrack={(payload) => {
                useRealtimeStore.getState().trackPresence(name, payload)
                setIsTracked(true)
              }}
              onUntrack={() => {
                useRealtimeStore.getState().untrackPresence(name)
                setIsTracked(false)
              }}
              isTracked={isTracked}
            />
            <Separator />
            <BroadcastSendSection
              onSend={({ event, message }) => {
                channel.send({ type: 'broadcast', event, payload: { message } })
              }}
            />
          </>
        )}
      </div>

      <div className="flex gap-2 border-t px-3 py-2">
        {isSubscribed ? (
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={() => useRealtimeStore.getState().unsubscribe(name)}
          >
            Unsubscribe
          </Button>
        ) : (
          <Button
            size="sm"
            className="h-7 text-xs"
            onClick={() => useRealtimeStore.getState().subscribe(name)}
          >
            Subscribe
          </Button>
        )}
        <Button
          size="sm"
          variant="destructive"
          className="h-7 text-xs"
          onClick={() => useRealtimeStore.getState().removeChannel(name)}
        >
          Remove
        </Button>
      </div>
    </div>
  )
}

const channelStateBadgeVariant = (
  state: string,
): 'default' | 'secondary' | 'destructive' | 'outline' => {
  if (state === 'joined') return 'default'
  if (state === 'joining' || state === 'leaving') return 'secondary'
  return 'outline'
}

type Icons = 'broadcast' | 'presence' | 'postgres'

function ListenerCounter({ icon, count }: { icon: Icons; count: number }) {
  if (count < 1) return <></>

  return (
    <span className="text-muted-foreground flex items-center gap-0.5 text-xs">
      <CountIcon icon={icon} />
      {count}
    </span>
  )
}

function CountIcon({ icon }: { icon: Icons }) {
  switch (icon) {
    case 'broadcast':
      return <Radio className="size-3" />
    case 'postgres':
      return <Database className="size-3" />
    case 'presence':
      return <Users className="size-3" />
  }
}
