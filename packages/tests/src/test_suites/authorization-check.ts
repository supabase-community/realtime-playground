import assert from 'assert'
import { randomId, signInUser, waitFor, waitForChannel } from '../helpers'
import type { TestSuite } from '../types'

export default {
  'authorization check': [
    {
      name: 'user using private channel cannot connect if does not have enough permissions',
      body: async (supabase) => {
        const topic = `topic:${randomId()}`
        let channelError: unknown = null

        const channel = supabase
          .channel(topic, { config: { private: true } })
          .subscribe((status, err) => {
            if (status === 'CHANNEL_ERROR') channelError = err ?? new Error('CHANNEL_ERROR')
            if (status === 'SUBSCRIBED')
              assert.fail('Unauthorized user connected to private channel')
          }, 30_000)

        await waitFor(() => channelError !== null, 35_000)
        await channel.unsubscribe()

        assert.ok(channelError instanceof Error, 'Expected CHANNEL_ERROR from subscribe callback')
        assert.match(
          channelError.message,
          /Unauthorized.*You do not have permissions to read from this Channel topic/,
        )
      },
    },
    {
      name: 'user using private channel can connect if they have enough permissions',
      body: async (supabase, { email, password }) => {
        await signInUser(supabase, email, password)

        const topic = `topic:${randomId()}`
        let connected = false

        const channel = supabase
          .channel(topic, { config: { private: true } })
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') connected = true
          })

        await waitForChannel(channel)

        assert.equal(connected, true)
      },
    },
  ],
} satisfies TestSuite
