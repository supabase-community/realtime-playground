'use client'

import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { FieldLabel } from '@/components/field-label'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { realtimeClientSchema, vsnSchema, type RealtimeClientValues } from '@/schemas/client'
import { z } from 'zod'
import { transformOptionalNumber } from './helpers'
import { NEXT_PUBLIC_REALTIME_URL, NEXT_PUBLIC_SUPABASE_KEY } from '@/lib/constants'
import { useRealtimeStore } from '@/store/realtimeStore'
import { RealtimeLogger } from '@/types/realtime'

type Props = {
  logger: RealtimeLogger
  disabled: boolean
  status?: string
}

export function RealtimeClientForm({ disabled, status, logger }: Props) {
  const onSubmit = ({ url, ...options }: RealtimeClientValues) => {
    useRealtimeStore.getState().create(url, { ...realtimeOptions(options), logger })
  }
  const onDisconnect = () => useRealtimeStore.getState().client?.disconnect()
  const onConnect = () => useRealtimeStore.getState().client?.connect()
  const onDelete = () => useRealtimeStore.getState().destroy()

  const form = useForm<z.input<typeof realtimeClientSchema>, unknown, RealtimeClientValues>({
    resolver: zodResolver(realtimeClientSchema),
    defaultValues: {
      url: NEXT_PUBLIC_REALTIME_URL,
      apiKey: NEXT_PUBLIC_SUPABASE_KEY,
      worker: true,
      vsn: '2.0.0',
    },
  })

  const { errors } = form.formState

  return (
    <form
      id="realtime-client-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <div className="grid grid-cols-2 gap-2">
        <FieldLabel className="text-xs" htmlFor="realtime-client-form-url" error={errors.url}>
          URL
        </FieldLabel>
        <FieldLabel className="text-xs" htmlFor="realtime-client-form-apikey" error={errors.apiKey}>
          API Key
        </FieldLabel>
        <Input
          id="realtime-client-form-url"
          placeholder="https://your-project.supabase.co/realtime/v1"
          disabled={disabled}
          aria-invalid={!!errors.url}
          {...form.register('url')}
        />
        <Input
          id="realtime-client-form-apikey"
          placeholder="your-anon-key"
          disabled={disabled}
          aria-invalid={!!errors.apiKey}
          {...form.register('apiKey')}
        />
      </div>

      <div className="grid grid-cols-[auto_auto_1fr_1fr] place-content-stretch gap-2">
        <Label className="text-xs" htmlFor="realtime-client-form-worker">
          Worker?
        </Label>
        <Label className="text-xs" htmlFor="realtime-client-form-vsn">
          VSN
        </Label>
        <FieldLabel
          className="text-xs"
          htmlFor="realtime-client-form-heartbeat"
          error={errors.heartbeatIntervalMs}
        >
          Heartbeat Interval (ms)
        </FieldLabel>
        <FieldLabel
          className="text-xs"
          htmlFor="realtime-client-form-timeout"
          error={errors.timeout}
        >
          Timeout (ms)
        </FieldLabel>
        <Controller
          control={form.control}
          name="worker"
          render={({ field }) => (
            <Checkbox
              id="realtime-client-form-worker"
              className="m-auto"
              disabled={disabled}
              name={field.name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />

        <Controller
          control={form.control}
          name="vsn"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent id="realtime-client-form-vsn">
                {vsnSchema.options.map((v) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <Input
          id="realtime-client-form-heartbeat"
          placeholder="30000"
          type="number"
          disabled={disabled}
          {...form.register('heartbeatIntervalMs', { setValueAs: transformOptionalNumber })}
        />
        <Input
          id="realtime-client-form-timeout"
          placeholder="10000"
          type="number"
          disabled={disabled}
          {...form.register('timeout', { setValueAs: transformOptionalNumber })}
        />
      </div>

      {!disabled ? (
        <Button type="submit" className="w-full">
          Create Client
        </Button>
      ) : (
        <div className="flex gap-2 pt-1">
          <Button
            type="button"
            className="flex-1"
            variant={status === 'open' ? 'secondary' : 'default'}
            onClick={status === 'open' ? onDisconnect : onConnect}
          >
            {status === 'open' ? 'Disconnect' : 'Connect'}
          </Button>
          <Button type="button" variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        </div>
      )}
    </form>
  )
}

function realtimeOptions(options: Omit<RealtimeClientValues, 'url'>) {
  const { worker, timeout, apiKey, vsn, heartbeatIntervalMs } = options
  const params = {
    apikey: apiKey,
    vsn,
  }

  return {
    params,
    worker,
    ...(timeout !== undefined ? { timeout } : {}),
    ...(heartbeatIntervalMs !== undefined ? { heartbeatIntervalMs } : {}),
  }
}
