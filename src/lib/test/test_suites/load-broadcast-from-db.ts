import { TestSuite } from '..'
import { measureThroughput, signInUser, waitForChannel } from '../helpers'
import { LOAD_DELIVERY_SLO, LOAD_MESSAGES } from './const'

export default {
  'load-broadcast-from-db': [
    {
      name: 'broadcast from database throughput',
      body: async (supabase) => {
        await signInUser(supabase, 'filipe@supabase.io', 'test_test')
        const sendTimes = new Map<string, number>()
        const latencies: number[] = []

        const channel = supabase
          .channel('topic:test', { config: { private: true } })
          .on('broadcast', { event: 'INSERT' }, (res) => {
            const t = sendTimes.get(res.payload.record.id)
            if (t !== undefined) latencies.push(performance.now() - t)
          })
          .subscribe()

        await waitForChannel(channel)

        await Promise.all(
          Array.from({ length: LOAD_MESSAGES }, async () => {
            const id = crypto.randomUUID()
            sendTimes.set(id, performance.now())
            await supabase.from('broadcast_changes').insert({ id, value: crypto.randomUUID() })
          }),
        )

        await supabase
          .from('broadcast_changes')
          .delete()
          .in('id', [...sendTimes.keys()])

        return await measureThroughput(latencies, LOAD_MESSAGES, LOAD_DELIVERY_SLO)
      },
    },
  ],
} satisfies TestSuite
