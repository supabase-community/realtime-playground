import assert from 'assert'
import { randomId, signInUser, waitFor, waitForChannel } from '../helpers'
import type { TestSuite } from '../types'

type Presence = { message: string }
type Presences = Array<Presence>

export default {
  'presence extension': [
    {
      name: 'user is able to receive presence updates',
      body: async (supabase) => {
        const result: { key: string; newPresences: Presences }[] = []
        let error = null
        const topic = `topic:${randomId()}`
        const message = randomId()
        const key = randomId()
        const expectedPayload = { message }

        const config = { config: { broadcast: { self: true }, presence: { key } } }
        const channel = supabase
          .channel(topic, config)
          .on('presence', { event: 'join' }, ({ key: nextKey, newPresences }) =>
            result.push({
              key: nextKey,
              newPresences: newPresences as unknown as Presences,
            }),
          )
          .subscribe()

        await waitForChannel(channel)

        const res = await channel.track(expectedPayload, { timeout: 5000 })
        if (res === 'timed out') error = res

        await waitFor(() => result.length > 0)

        const presences = result[0]?.newPresences[0]
        assert.equal(result[0]?.key, key)
        assert.equal(presences?.message, message)
        assert.equal(error, null)
      },
    },
    {
      name: 'user is able to receive presence updates on private channels',
      body: async (supabase, { email, password }) => {
        await signInUser(supabase, email, password)
        await supabase.realtime.setAuth()

        const result: { key: string; newPresences: Presences }[] = []
        let error = null
        const topic = `topic:${randomId()}`
        const message = randomId()
        const key = randomId()
        const expectedPayload = { message }

        const config = {
          config: { private: true, broadcast: { self: true }, presence: { key } },
        }

        const channel = supabase
          .channel(topic, config)
          .on('presence', { event: 'join' }, ({ key: nextKey, newPresences }) =>
            result.push({
              key: nextKey,
              newPresences: newPresences as unknown as Presences,
            }),
          )
          .subscribe()

        await waitForChannel(channel)
        const res = await channel.track(expectedPayload, { timeout: 5000 })
        if (res === 'timed out') error = res

        await waitFor(() => result.length > 0)

        const presences = result[0]?.newPresences[0]
        assert.equal(result[0]?.key, key)
        assert.equal(presences?.message, message)
        assert.equal(error, null)
      },
    },
  ],
} satisfies TestSuite
