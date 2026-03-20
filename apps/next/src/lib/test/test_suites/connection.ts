import { TestSuite } from '..'
import { measureThroughput, waitForChannel } from '../helpers'
import { BROADCAST_CONFIG, LOAD_DELIVERY_SLO, LOAD_MESSAGES } from './const'

export default {
  connection: [
    {
      name: 'first connect latency',
      body: async (supabase) => {
        const channel = supabase.channel('topic:' + crypto.randomUUID()).subscribe()

        const latency = await waitForChannel(channel)

        return {
          type: 'load',
          metrics: [
            {
              label: 'latency',
              unit: 'ms',
              value: latency,
            },
          ],
        }
      },
    },
    {
      name: 'broadcast message throughput',
      body: async (supabase) => {
        const topic = 'topic:' + crypto.randomUUID()
        const event = 'load'
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
  ],
} satisfies TestSuite
