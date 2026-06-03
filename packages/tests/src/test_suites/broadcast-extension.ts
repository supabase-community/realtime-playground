import assert from 'assert'
import { randomId, waitFor, waitForChannel } from '../helpers'
import type { TestSuite } from '../types'
import { BROADCAST_CONFIG } from './const'

export default {
  'broadcast extension': [
    {
      name: 'user is able to receive self broadcast',
      body: async (supabase) => {
        const topic = `topic:${randomId()}`
        const event = randomId()
        const expectedPayload = { message: randomId() }
        let result: object | null = null

        const channel = supabase
          .channel(topic, BROADCAST_CONFIG)
          .on('broadcast', { event }, ({ payload }) => (result = payload))
          .subscribe()

        await waitForChannel(channel)

        await channel.send({
          type: 'broadcast',
          event,
          payload: expectedPayload,
        })

        await waitFor(() => result !== null)
        assert.deepEqual(result, expectedPayload)
      },
    },
    {
      name: 'user is able to use the endpoint to broadcast',
      body: async (supabase) => {
        const topic = `topic:${randomId()}`
        const event = randomId()
        const expectedPayload = { message: randomId() }
        let result: object | null = null

        const channel = supabase
          .channel(topic, BROADCAST_CONFIG)
          .on('broadcast', { event }, ({ payload }) => (result = payload))
          .subscribe()

        await waitForChannel(channel)

        await supabase.channel(topic, BROADCAST_CONFIG).httpSend(event, expectedPayload)

        await waitFor(() => result !== null)
        assert.deepEqual(result, expectedPayload)
      },
    },
    {
      name: 'user is able to use the endpoint to broadcast binary',
      body: async (supabase) => {
        const topic = `topic:${randomId()}`
        const event = randomId()
        const expectedPayload = new Uint8Array([0xde, 0xad, 0xbe, 0xef, 0x00, 0xff])
        let result: ArrayBuffer | null = null

        const channel = supabase
          .channel(topic, BROADCAST_CONFIG)
          .on('broadcast', { event }, ({ payload }) => (result = payload))
          .subscribe()

        await waitForChannel(channel)

        await supabase.channel(topic, BROADCAST_CONFIG).httpSend(event, expectedPayload)

        await waitFor(() => result !== null)
        assert(result !== null)
        const received = new Uint8Array(result)
        assert.strictEqual(received.length, expectedPayload.length)
        assert.ok(
          expectedPayload.every((byte, i) => received[i] === byte),
          'binary payload bytes mismatch',
        )
      },
    },
  ],
} satisfies TestSuite
