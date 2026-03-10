import { REALTIME_POSTGRES_CHANGES_LISTEN_EVENT } from '@supabase/supabase-js'
import { z } from 'zod'
// ---------------------------------------------------------------------------
// Channel creation form schema
// ---------------------------------------------------------------------------

export const channelConfigSchema = z.object({
  private: z.boolean().nonoptional(),
  broadcast: z.object({
    ack: z.boolean().nonoptional(),
    self: z.boolean().nonoptional(),
  }),
  presence: z.object({
    enabled: z.boolean().nonoptional(),
    key: z.string().optional(),
  }),
})

export const channelFormSchema = z.object({
  name: z.string().min(1, 'Channel name is required').nonoptional(),
  config: channelConfigSchema
    .default({
      private: false,
      broadcast: { ack: true, self: true },
      presence: { enabled: true },
    })
    .nonoptional(),
})

export type ChannelFormValues = z.infer<typeof channelFormSchema>
export type ChannelConfigValues = z.infer<typeof channelConfigSchema>

// ---------------------------------------------------------------------------
// Broadcast send form schema
// ---------------------------------------------------------------------------

export const broadcastSendSchema = z.object({
  event: z.string().min(1, 'Event is required').default('message').nonoptional(),
  message: z.string().optional(),
})

export type BroadcastSendValues = z.infer<typeof broadcastSendSchema>

// ---------------------------------------------------------------------------
// Postgres listener schema
// ---------------------------------------------------------------------------

export const postgresListenerSchema = z.object({
  schema: z.string().min(1, 'Schema is required').default('public').nonoptional(),
  table: z.string().optional(),
  event: z
    .enum(REALTIME_POSTGRES_CHANGES_LISTEN_EVENT)
    .default(REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.ALL)
    .nonoptional(),
})

export type PostgresListenerValues = z.infer<typeof postgresListenerSchema>
