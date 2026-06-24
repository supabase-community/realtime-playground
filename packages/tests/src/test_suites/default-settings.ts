import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import assert from 'assert'
import { randomId, sleep, waitFor, waitForChannel } from '../helpers'
import type { TestSuite } from '../types'

const secondaryClient = (url: string, key: string): SupabaseClient =>
  createClient(url, key, {
    realtime: { heartbeatIntervalMs: 5000, timeout: 5000 },
    auth: { storageKey: randomId() },
  })

const trackOnTopic = async (supabase: SupabaseClient, topic: string, key: string) => {
  const channel = supabase
    .channel(topic, { config: { presence: { key, enabled: true } } })
    .subscribe()

  await waitForChannel(channel)
  await channel.track({ message: randomId() }, { timeout: 5000 })
  await waitFor(() => Object.keys(channel.presenceState()).length > 0)

  return channel
}

export default {
  'default connection settings': [
    {
      name: 'presence is disabled by default',
      body: async (supabase, { url, key }) => {
        const topic = `topic:${randomId()}`

        await trackOnTopic(supabase, topic, randomId())

        const probeClient = secondaryClient(url, key)
        try {
          const probe = probeClient.channel(topic).subscribe()
          await waitForChannel(probe)

          await sleep(1500)
          assert.equal(
            Object.keys(probe.presenceState()).length,
            0,
            'default channel received presence state',
          )
        } finally {
          probeClient.realtime.disconnect()
        }
      },
    },
    {
      name: 'presence is enabled when opted in via config',
      body: async (supabase, { url, key }) => {
        const topic = `topic:${randomId()}`
        const trackerKey = randomId()

        await trackOnTopic(supabase, topic, trackerKey)

        const probeClient = secondaryClient(url, key)
        try {
          const probe = probeClient
            .channel(topic, { config: { presence: { enabled: true } } })
            .subscribe()
          await waitForChannel(probe)

          await waitFor(() => Object.keys(probe.presenceState()).includes(trackerKey))
          assert.ok(
            Object.keys(probe.presenceState()).includes(trackerKey),
            'tracker presence not visible to opted-in channel',
          )
        } finally {
          probeClient.realtime.disconnect()
        }
      },
    },
  ],
} satisfies TestSuite
