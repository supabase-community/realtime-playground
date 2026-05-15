import assert from 'assert'
import { randomId, signInUser, waitFor, waitForChannel } from '../helpers'
import type { TestSuite } from '../types'

export default {
  'authorization check': [
    {
      name: 'user using private channel cannot connect if does not have enough permissions',
      body: async (supabase) => {
        const topic = `topic:${randomId()}`
        let gotChannelError = false

        const channel = supabase
          .channel(topic, { config: { private: true } })
          .subscribe((status) => {
            if (status === 'CHANNEL_ERROR') gotChannelError = true
          })

        await waitFor(() => gotChannelError)

        assert.equal(channel.state, 'errored')
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
