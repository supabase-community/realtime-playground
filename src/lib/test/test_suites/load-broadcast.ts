import { TestSuite } from '..'
import { measureThroughput, sleep, waitForChannel } from '../helpers'
import { BROADCAST_CONFIG, LOAD_DELIVERY_SLO, LOAD_MESSAGES } from './const'

export default {
  'load-broadcast': [
    {
      name: 'broadcast self throughput',
      body: async (supabase) => {
        const event = 'load'
        const topic = 'topic:' + crypto.randomUUID()
        const sendTimes = new Map<number, number>()
        const latencies: number[] = []

        const channel = supabase
          .channel(topic, BROADCAST_CONFIG)
          .on('broadcast', { event }, ({ payload }) => {
            const t = sendTimes.get(payload.seq)
            if (t !== undefined) latencies.push(performance.now() - t)
          })
          .subscribe()

        await waitForChannel(channel)

        for (let i = 0; i < LOAD_MESSAGES; i++) {
          sendTimes.set(i, performance.now())
          await channel.send({ type: 'broadcast', event, payload: { seq: i } })
        }

        return await measureThroughput(latencies, LOAD_MESSAGES, LOAD_DELIVERY_SLO)
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
        const topic = 'topic:' + crypto.randomUUID()
        const sendTimes = new Map<number, number>()
        const latencies: number[] = []

        const channel = supabase
          .channel(topic, BROADCAST_CONFIG)
          .on('broadcast', { event }, ({ payload }) => {
            const t = sendTimes.get(payload.seq)
            if (t !== undefined) latencies.push(performance.now() - t)
          })
          .subscribe()

        await waitForChannel(channel)

        await Promise.all(
          Array.from({ length: LOAD_MESSAGES }, async (_, i) => {
            sendTimes.set(i, performance.now())
            const res = await fetch(`${url}/realtime/v1/api/broadcast`, {
              method: 'POST',
              headers,
              body: JSON.stringify({ messages: [{ topic, event, payload: { seq: i } }] }),
            })
            if (!res.ok) throw new Error(`Broadcast API returned ${res.status}`)
          }),
        )

        return await measureThroughput(latencies, LOAD_MESSAGES, LOAD_DELIVERY_SLO)
      },
    },
  ],
} satisfies TestSuite
