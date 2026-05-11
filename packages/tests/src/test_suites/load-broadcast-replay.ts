import { measureThroughput, now, randomId, signInUser, waitForChannel } from '../helpers'
import type { TestSuite } from '../types'
import { LOAD_DELIVERY_SLO, LOAD_MESSAGES } from './const'

export default {
  'load-broadcast-replay': [
    {
      name: 'broadcast replay throughput',
      body: async (supabase, { email, password }) => {
        await signInUser(supabase, email, password)

        const event = randomId()
        const topic = `topic:${randomId()}`

        const since = Date.now() - 60 * 1000

        await Promise.all(
          Array.from({ length: LOAD_MESSAGES }, (_, i) =>
            supabase
              .from('replay_check')
              .insert({ id: randomId(), topic, event, payload: { seq: i } }),
          ),
        )

        const latencies: number[] = []
        const replayStart = now()
        const receiver = supabase
          .channel(topic, {
            config: { private: true, broadcast: { replay: { since, limit: 25 } } },
          })
          .on('broadcast', { event }, () => {
            latencies.push(now() - replayStart)
          })
          .subscribe()

        await waitForChannel(receiver)

        return measureThroughput(latencies, LOAD_MESSAGES, LOAD_DELIVERY_SLO)
      },
    },
  ],
} satisfies TestSuite
