import type {
  RealtimeBroadcastPersist,
  RealtimeChannel,
  SupabaseClient,
} from '@supabase/supabase-js'
import assert from 'assert'
import { randomId, signInUser, sleep, waitFor, waitForChannel } from '../helpers'
import type { TestSuite } from '../types'

const MAX_TTL_SECONDS = 259200

type Received = { event: string; payload: unknown; meta?: { replayed?: boolean } }

/**
 * Sends over the WebSocket on a private channel, then leaves it so the topic can be joined again
 * with replay. `ack` makes the server persist the message before it replies.
 */
const sendPersisted = async (
  supabase: SupabaseClient,
  topic: string,
  event: string,
  persist?: RealtimeBroadcastPersist,
) => {
  const sender = supabase
    .channel(topic, { config: { private: true, broadcast: { ack: true } } })
    .subscribe()
  await waitForChannel(sender)

  const status = await sender.send({
    type: 'broadcast',
    event,
    payload: { message: randomId() },
    persist,
  })
  await supabase.removeChannel(sender)

  assert.strictEqual(status, 'ok', `send returned ${status}`)
}

const joinWithReplay = async (supabase: SupabaseClient, topic: string, since: number) => {
  const received: Received[] = []
  const channel = supabase
    .channel(topic, { config: { private: true, broadcast: { replay: { since, limit: 25 } } } })
    .on('broadcast', { event: '*' }, (msg) =>
      received.push({ event: msg.event, payload: msg.payload, meta: msg.meta }),
    )
    .subscribe()

  await waitForChannel(channel)

  return { channel, received }
}

/**
 * The REST API answers 202 before the message is saved, so rejoin until `event` is replayed.
 */
const waitForReplay = async (
  supabase: SupabaseClient,
  topic: string,
  since: number,
  event: string,
  timeout = 5000,
) => {
  const deadline = Date.now() + timeout
  let channel: RealtimeChannel | null = null

  while (true) {
    if (channel) await supabase.removeChannel(channel)

    const joined = await joinWithReplay(supabase, topic, since)
    channel = joined.channel

    try {
      await waitFor(() => joined.received.some((m) => m.event === event), 1000)
      return joined.received
    } catch (error) {
      if (!(error instanceof Error) || error.message !== 'timeout') throw error
      if (Date.now() > deadline) throw new Error(`Timed out waiting for ${event} to be replayed`)
    }
  }
}

export default {
  'broadcast persistence': [
    {
      name: 'persisted message is replayed on join',
      body: async (supabase, { email, password }) => {
        await signInUser(supabase, email, password)
        const event = randomId()
        const topic = `topic:${randomId()}`
        const since = Date.now() - 1000

        await sendPersisted(supabase, topic, event, true)
        const received = await waitForReplay(supabase, topic, since, event)

        const msg = received.find((m) => m.event === event)
        assert.ok(msg)
        assert.strictEqual(typeof (msg.payload as { message?: unknown }).message, 'string')
        assert.strictEqual(msg.meta?.replayed, true)
      },
    },
    {
      name: 'persisted message with ttl is replayed on join',
      body: async (supabase, { email, password }) => {
        await signInUser(supabase, email, password)
        const event = randomId()
        const topic = `topic:${randomId()}`
        const since = Date.now() - 1000

        await sendPersisted(supabase, topic, event, { ttl: 60 })
        const received = await waitForReplay(supabase, topic, since, event)

        assert.strictEqual(received.find((m) => m.event === event)?.meta?.replayed, true)
      },
    },
    {
      name: 'message sent without persist is not replayed',
      body: async (supabase, { email, password }) => {
        await signInUser(supabase, email, password)
        const notPersisted = randomId()
        const persisted = randomId()
        const topic = `topic:${randomId()}`
        const since = Date.now() - 1000

        await sendPersisted(supabase, topic, notPersisted)
        await sendPersisted(supabase, topic, persisted, true)
        const received = await waitForReplay(supabase, topic, since, persisted)

        assert.deepStrictEqual(
          received.map((m) => m.event),
          [persisted],
        )
      },
    },
    {
      name: 'persisted message is not replayed once its ttl expires',
      body: async (supabase, { email, password }) => {
        await signInUser(supabase, email, password)
        const expiring = randomId()
        const persisted = randomId()
        const topic = `topic:${randomId()}`
        const since = Date.now() - 1000

        await sendPersisted(supabase, topic, expiring, { ttl: 1 })
        await sleep(2000)
        await sendPersisted(supabase, topic, persisted, true)
        const received = await waitForReplay(supabase, topic, since, persisted)

        assert.deepStrictEqual(
          received.map((m) => m.event),
          [persisted],
        )
      },
    },
    {
      name: 'message persisted over the REST API is replayed on join',
      body: async (supabase, { email, password }) => {
        await signInUser(supabase, email, password)
        const event = randomId()
        const topic = `topic:${randomId()}`
        const since = Date.now() - 1000

        const sender = supabase.channel(topic, { config: { private: true } })
        const result = await sender.httpSend(event, { message: randomId() }, { persist: true })
        await supabase.removeChannel(sender)
        assert.deepStrictEqual(result, { success: true })

        const received = await waitForReplay(supabase, topic, since, event)
        assert.strictEqual(received.find((m) => m.event === event)?.meta?.replayed, true)
      },
    },
    {
      name: 'invalid persist ttl is rejected',
      body: async (supabase, { email, password }) => {
        await signInUser(supabase, email, password)

        for (const ttl of [0, MAX_TTL_SECONDS + 1, 1.5]) {
          const sender = supabase.channel(`topic:${randomId()}`, { config: { private: true } })

          await assert.rejects(
            sender.httpSend(randomId(), { message: randomId() }, { persist: { ttl } }),
            {
              message: `persist ttl must be a positive integer of seconds from 1 to ${MAX_TTL_SECONDS}`,
            },
            `ttl ${ttl} was accepted`,
          )
          await supabase.removeChannel(sender)
        }
      },
    },
    {
      name: 'persist on a public channel is rejected',
      body: async (supabase, { email, password }) => {
        await signInUser(supabase, email, password)

        const sender = supabase.channel(`topic:${randomId()}`)

        // The 422 body is `{ errors: { persist: [...] } }`, which httpSend() doesn't surface, so the
        // message is only the status text.
        await assert.rejects(
          sender.httpSend(randomId(), { message: randomId() }, { persist: true }),
          'persist on a public channel was accepted',
        )
        await supabase.removeChannel(sender)
      },
    },
    {
      name: 'message is broadcast but not replayed when the policy denies persistence',
      body: async (supabase, { email, password }) => {
        await signInUser(supabase, email, password)
        const event = randomId()
        const topic = `no-persist:${randomId()}`
        const since = Date.now() - 1000

        let result: unknown = null
        const receiver = supabase
          .channel(topic, { config: { private: true, broadcast: { self: true, ack: true } } })
          .on('broadcast', { event }, (msg) => (result = msg.payload))
          .subscribe()
        await waitForChannel(receiver)

        const status = await receiver.send({
          type: 'broadcast',
          event,
          payload: { message: randomId() },
          persist: true,
        })
        assert.strictEqual(status, 'ok', `send returned ${status}`)
        await waitFor(() => result)
        await supabase.removeChannel(receiver)

        const { received } = await joinWithReplay(supabase, topic, since)
        await sleep(1000)
        assert.deepStrictEqual(received, [])
      },
    },
  ],
} satisfies TestSuite
