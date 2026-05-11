import { measureThroughput, now, randomId, waitForChannel } from '../helpers'
import type { TestSuite } from '../types'
import { BROADCAST_CONFIG, LOAD_DELIVERY_SLO, LOAD_MESSAGES } from './const'

export default {
  'load-broadcast': [
    {
      name: 'broadcast self throughput',
      body: async (supabase) => {
        const event = 'load'
        const topic = `topic:${randomId()}`
        const sendTimes = new Map<number, number>()
        const latencies: number[] = []

        const channel = supabase
          .channel(topic, BROADCAST_CONFIG)
          .on('broadcast', { event }, ({ payload }) => {
            const sentAt = sendTimes.get((payload as { seq: number }).seq)
            if (sentAt !== undefined) latencies.push(now() - sentAt)
          })
          .subscribe()

        await waitForChannel(channel)

        for (let i = 0; i < LOAD_MESSAGES; i += 1) {
          sendTimes.set(i, now())
          await channel.send({ type: 'broadcast', event, payload: { seq: i } })
        }

        return measureThroughput(latencies, LOAD_MESSAGES, LOAD_DELIVERY_SLO)
      },
    },
    {
      name: 'broadcast API endpoint throughput',
      body: async (supabase, { url, key }) => {
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
          apikey: key,
        }
        const event = 'load'
        const topic = `topic:${randomId()}`
        const sendTimes = new Map<number, number>()
        const latencies: number[] = []

        const channel = supabase
          .channel(topic, BROADCAST_CONFIG)
          .on('broadcast', { event }, ({ payload }) => {
            const sentAt = sendTimes.get((payload as { seq: number }).seq)
            if (sentAt !== undefined) latencies.push(now() - sentAt)
          })
          .subscribe()

        await waitForChannel(channel)

        await Promise.all(
          Array.from({ length: LOAD_MESSAGES }, async (_, i) => {
            sendTimes.set(i, now())
            const res = await fetch(`${url}/realtime/v1/api/broadcast`, {
              method: 'POST',
              headers,
              body: JSON.stringify({ messages: [{ topic, event, payload: { seq: i } }] }),
            })
            if (!res.ok) throw new Error(`Broadcast API returned ${res.status}`)
          }),
        )

        return measureThroughput(latencies, LOAD_MESSAGES, LOAD_DELIVERY_SLO)
      },
    },
  ],
} satisfies TestSuite
