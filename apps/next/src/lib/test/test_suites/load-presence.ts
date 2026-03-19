import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { TestSuite } from '..'
import { measureThroughput, waitForChannel } from '../helpers'
import { LOAD_DELIVERY_SLO } from './const'

const CLIENTS = 10

export default {
  'load-presence': [
    {
      name: 'presence join throughput',
      body: async (supabase, { url, key }) => {
        const senders: SupabaseClient[] = []
        const topic = 'topic:' + crypto.randomUUID()
        const trackTimes = new Map<string, number>()
        const latencies: number[] = []

        try {
          const observerChannel = supabase
            .channel(topic, {
              config: { broadcast: { self: true }, presence: { key: 'observer' } },
            })
            .on('presence', { event: 'join' }, (e) => {
              if (e.key === 'observer') return
              const t = trackTimes.get(e.key)
              if (t !== undefined) latencies.push(performance.now() - t)
            })
            .subscribe()

          await waitForChannel(observerChannel)
          const clients = Array.from({ length: CLIENTS }, (_, i) => ({
            client: createClient(url, key, {
              realtime: { heartbeatIntervalMs: 5000, timeout: 5000 },
              auth: { storageKey: crypto.randomUUID() },
            }),
            key: `client-${i}`,
          }))
          senders.push(...clients.map((c) => c.client))

          const channels = await Promise.all(
            clients.map(async ({ client, key }) => {
              const ch = client.channel(topic, { config: { presence: { key } } }).subscribe()
              await waitForChannel(ch)
              return { ch, key }
            }),
          )

          await Promise.all(
            channels.map(({ ch, key }) => {
              trackTimes.set(key, performance.now())
              return ch.track({ key })
            }),
          )

          return await measureThroughput(latencies, CLIENTS, LOAD_DELIVERY_SLO)
        } finally {
          await Promise.all(senders.map((c) => c.realtime.disconnect()))
        }
      },
    },
  ],
} satisfies TestSuite
