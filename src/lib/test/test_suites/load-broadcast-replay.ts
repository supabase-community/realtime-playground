import { TestSuite } from '..'
import { measureThroughput, signInUser, waitForChannel } from '../helpers'
import { LOAD_DELIVERY_SLO, LOAD_MESSAGES } from './const'

export default {
  'load-broadcast-replay': [
    {
      name: 'broadcast replay throughput',
      body: async (supabase) => {
        await signInUser(supabase, 'filipe@supabase.io', 'test_test')

        const event = crypto.randomUUID()
        const topic = 'topic:' + crypto.randomUUID()

        const since = Date.now() - 1000
        await Promise.all(
          Array.from({ length: LOAD_MESSAGES }, (_, i) =>
            supabase
              .from('replay_check')
              .insert({ id: crypto.randomUUID(), topic, event, payload: { seq: i } }),
          ),
        )

        const latencies: number[] = []
        const replayStart = performance.now()
        const receiver = supabase
          .channel(topic, {
            config: { private: true, broadcast: { replay: { since, limit: 25 } } },
          })
          .on('broadcast', { event }, () => {
            latencies.push(performance.now() - replayStart)
          })
          .subscribe()

        await waitForChannel(receiver)

        return await measureThroughput(latencies, LOAD_MESSAGES, LOAD_DELIVERY_SLO)
      },
    },
  ],
} satisfies TestSuite
