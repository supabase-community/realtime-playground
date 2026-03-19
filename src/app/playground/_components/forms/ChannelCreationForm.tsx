'use client'

import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DateTimePicker } from '@/components/ui/date-time-picker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { channelFormSchema, type ChannelFormInput, type ChannelFormValues } from '@/schemas/channel'

import { transformOptionalNumber } from './helpers'

type Props = {
  onSubmit: (values: ChannelFormValues) => void
  disabled: boolean
}

export function ChannelCreationForm({ onSubmit, disabled }: Props) {
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm<ChannelFormInput, unknown, ChannelFormValues>({
    resolver: zodResolver(channelFormSchema),
    defaultValues: {
      name: 'test',
      config: {
        private: false,
        broadcast: { ack: true, self: true },
        presence: { enabled: true },
      },
    },
  })

  const presenceEnabled = useWatch({
    control: control,
    name: 'config.presence.enabled',
  })

  const replayEnabled = useWatch({
    control: control,
    name: 'config.broadcast.replay',
    defaultValue: undefined,
    compute: (data?: object) => !!data,
  })

  return (
    <form
      id="create-channel-form"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <Label className="text-xs">Channel Name</Label>
            {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
          </div>
          <Input
            disabled={disabled}
            placeholder="e.g., my-room, game-lobby, chat-1"
            {...register('name')}
          />
        </div>

        <Controller
          control={control}
          name="config.private"
          render={({ field }) => (
            <div className="flex gap-2">
              <Label className="text-xs">Private channel</Label>
              <Checkbox
                className="h-4 w-4"
                disabled={disabled}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </div>
          )}
        />

        <div className="space-y-2 rounded-md border border-blue-600/30 bg-blue-950/20 p-3">
          <p className="text-xs font-semibold text-blue-400">Broadcast Configuration</p>
          <Controller
            control={control}
            name="config.broadcast.ack"
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Checkbox
                  disabled={disabled}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label className="text-xs font-normal">Send acknowledgments (ack)</Label>
              </div>
            )}
          />
          <Controller
            control={control}
            name="config.broadcast.self"
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Checkbox
                  disabled={disabled}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label className="text-xs font-normal">Receive own messages (self)</Label>
              </div>
            )}
          />
          <Controller
            control={control}
            name="config.broadcast.replay"
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Checkbox
                  disabled={disabled}
                  checked={field.value !== undefined}
                  onCheckedChange={(checked) =>
                    field.onChange(checked ? { since: new Date() } : undefined)
                  }
                />
                <Label className="text-xs font-normal">Enable replay</Label>
              </div>
            )}
          />
          {replayEnabled && (
            <div className="flex w-full items-end gap-2">
              <div className="w-1/2 space-y-1">
                <div className="flex justify-between">
                  <Label className="text-xs">Since</Label>
                  {errors.config?.broadcast?.replay?.since && (
                    <p className="text-destructive text-right text-xs">
                      {errors.config.broadcast.replay.since.message}
                    </p>
                  )}
                </div>
                <Controller
                  control={control}
                  name="config.broadcast.replay.since"
                  render={({ field }) => (
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                      disabled={disabled}
                    />
                  )}
                />
              </div>
              <div className="w-1/2 space-y-1">
                <div className="flex justify-between">
                  <Label className="text-xs font-normal">Limit (Optional)</Label>
                  {errors.config?.broadcast?.replay?.limit && (
                    <p className="text-destructive text-right text-xs">
                      {errors.config.broadcast.replay.limit.message}
                    </p>
                  )}
                </div>
                <Input
                  type="number"
                  disabled={disabled}
                  placeholder="e.g., 10"
                  {...register('config.broadcast.replay.limit', {
                    setValueAs: transformOptionalNumber,
                  })}
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2 rounded-md border border-green-600/30 bg-green-950/20 p-3">
          <p className="text-xs font-semibold text-green-400">Presence Configuration</p>
          <Controller
            control={control}
            name="config.presence.enabled"
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Checkbox
                  disabled={disabled}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label className="text-xs font-normal">Enable presence tracking</Label>
              </div>
            )}
          />
          {presenceEnabled && (
            <div className="space-y-1">
              <Label className="text-xs">Presence Key (optional)</Label>
              <Input
                disabled={disabled}
                placeholder="e.g., user-id"
                {...register('config.presence.key')}
              />
            </div>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={disabled}>
        Create Channel
      </Button>
    </form>
  )
}
