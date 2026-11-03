import assert from 'assert'
import { randomId, signInUser, sleep, waitFor, waitForChannel } from '../helpers'
import type { TestSuite } from '../types'

/** Postgres `bytea` hex input format, the only binary representation PostgREST accepts. */
const toByteaHex = (bytes: Uint8Array) =>
  `\\x${Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')}`

export default {
  'broadcast replay': [
    {
      name: 'replayed messages are delivered on join',
      body: async (supabase, { email, password }) => {
        await signInUser(supabase, email, password)
        const event = randomId()
        const topic = `topic:${randomId()}`
        const payload = { message: randomId() }

        const since = Date.now() - 1000
        await supabase.from('replay_check').insert({ id: randomId(), topic, event, payload })

        let result: { message: string } | null = null
        const receiver = supabase
          .channel(topic, {
            config: { private: true, broadcast: { replay: { since, limit: 1 } } },
          })
          .on('broadcast', { event }, (msg) => (result = msg.payload as { message: string }))
          .subscribe()

        await waitForChannel(receiver)

        await waitFor(() => result)
        // biome-ignore lint/style/noNonNullAssertion: waitFor guarantees non-null
        assert.strictEqual(result!.message, payload.message)
      },
    },
    {
      name: 'replayed binary messages are delivered on join',
      body: async (supabase, { email, password }) => {
        await signInUser(supabase, email, password)
        const event = randomId()
        const topic = `topic:${randomId()}`
        const expectedPayload = new Uint8Array([0xde, 0xad, 0xbe, 0xef, 0x00, 0xff])

        const since = Date.now() - 1000
        const { error } = await supabase
          .from('replay_check')
          .insert({ id: randomId(), topic, event, binary_payload: toByteaHex(expectedPayload) })
        assert.ifError(error)

        let result: ArrayBuffer | null = null
        let receivedMeta: { replayed?: boolean } | null = null
        const receiver = supabase
          .channel(topic, {
            config: { private: true, broadcast: { replay: { since, limit: 1 } } },
          })
          .on('broadcast', { event }, (msg) => {
            result = msg.payload
            receivedMeta = msg.meta ?? null
          })
          .subscribe()

        await waitForChannel(receiver)

        await waitFor(() => result !== null)
        assert(result !== null)
        const received = new Uint8Array(result)
        assert.strictEqual(received.length, expectedPayload.length)
        assert.ok(
          expectedPayload.every((byte, i) => received[i] === byte),
          'binary payload bytes mismatch',
        )
        // biome-ignore lint/style/noNonNullAssertion: waitFor guarantees non-null
        assert.strictEqual(receivedMeta!.replayed, true)
      },
    },
    {
      name: 'replayed messages carry meta.replayed flag',
      body: async (supabase, { email, password }) => {
        await signInUser(supabase, email, password)
        const event = randomId()
        const topic = `topic:${randomId()}`

        const since = Date.now() - 1000
        await supabase
          .from('replay_check')
          .insert({ id: randomId(), topic, event, payload: { value: 1 } })

        let receivedMeta: { replayed?: boolean } | null = null
        const receiver = supabase
          .channel(topic, {
            config: { private: true, broadcast: { replay: { since, limit: 1 } } },
          })
          .on('broadcast', { event }, (msg) => (receivedMeta = msg.meta as { replayed?: boolean }))
          .subscribe()

        await waitForChannel(receiver)

        await waitFor(() => receivedMeta)
        // biome-ignore lint/style/noNonNullAssertion: waitFor guarantees non-null
        assert.strictEqual(receivedMeta!.replayed, true)
      },
    },
    {
      name: 'messages before since are not replayed',
      body: async (supabase, { email, password }) => {
        await signInUser(supabase, email, password)
        const event = randomId()
        const topic = `topic:${randomId()}`

        await supabase
          .from('replay_check')
          .insert({ id: randomId(), topic, event, payload: { value: 'old' } })
        await sleep(1000)
        const since = Date.now()

        let result: Record<string, unknown> | null = null
        const receiver = supabase
          .channel(topic, {
            config: { private: true, broadcast: { replay: { since, limit: 25 } } },
          })
          .on('broadcast', { event }, (msg) => (result = msg.payload as Record<string, unknown>))
          .subscribe()

        await waitForChannel(receiver)

        await sleep(2000)
        assert.strictEqual(result, null)
      },
    },
  ],
} satisfies TestSuite
