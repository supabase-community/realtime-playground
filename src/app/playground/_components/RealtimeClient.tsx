'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { RealtimeClientFormValues } from '@/schemas/client'
import { RealtimeClientForm } from './forms'

type Props = {
  onSubmit: (values: RealtimeClientFormValues) => void
  onDelete: () => void
  onConnect: () => void
  onDisconnect: () => void
  disabled: boolean
  status?: string
}

export function RealtimeClient({ status, disabled, ...props }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Realtime Client</CardTitle>
          {disabled && status && (
            <div className="flex items-center gap-2">
              <span
                className={`inline-block h-2.5 w-2.5 rounded-full ${
                  status === 'open'
                    ? 'bg-green-500'
                    : status === 'connecting'
                      ? 'animate-pulse bg-yellow-500'
                      : 'bg-red-500'
                }`}
              />
              <span className="text-muted-foreground text-xs font-semibold uppercase">
                {status}
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <RealtimeClientForm {...props} disabled={disabled} status={status} />
      </CardContent>
    </Card>
  )
}
