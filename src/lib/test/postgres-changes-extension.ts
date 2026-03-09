import { createClient } from '@supabase/supabase-js'
import { TestSuite } from '.'
import { executeDelete, executeInsert, executeUpdate, signInUser, waitFor } from './helpers'
import assert from 'assert'

const realtime = { heartbeatIntervalMs: 5000, timeout: 5000 }

const config = { config: { broadcast: { self: true } } }

export default {
  'postgres changes extension': [
    {
      name: 'user is able to receive INSERT only events from a subscribed table with filter applied',
      body: async (url, token) => {
        const supabase = createClient(url, token, { realtime })
        await signInUser(supabase, 'filipe@supabase.io', 'test_test')
        await supabase.realtime.setAuth()

        let subscribed: string | null = null
        let result: object | null = null
        const topic = 'topic:' + crypto.randomUUID()

        const previousId = await executeInsert(supabase, 'pg_changes')
        await executeInsert(supabase, 'dummy')

        const channel = supabase
          .channel(topic, config)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'pg_changes',
              filter: `id=eq.${previousId + 1}`,
            },
            (payload) => (result = payload),
          )
          .on('system', '*', ({ status }) => (subscribed = status))
          .subscribe()

        await waitFor(() => channel.state == 'joined')
        await waitFor(() => subscribed == 'ok')

        await executeInsert(supabase, 'pg_changes')
        await executeInsert(supabase, 'dummy')

        await waitFor(() => result != null)

        assert.equal(result.eventType, 'INSERT')
        assert.equal(result.new.id, previousId + 1)
      },
    },
    {
      name: 'user is able to receive UPDATE only events from a subscribed table with filter applied',
      body: async (url, token) => {
        const supabase = createClient(url, token, { realtime })
        await signInUser(supabase, 'filipe@supabase.io', 'test_test')
        await supabase.realtime.setAuth()

        let result: object | null = null
        let subscribed: string | null = null
        const topic = 'topic:' + crypto.randomUUID()

        const mainId = await executeInsert(supabase, 'pg_changes')
        const fakeId = await executeInsert(supabase, 'pg_changes')
        const dummyId = await executeInsert(supabase, 'dummy')

        const channel = supabase
          .channel(topic, config)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'pg_changes',
              filter: `id=eq.${mainId}`,
            },
            (payload) => (result = payload),
          )
          .on('system', '*', ({ status }) => (subscribed = status))
          .subscribe()

        await waitFor(() => channel.state == 'joined')
        await waitFor(() => subscribed == 'ok')

        executeUpdate(supabase, 'pg_changes', mainId)
        executeUpdate(supabase, 'pg_changes', fakeId)
        executeUpdate(supabase, 'dummy', dummyId)

        await waitFor(() => result != null)

        assert.equal(result.eventType, 'UPDATE')
        assert.equal(result.new.id, mainId)
      },
    },
    {
      name: 'user is able to receive DELETE only events from a subscribed table with filter applied',
      body: async (url, token) => {
        const supabase = createClient(url, token, { realtime })
        await signInUser(supabase, 'filipe@supabase.io', 'test_test')
        await supabase.realtime.setAuth()

        let result: object | null = null
        let subscribed: string | null = null
        const topic = 'topic:' + crypto.randomUUID()

        const mainId = await executeInsert(supabase, 'pg_changes')
        const fakeId = await executeInsert(supabase, 'pg_changes')
        const dummyId = await executeInsert(supabase, 'dummy')

        const channel = supabase
          .channel(topic, config)
          .on(
            'postgres_changes',
            {
              event: 'DELETE',
              schema: 'public',
              table: 'pg_changes',
              filter: `id=eq.${mainId}`,
            },
            (payload) => (result = payload),
          )
          .on('system', '*', ({ status }) => (subscribed = status))
          .subscribe()

        await waitFor(() => channel.state == 'joined')
        await waitFor(() => subscribed == 'ok')

        executeDelete(supabase, 'pg_changes', mainId)
        executeDelete(supabase, 'pg_changes', fakeId)
        executeDelete(supabase, 'dummy', dummyId)

        await waitFor(() => result != null)

        assert.equal(result.eventType, 'DELETE')
        assert.equal(result.old.id, mainId)
      },
    },
  ],
} satisfies TestSuite
