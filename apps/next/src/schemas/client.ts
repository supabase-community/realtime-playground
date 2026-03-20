import { z } from 'zod'
import {
  PUBLIC_REALTIME_URL,
  PUBLIC_SUPABASE_KEY,
  PUBLIC_TEST_USER_EMAIL,
} from '../lib/constants'

export const vsnSchema = z.enum(['1.0.0', '2.0.0'])
export type Vsn = z.infer<typeof vsnSchema>

const positiveIntStr = z
  .string()
  .optional()
  .refine((v) => v === undefined || v === '' || (Number.isFinite(Number(v)) && Number(v) > 0), {
    message: 'Must be a positive number',
  })

export const realtimeClientSchema = z.object({
  url: z.string().min(1, 'URL is required').default(PUBLIC_REALTIME_URL).nonoptional(),
  apiKey: z.string().min(1, 'API key is required').default(PUBLIC_SUPABASE_KEY).nonoptional(),
  worker: z.boolean().default(true).nonoptional(),
  vsn: vsnSchema.default('2.0.0').nonoptional(),
  timeout: positiveIntStr.optional(),
  heartbeatIntervalMs: positiveIntStr.optional(),
})

export type RealtimeClientFormValues = z.infer<typeof realtimeClientSchema>

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').default(PUBLIC_TEST_USER_EMAIL).nonoptional(),
  password: z.string().min(1, 'Password is required').nonoptional(),
})

export type LoginValues = z.infer<typeof loginSchema>
