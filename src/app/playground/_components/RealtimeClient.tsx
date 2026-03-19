'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { RealtimeClientForm } from './forms'
import { NEXT_PUBLIC_SUPABASE_KEY } from '@/lib/constants'
import { CopyButton } from '@/components/copy'
import { useClientCreated } from '@/store/realtimeStore'
import type { RealtimeLogger } from '@/types/realtime'

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
        <RealtimeClientForm disabled={disabled} status={status} logger={logger} />
      </CardContent>
      <CardFooter>
        <p className="text-muted-foreground flex items-center text-xs">
          Default API KEY:
          <CopyButton content={NEXT_PUBLIC_SUPABASE_KEY} className="hover:text-foreground" />
        </p>
      </CardFooter>
    </Card>
  )
}
