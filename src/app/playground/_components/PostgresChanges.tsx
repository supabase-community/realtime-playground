'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { PostgresListenerValues } from '@/schemas/channel'
import { PostgresListenerForm } from './forms'

type Props = {
  onSubmit: (values: PostgresListenerValues) => void
}

export function PostgresChanges({ onSubmit }: Props) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Postgres Changes</CardTitle>
      </CardHeader>
      <CardContent>
        <PostgresListenerForm onSubmit={onSubmit} />
      </CardContent>
    </Card>
  )
}
