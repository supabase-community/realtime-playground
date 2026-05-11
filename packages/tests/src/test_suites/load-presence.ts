import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { measureThroughput, now, randomId, waitForChannel } from '../helpers'
import type { TestSuite } from '../types'
import { LOAD_DELIVERY_SLO } from './const'

const CLIENTS = 10

export default {
  'load-presence': [
    {
      name: 'presence join throughput',
      body: async (supabase, { url, key }) => {
        const senders: SupabaseClient[] = []
        const topic = `topic:${randomId()}`
        const trackTimes = new Map<string, number>()
        const latencies: number[] = []

        try {
          const observerChannel = supabase
            .channel(topic, {
              config: { broadcast: { self: true }, presence: { key: 'observer' } },
            })
            .on('presence', { event: 'join' }, (event) => {
              if (event.key === 'observer') return
              const sentAt = trackTimes.get(event.key)
              if (sentAt !== undefined) latencies.push(now() - sentAt)
            })
            .subscribe()

          await waitForChannel(observerChannel)

          const clients = Array.from({ length: CLIENTS }, (_, index) => ({
            client: createClient(url, key, {
              realtime: { heartbeatIntervalMs: 5000, timeout: 5000 },
              auth: { storageKey: randomId() },
            }),
            key: `client-${index}`,
          }))
          senders.push(...clients.map((entry) => entry.client))

          const channels = await Promise.all(
            clients.map(async ({ client, key: presenceKey }) => {
              const channel = client
                .channel(topic, { config: { presence: { key: presenceKey } } })
                .subscribe()
              await waitForChannel(channel)
              return { channel, key: presenceKey }
            }),
          )

          await Promise.all(
            channels.map(({ channel, key: presenceKey }) => {
              trackTimes.set(presenceKey, now())
              return channel.track({ key: presenceKey })
            }),
          )

          return await measureThroughput(latencies, CLIENTS, LOAD_DELIVERY_SLO)
        } finally {
          await Promise.all(senders.map((client) => client.realtime.disconnect()))
        }
      },
    },
  ],
} satisfies TestSuite
