import { createClient } from '@supabase/supabase-js'
import type { TestSuite } from '.'
import { signInUser, waitFor } from './helpers'
import assert from 'assert'

const realtime = { heartbeatIntervalMs: 5000, timeout: 5000 }

export default {
  'presence extension': [
    {
      name: 'user is able to receive presence updates',
      body: async (url, token) => {
        const supabase = createClient(url, token, { realtime })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result: any = []
        let error = null
        const topic = 'topic:' + crypto.randomUUID()
        const message = crypto.randomUUID()
        const key = crypto.randomUUID()
        const expectedPayload = { message }

        const config = { config: { broadcast: { self: true }, presence: { key } } }
        const channel = supabase
          .channel(topic, config)
          .on('presence', { event: 'join' }, ({ key, newPresences }) =>
            result.push({ key, newPresences }),
          )
          .subscribe()

        await waitFor(() => channel.state == 'joined')

        const res = await channel.track(expectedPayload, { timeout: 5000 })
        if (res == 'timed out') error = res

        await waitFor(() => result.length > 0)

        const presences = result[0].newPresences[0]
        assert.equal(result[0].key, key)
        assert.equal(presences.message, message)
        assert.equal(error, null)
      },
    },
    {
      name: 'user is able to receive presence updates on private channels',
      body: async (url, token) => {
        const supabase = createClient(url, token, { realtime })
        await signInUser(supabase, 'filipe@supabase.io', 'test_test')
        await supabase.realtime.setAuth()

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result: any = []
        let error = null
        const topic = 'topic:' + crypto.randomUUID()
        const message = crypto.randomUUID()
        const key = crypto.randomUUID()
        const expectedPayload = { message }

        const config = {
          config: { private: true, broadcast: { self: true }, presence: { key } },
        }

        const channel = supabase
          .channel(topic, config)
          .on('presence', { event: 'join' }, ({ key, newPresences }) =>
            result.push({ key, newPresences }),
          )
          .subscribe()

        await waitFor(() => channel.state == 'joined')
        const res = await channel.track(expectedPayload, { timeout: 5000 })
        if (res == 'timed out') error = res

        await waitFor(() => result.length > 0)

        const presences = result[0].newPresences[0]
        assert.equal(result[0].key, key)
        assert.equal(presences.message, message)
        assert.equal(error, null)
      },
    },
  ],
} satisfies TestSuite
