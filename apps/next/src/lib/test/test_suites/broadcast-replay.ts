import assert from 'assert'
import { TestSuite } from '..'
import { signInUser, sleep, waitFor, waitForChannel } from '../helpers'

export default {
  'broadcast replay': [
    {
      name: 'replayed messages are delivered on join',
      body: async (supabase) => {
        await signInUser(supabase, 'filipe@supabase.io', 'test_test')
        const event = crypto.randomUUID()
        const topic = 'topic:' + crypto.randomUUID()
        const payload = { message: crypto.randomUUID() }

        const since = Date.now() - 1000
        await supabase
          .from('replay_check')
          .insert({ id: crypto.randomUUID(), topic, event, payload })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let result: any = null
        const receiver = supabase
          .channel(topic, {
            config: { private: true, broadcast: { replay: { since, limit: 1 } } },
          })
          .on('broadcast', { event }, (msg) => (result = msg.payload))
          .subscribe()

        await waitForChannel(receiver)

        await waitFor(() => result)
        assert.strictEqual(result.message, payload.message)
      },
    },
    {
      name: 'replayed messages carry meta.replayed flag',
      body: async (supabase) => {
        await signInUser(supabase, 'filipe@supabase.io', 'test_test')
        const event = crypto.randomUUID()
        const topic = 'topic:' + crypto.randomUUID()

        const since = Date.now() - 1000
        await supabase
          .from('replay_check')
          .insert({ id: crypto.randomUUID(), topic, event, payload: { value: 1 } })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let receivedMeta: any = null
        const receiver = supabase
          .channel(topic, {
            config: { private: true, broadcast: { replay: { since, limit: 1 } } },
          })
          .on('broadcast', { event }, (msg) => (receivedMeta = msg.meta))
          .subscribe()

        await waitForChannel(receiver)

        await waitFor(() => receivedMeta)
        assert.strictEqual(receivedMeta?.replayed, true)
      },
    },
    {
      name: 'messages before since are not replayed',
      body: async (supabase) => {
        await signInUser(supabase, 'filipe@supabase.io', 'test_test')
        const event = crypto.randomUUID()
        const topic = 'topic:' + crypto.randomUUID()

        await supabase
          .from('replay_check')
          .insert({ id: crypto.randomUUID(), topic, event, payload: { value: 'old' } })
        await sleep(1000)
        const since = Date.now()

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let result: any = null
        const receiver = supabase
          .channel(topic, {
            config: { private: true, broadcast: { replay: { since, limit: 25 } } },
          })
          .on('broadcast', { event }, (msg) => (result = msg.payload))
          .subscribe()

        await waitForChannel(receiver)

        await sleep(2000)
        assert.strictEqual(result, null)
      },
    },
  ],
} satisfies TestSuite
