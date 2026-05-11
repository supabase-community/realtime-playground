'use client'

import { type RealtimeLogger, useClientCreated } from '@realtime-playground/realtime-core'

import { CopyButton } from '@/components/copy'
import SettingsModal from '@/components/SettingsModal'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { PUBLIC_SUPABASE_KEY } from '@/lib/constants'
import { RealtimeClientForm } from './forms'

type Props = {
  logger: RealtimeLogger
  status?: string
}

export function RealtimeClient({ status, logger }: Props) {
  const disabled = useClientCreated()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Client Creation</CardTitle>
          <div className="flex items-center gap-4">
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
            <SettingsModal />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <RealtimeClientForm disabled={disabled} status={status} logger={logger} />
      </CardContent>
      <CardFooter>
        <p className="text-muted-foreground flex items-center text-xs">
          Publishable key:
          <CopyButton content={PUBLIC_SUPABASE_KEY} className="hover:text-foreground" />
        </p>
      </CardFooter>
    </Card>
  )
}
