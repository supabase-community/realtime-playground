import { createClient } from '@supabase/supabase-js'
import type { TestSuite } from '.'
import { signInUser, waitFor } from './helpers'
import assert from 'assert'

const realtime = { heartbeatIntervalMs: 5000, timeout: 5000 }

export default {
  'authorization check': [
    {
      name: 'user using private channel cannot connect if does not have enough permissions',
      body: async (url, token) => {
        const supabase = createClient(url, token, { realtime })

        let errMessage: any = null
        let topic = 'topic:' + crypto.randomUUID()

        const channel = supabase
          .channel(topic, { config: { private: true } })
          .subscribe((status: string, err: any) => {
            if (status == 'CHANNEL_ERROR') errMessage = err.message
          })

        await waitFor(() => channel.state == 'errored')

        assert.equal(
          errMessage,
          `"Unauthorized: You do not have permissions to read from this Channel topic: ${topic}"`,
        )
      },
    },
    {
      name: 'user using private channel can connect if they have enough permissions',
      body: async (url, token) => {
        const supabase = createClient(url, token, { realtime })
        await signInUser(supabase, 'filipe@supabase.io', 'test_test')
        await supabase.realtime.setAuth()

        let topic = 'topic:' + crypto.randomUUID()
        let connected = false

        const channel = supabase
          .channel(topic, { config: { private: true } })
          .subscribe((status: string) => {
            if (status == 'SUBSCRIBED') connected = true
          })
        await waitFor(() => channel.state == 'joined')

        assert.equal(connected, true)
      },
    },
  ],
} satisfies TestSuite
