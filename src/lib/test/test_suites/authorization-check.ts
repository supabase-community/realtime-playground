import type { TestSuite } from '..'
import { signInUser, waitFor, waitForChannel } from '../helpers'
import assert from 'assert'

export default {
  'authorization check': [
    {
      name: 'user using private channel cannot connect if does not have enough permissions',
      body: async (supabase) => {
        let errMessage: string | null = null
        const topic = 'topic:' + crypto.randomUUID()

        const channel = supabase
          .channel(topic, { config: { private: true } })
          .subscribe((status, err) => {
            if (status === 'CHANNEL_ERROR') errMessage = err ? err.message : null
          })

        await waitFor(() => channel.state === 'errored')

        assert.equal(
          errMessage,
          `"Unauthorized: You do not have permissions to read from this Channel topic: ${topic}"`,
        )
      },
    },
    {
      name: 'user using private channel can connect if they have enough permissions',
      body: async (supabase) => {
        await signInUser(supabase, 'filipe@supabase.io', 'test_test')

        const topic = 'topic:' + crypto.randomUUID()
        let connected = false

        const channel = supabase
          .channel(topic, { config: { private: true } })
          .subscribe((status: string) => {
            if (status === 'SUBSCRIBED') connected = true
          })

        await waitForChannel(channel)

        assert.equal(connected, true)
      },
    },
  ],
} satisfies TestSuite
