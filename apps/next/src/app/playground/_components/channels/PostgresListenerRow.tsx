'use client'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { REALTIME_POSTGRES_CHANGES_LISTEN_EVENT } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { postgresListenerSchema, PostgresListenerValues } from '@/schemas/channel'

type Props = {
  onAdd: (values: PostgresListenerValues) => void
}

export function PostgresListenerRow({ onAdd }: Props) {
  const form = useForm<PostgresListenerValues>({
    resolver: zodResolver(postgresListenerSchema),
    defaultValues: postgresListenerSchema.parse({}),
  })

  const handleSubmit = form.handleSubmit(onAdd)

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2">
      <Button type="submit" size="sm" variant="secondary" className="h-7 shrink-0 text-xs">
        Add Postgres Listener
      </Button>
      <Input className="h-7 w-20 text-xs" placeholder="schema" {...form.register('schema')} />
      <Input className="h-7 w-20 text-xs" placeholder="table (*)" {...form.register('table')} />
      <Controller
        control={form.control}
        name="event"
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className="h-7 w-24 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(REALTIME_POSTGRES_CHANGES_LISTEN_EVENT).map((value) => (
                <SelectItem key={value} value={value} className="text-xs">
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </form>
  )
}
