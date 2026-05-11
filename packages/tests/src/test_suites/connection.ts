import { measureThroughput, now, randomId, waitForChannel } from '../helpers'
import type { TestSuite } from '../types'
import { BROADCAST_CONFIG, LOAD_DELIVERY_SLO, LOAD_MESSAGES } from './const'

export default {
  connection: [
    {
      name: 'first connect latency',
      body: async (supabase) => {
        const channel = supabase.channel(`topic:${randomId()}`).subscribe()

        const latency = await waitForChannel(channel)

        return {
          type: 'load',
          metrics: [{ label: 'latency', unit: 'ms', value: latency }],
        }
      },
    },
    {
      name: 'broadcast message throughput',
      body: async (supabase) => {
        const topic = `topic:${randomId()}`
        const event = 'load'
        const sendTimes = new Map<number, number>()
        const latencies: number[] = []

        const channel = supabase
          .channel(topic, BROADCAST_CONFIG)
          .on('broadcast', { event }, ({ payload }) => {
            const record = payload as { seq: number }
            const sentAt = sendTimes.get(record.seq)
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
  ],
} satisfies TestSuite
