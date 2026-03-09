import { createClient } from '@supabase/supabase-js'
import type { TestSuite } from '.'
import { waitFor } from './helpers'
import assert from 'assert'

const config = { config: { broadcast: { self: true } } }

export default {
  'broadcast extension': [
    {
      name: 'user is able to receive self broadcast',
      body: async (url, key) => {
        const supabase = createClient(url, key)
        const topic = 'topic:' + crypto.randomUUID()
        const event = crypto.randomUUID()
        let expectedPayload = { message: crypto.randomUUID() }
        let result: Object | null = null

        const channel = supabase
          .channel(topic, config)
          .on('broadcast', { event }, ({ payload }) => (result = payload))
          .subscribe()

        await waitFor(() => channel.state == 'joined')

        await channel.send({
          type: 'broadcast',
          event,
          payload: expectedPayload,
        })

        await waitFor(() => result != null)
        assert.deepEqual(result, expectedPayload)
      },
    },
    {
      name: 'user is able to use the endpoint to broadcast',
      body: async (url, key) => {
        const supabase = createClient(url, key)
        const topic = 'topic:' + crypto.randomUUID()
        const event = crypto.randomUUID()
        let expectedPayload = { message: crypto.randomUUID() }
        let result: Object | null = null

        const channel = supabase
          .channel(topic, config)
          .on('broadcast', { event }, ({ payload }) => (result = payload))
          .subscribe()

        await waitFor(() => channel.state == 'joined')

        await supabase.channel(topic, config).httpSend(event, expectedPayload)

        await waitFor(() => result != null)
        assert.deepEqual(result, expectedPayload)
      },
    },
  ],
} satisfies TestSuite
