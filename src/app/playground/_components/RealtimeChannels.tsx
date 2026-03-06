'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRealtimeStore } from '@/store/realtimeStore'
import type { ChannelFormValues } from '@/schemas/channel'
import { ChannelForm } from './forms/ChannelForm'

export function RealtimeChannels() {
  const handleCreate = ({ name, config }: ChannelFormValues) =>
    useRealtimeStore.getState().createChannel(name, config)

  const disabled = useRealtimeStore.getState().client === null

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Channel Creation</CardTitle>
          {disabled && (
            <p className="text-destructive text-xs">
              Please create and connect a client before creating channels.
            </p>
          )}
        </CardHeader>
        <CardContent className={disabled ? 'pointer-events-none opacity-50' : ''}>
          <ChannelForm onSubmit={handleCreate} disabled={disabled} />
        </CardContent>
      </Card>
    </>
  )
}
