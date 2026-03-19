import { REALTIME_POSTGRES_CHANGES_LISTEN_EVENT } from '@supabase/supabase-js'
import { z } from 'zod'
import { positiveIntSchema } from './common'
// ---------------------------------------------------------------------------
// Channel creation form schema
// ---------------------------------------------------------------------------

export const channelConfigSchema = z.object({
  private: z.boolean().nonoptional(),
  broadcast: z.object({
    ack: z.boolean().nonoptional(),
    self: z.boolean().nonoptional(),
    replay: z
      .object({
        since: z
          .date({ error: 'Required' })
          .refine((d) => d <= new Date(), { error: 'Cannot be in the future' })
          .transform((d) => d.getTime())
          .nonoptional(),
        // max limit: https://supabase.com/docs/guides/realtime/broadcast?queryGroups=language&language=js#broadcast-replay
        limit: positiveIntSchema.max(25, { error: 'Max 25' }).optional(),
      })
      .optional(),
  }),
  presence: z.object({
    enabled: z.boolean().nonoptional(),
    key: z.string().optional(),
  }),
})

export const channelFormSchema = z.object({
  name: z.string().min(1, 'Channel name is required').nonoptional(),
  config: channelConfigSchema.nonoptional(),
})

export type ChannelFormValues = z.infer<typeof channelFormSchema>
export type ChannelFormInput = z.input<typeof channelFormSchema>

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
