import { REALTIME_POSTGRES_CHANGES_LISTEN_EVENT } from "@supabase/supabase-js";
import { z } from "zod";
// ---------------------------------------------------------------------------
// Channel creation form schema
// ---------------------------------------------------------------------------

export const channelConfigSchema = z.object({
  private: z.boolean(),
  broadcast: z.object({
    ack: z.boolean(),
    self: z.boolean(),
  }),
  presence: z.object({
    enabled: z.boolean(),
    key: z.string().optional(),
  }),
});

export const channelFormSchema = z.object({
  name: z.string().min(1, "Channel name is required"),
  config: channelConfigSchema,
});

export type ChannelFormValues = z.infer<typeof channelFormSchema>;
export type ChannelConfigValues = z.infer<typeof channelConfigSchema>;

// ---------------------------------------------------------------------------
// Broadcast send form schema
// ---------------------------------------------------------------------------

export const broadcastSendSchema = z.object({
  event: z.string().min(1, "Event is required").nonoptional(),
  channel: z.string().min(1, "Select a channel").nonoptional(),
  message: z.string().optional(),
});

export type BroadcastSendValues = z.infer<typeof broadcastSendSchema>;

// ---------------------------------------------------------------------------
// Postgres listener schema
// ---------------------------------------------------------------------------

export const postgresListenerSchema = z.object({
  schema: z
    .string()
    .min(1, "Schema is required")
    .default("public")
    .nonoptional(),
  table: z.string().min(1, "Table is required").nonoptional(),
  event: z
    .enum(REALTIME_POSTGRES_CHANGES_LISTEN_EVENT)
    .default(REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.ALL)
    .nonoptional(),
  channel: z.string().nonoptional(),
});

export type PostgresListenerValues = z.infer<typeof postgresListenerSchema>;
