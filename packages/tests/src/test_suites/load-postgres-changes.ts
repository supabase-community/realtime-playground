import {
  executeDelete,
  executeInsert,
  executeUpdate,
  measureThroughput,
  now,
  randomId,
  signInUser,
  waitFor,
  waitForPostgresChannel,
} from '../helpers'
import type { TestSuite } from '../types'
import { BROADCAST_CONFIG, LOAD_DELIVERY_SLO, LOAD_MESSAGES } from './const'

export default {
  'load-postgres-changes': [
    {
      name: 'postgres changes system message latency',
      body: async (supabase, { email, password }) => {
        await signInUser(supabase, email, password)

        const channel = supabase
          .channel(`topic:${randomId()}`, BROADCAST_CONFIG)
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'pg_changes' },
            () => {},
          )
          .subscribe()

        const latency = await waitForPostgresChannel(channel)

        return {
          type: 'load',
          metrics: [{ label: 'latency', unit: 'ms', value: latency }],
        }
      },
    },
    {
      name: 'postgres changes INSERT throughput',
      body: async (supabase, { email, password }) => {
        await signInUser(supabase, email, password)
        const sendTimes = new Map<number, number>()
        const latencies: number[] = []

        const channel = supabase
          .channel(`topic:${randomId()}`, BROADCAST_CONFIG)
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'pg_changes' },
            async (payload) => {
              const recordedAt = now()
              await waitFor(() => Array.from(sendTimes.values()).length === LOAD_MESSAGES)
              const sentAt = sendTimes.get(payload.new.id as number)
              if (sentAt !== undefined) latencies.push(recordedAt - sentAt)
            },
          )
          .subscribe()

        await waitForPostgresChannel(channel)

        for (let i = 0; i < LOAD_MESSAGES; i += 1) {
          const startedAt = now()
          const id = await executeInsert(supabase, 'pg_changes')
          sendTimes.set(id, startedAt)
        }

        return measureThroughput(latencies, LOAD_MESSAGES, LOAD_DELIVERY_SLO)
      },
    },
    {
      name: 'postgres changes UPDATE throughput',
      body: async (supabase, { email, password }) => {
        await signInUser(supabase, email, password)
        const ids = await Promise.all(
          Array.from({ length: LOAD_MESSAGES }, () => executeInsert(supabase, 'pg_changes')),
        )
        const sendTimes = new Map<number, number>()
        const latencies: number[] = []

        const channel = supabase
          .channel(`topic:${randomId()}`, BROADCAST_CONFIG)
          .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'pg_changes' },
            (payload) => {
              const sentAt = sendTimes.get(payload.new.id as number)
              if (sentAt !== undefined) latencies.push(now() - sentAt)
            },
          )
          .subscribe()

        await waitForPostgresChannel(channel)

        await Promise.all(
          ids.map((id) => {
            sendTimes.set(id, now())
            return executeUpdate(supabase, 'pg_changes', id)
          }),
        )

        return measureThroughput(latencies, LOAD_MESSAGES, LOAD_DELIVERY_SLO)
      },
    },
    {
      name: 'postgres changes DELETE throughput',
      body: async (supabase, { email, password }) => {
        await signInUser(supabase, email, password)
        const ids = await Promise.all(
          Array.from({ length: LOAD_MESSAGES }, () => executeInsert(supabase, 'pg_changes')),
        )
        const sendTimes = new Map<number, number>()
        const latencies: number[] = []

        const channel = supabase
          .channel(`topic:${randomId()}`, BROADCAST_CONFIG)
          .on(
            'postgres_changes',
            { event: 'DELETE', schema: 'public', table: 'pg_changes' },
            (payload) => {
              const sentAt = sendTimes.get(payload.old.id as number)
              if (sentAt !== undefined) latencies.push(now() - sentAt)
            },
          )
          .subscribe()

        await waitForPostgresChannel(channel)

        await Promise.all(
          ids.map((id) => {
            sendTimes.set(id, now())
            return executeDelete(supabase, 'pg_changes', id)
          }),
        )

        return measureThroughput(latencies, LOAD_MESSAGES, LOAD_DELIVERY_SLO)
      },
    },
  ],
} satisfies TestSuite
