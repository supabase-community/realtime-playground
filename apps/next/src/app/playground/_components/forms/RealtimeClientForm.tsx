'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  createRealtimeClientDefaults,
  type RealtimeClientFormValues,
  type RealtimeLogger,
  realtimeClientSchema,
  useEnv,
  useRealtimeStore,
  vsnSchema,
} from '@realtime-playground/realtime-core'
import { Controller, useForm } from 'react-hook-form'
import type { z } from 'zod'

import { FieldLabel } from '@/components/field-label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { transformOptionalNumber } from './helpers'

type Props = {
  logger: RealtimeLogger
  disabled: boolean
  status?: string
}

export function RealtimeClientForm({ disabled, status, logger }: Props) {
  const { supabaseUrl, supabaseKey } = useEnv()

  const onSubmit = (options: RealtimeClientFormValues) => {
    useRealtimeStore.getState().create(`${supabaseUrl}/realtime/v1`, {
      ...realtimeOptions(options, supabaseKey),
      logger,
    })
  }
  const onDisconnect = () => useRealtimeStore.getState().client?.disconnect()
  const onConnect = () => useRealtimeStore.getState().client?.connect()
  const onDelete = () => useRealtimeStore.getState().destroy()

  const form = useForm<z.input<typeof realtimeClientSchema>, unknown, RealtimeClientFormValues>({
    resolver: zodResolver(realtimeClientSchema),
    defaultValues: createRealtimeClientDefaults(),
  })

  const { errors } = form.formState

  return (
    <form
      id="realtime-client-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
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

function realtimeOptions(options: Omit<RealtimeClientFormValues, 'url'>, apiKey: string) {
  const { worker, timeout, vsn, heartbeatIntervalMs } = options
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
