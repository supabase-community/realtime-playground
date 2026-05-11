'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { type BroadcastSendValues, broadcastSendSchema } from '@realtime-playground/realtime-core'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Props = {
  onSend: (values: BroadcastSendValues) => void
}

export function BroadcastSendSection({ onSend }: Props) {
  const form = useForm<BroadcastSendValues>({
    resolver: zodResolver(broadcastSendSchema),
    defaultValues: broadcastSendSchema.parse({}),
  })

  const onSubmit = (values: BroadcastSendValues) => {
    onSend(values)
    form.reset({ event: form.getValues('event'), message: '' })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
      <Button type="submit" size="sm" className="h-7 shrink-0 text-xs">
        Send
      </Button>
      <Input
        className="h-7 w-24 shrink-0 text-xs"
        placeholder="event"
        {...form.register('event')}
      />
      <Input className="h-7 flex-1 text-xs" placeholder="message" {...form.register('message')} />
    </form>
  )
}
