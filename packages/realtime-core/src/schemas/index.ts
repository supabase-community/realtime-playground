import {
  postgresChangesFilter,
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
  type RealtimePostgresChangesFilterOperator,
  type RealtimePostgresFilterBuilder,
} from '@supabase/supabase-js'
import { z } from 'zod'

// ---------------------------------------------------------------------------
// Realtime Client
// ---------------------------------------------------------------------------

export const vsnSchema = z.enum(['1.0.0', '2.0.0'], { error: 'Incorrect VSN' })
export type Vsn = z.infer<typeof vsnSchema>

const positiveIntSchema = z.number().int().positive({ error: 'Must be positive' })

export const realtimeClientSchema = z.object({
  worker: z.boolean().default(true).nonoptional(),
  vsn: vsnSchema.default('2.0.0').nonoptional(),
  timeout: positiveIntSchema.optional(),
  heartbeatIntervalMs: positiveIntSchema.optional(),
})

export type RealtimeClientFormValues = z.infer<typeof realtimeClientSchema>

// ---------------------------------------------------------------------------
// Login form schema
// ---------------------------------------------------------------------------

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').nonoptional(),
  password: z.string().min(1, 'Password is required').nonoptional(),
})

export type LoginValues = z.infer<typeof loginSchema>

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

/**
 * Operators supported by the Realtime Postgres Changes filter builder. Mirrors
 * {@link RealtimePostgresChangesFilterOperator} from `@supabase/supabase-js`
 * (`isDistinct()` builder method serializes as the `isdistinct` operator).
 */
export const POSTGRES_FILTER_OPERATORS = [
  'eq',
  'neq',
  'gt',
  'gte',
  'lt',
  'lte',
  'in',
  'like',
  'ilike',
  'match',
  'imatch',
  'is',
  'isdistinct',
] as const satisfies readonly RealtimePostgresChangesFilterOperator[]

export const postgresFilterConditionSchema = z.object({
  column: z.string().min(1, 'Column is required').nonoptional(),
  operator: z.enum(POSTGRES_FILTER_OPERATORS).default('eq').nonoptional(),
  /**
   * Raw value entered by the user; interpreted per operator at build time
   * (`in` splits on commas, `is` accepts `null`/`true`/`false`/`unknown`).
   */
  value: z.string().default('').nonoptional(),
  /** Negate the condition with the `not.` prefix. */
  negate: z.boolean().default(false).nonoptional(),
})

export type PostgresFilterCondition = z.infer<typeof postgresFilterConditionSchema>

export const postgresListenerSchema = z.object({
  schema: z.string().min(1, 'Schema is required').default('public').nonoptional(),
  table: z.string().optional(),
  event: z
    .enum(REALTIME_POSTGRES_CHANGES_LISTEN_EVENT)
    .default(REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.ALL)
    .nonoptional(),
  /** Composite AND conditions serialized via `postgresChangesFilter()`. */
  filters: z.array(postgresFilterConditionSchema).default([]).nonoptional(),
  /** Restrict the change payload to a subset of columns. */
  select: z.array(z.string().min(1)).default([]).nonoptional(),
})

export type PostgresListenerValues = z.infer<typeof postgresListenerSchema>

/**
 * Turn the form's list of conditions into a `postgresChangesFilter()` builder.
 * Returns `undefined` when there are no conditions so the listener subscribes
 * without a filter. Conditions are combined with `AND`.
 */
export function buildPostgresFilter(
  conditions: PostgresFilterCondition[],
): RealtimePostgresFilterBuilder | undefined {
  const active = conditions.filter((c) => c.column.trim() !== '')
  if (active.length === 0) return undefined

  const builder = postgresChangesFilter()

  for (const { column, operator, value, negate } of active) {
    // `in` takes a list (comma-separated in the UI); everything else is scalar.
    const parsed =
      operator === 'in'
        ? value
            .split(',')
            .map((v) => v.trim())
            .filter((v) => v !== '')
        : value

    if (negate) {
      // The builder's `not` overloads narrow by operator; the runtime call is
      // uniform, so cast to keep a single code path.
      builder.not(column, operator as 'eq', parsed as string)
      continue
    }

    switch (operator) {
      case 'eq':
        builder.eq(column, value)
        break
      case 'neq':
        builder.neq(column, value)
        break
      case 'gt':
        builder.gt(column, value)
        break
      case 'gte':
        builder.gte(column, value)
        break
      case 'lt':
        builder.lt(column, value)
        break
      case 'lte':
        builder.lte(column, value)
        break
      case 'in':
        builder.in(column, parsed as string[])
        break
      case 'like':
        builder.like(column, value)
        break
      case 'ilike':
        builder.ilike(column, value)
        break
      case 'match':
        builder.match(column, value)
        break
      case 'imatch':
        builder.imatch(column, value)
        break
      case 'is':
        builder.is(column, value as 'null')
        break
      case 'isdistinct':
        builder.isDistinct(column, value)
        break
    }
  }

  return builder
}

// ---------------------------------------------------------------------------
// Broadcast
// ---------------------------------------------------------------------------

export const broadcastSendSchema = z.object({
  event: z.string().min(1, 'Event name is required').default('message').nonoptional(),
  message: z.string().optional(),
})

export type BroadcastSendValues = z.infer<typeof broadcastSendSchema>

// ---------------------------------------------------------------------------
// Defaults creators
// ---------------------------------------------------------------------------

export const createRealtimeClientDefaults = (): RealtimeClientFormValues => ({
  worker: true,
  vsn: '2.0.0',
  timeout: undefined,
  heartbeatIntervalMs: undefined,
})

export const createChannelDefaults = (name = 'test'): ChannelFormInput => ({
  name,
  config: {
    private: false,
    broadcast: { ack: true, self: true },
    presence: { enabled: true },
  },
})

export const createPostgresListenerDefaults = (): PostgresListenerValues => ({
  schema: 'public',
  event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.ALL,
  filters: [],
  select: [],
})
