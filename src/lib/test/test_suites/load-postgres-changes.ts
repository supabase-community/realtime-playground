import { TestSuite } from '..'
import {
  executeDelete,
  executeInsert,
  executeUpdate,
  measureThroughput,
  signInUser,
  waitFor,
  waitForPostgresChannel,
} from '../helpers'
import { BROADCAST_CONFIG, LOAD_DELIVERY_SLO, LOAD_MESSAGES } from './const'

export default {
  'load-postgres-changes': [
    {
      name: 'postgres changes system message latency',
      body: async (supabase) => {
        await signInUser(supabase, 'filipe@supabase.io', 'test_test')

        const channel = supabase
          .channel('topic:' + crypto.randomUUID(), BROADCAST_CONFIG)
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'pg_changes' },
            () => {},
          )
          .subscribe()

        const latency = await waitForPostgresChannel(channel)

        return `${latency}ms`
      },
    },
    {
      name: 'postgres changes INSERT throughput',
      body: async (supabase) => {
        await signInUser(supabase, 'filipe@supabase.io', 'test_test')
        const sendTimes = new Map<number, number>()
        const latencies: number[] = []

        const channel = supabase
          .channel('topic:' + crypto.randomUUID(), BROADCAST_CONFIG)
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'pg_changes' },
            async (p) => {
              const now = performance.now();
              await waitFor(() => Array.from(sendTimes.values()).length === LOAD_MESSAGES)
              const t = sendTimes.get(p.new.id)
              if (t !== undefined) latencies.push(now - t)
            },
          )
          .subscribe()

        await waitForPostgresChannel(channel)

        for (let i = 0; i < LOAD_MESSAGES; i++) {
          const t = performance.now()
          const id = await executeInsert(supabase, 'pg_changes')
          sendTimes.set(id, t)
        }

        return await measureThroughput(latencies, LOAD_MESSAGES, LOAD_DELIVERY_SLO)
      },
    },
    {
      name: 'postgres changes UPDATE throughput',
      body: async (supabase) => {
        await signInUser(supabase, 'filipe@supabase.io', 'test_test')
        const ids = await Promise.all(
          Array.from({ length: LOAD_MESSAGES }, () => executeInsert(supabase, 'pg_changes')),
        )
        const sendTimes = new Map<number, number>()
        const latencies: number[] = []

        const channel = supabase
          .channel('topic:' + crypto.randomUUID(), BROADCAST_CONFIG)
          .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'pg_changes' },
            (p) => {
              const t = sendTimes.get(p.new.id)
              if (t !== undefined) latencies.push(performance.now() - t)
            },
          )
          .subscribe()

        await waitForPostgresChannel(channel)

        await Promise.all(
          ids.map((id) => {
            sendTimes.set(id, performance.now())
            return executeUpdate(supabase, 'pg_changes', id)
          }),
        )

        return await measureThroughput(latencies, LOAD_MESSAGES, LOAD_DELIVERY_SLO)
      },
    },
    {
      name: 'postgres changes DELETE throughput',
      body: async (supabase) => {
        await signInUser(supabase, 'filipe@supabase.io', 'test_test')
        const ids = await Promise.all(
          Array.from({ length: LOAD_MESSAGES }, () => executeInsert(supabase, 'pg_changes')),
        )
        const sendTimes = new Map<number, number>()
        const latencies: number[] = []

        const channel = supabase
          .channel('topic:' + crypto.randomUUID(), BROADCAST_CONFIG)
          .on(
            'postgres_changes',
            { event: 'DELETE', schema: 'public', table: 'pg_changes' },
            (p) => {
              const t = sendTimes.get(p.old.id)
              if (t !== undefined) latencies.push(performance.now() - t)
            },
          )
          .subscribe()

        await waitForPostgresChannel(channel)

        await Promise.all(
          ids.map((id) => {
            sendTimes.set(id, performance.now())
            return executeDelete(supabase, 'pg_changes', id)
          }),
        )

        return await measureThroughput(latencies, LOAD_MESSAGES, LOAD_DELIVERY_SLO)
      },
    },
  ],
} satisfies TestSuite
