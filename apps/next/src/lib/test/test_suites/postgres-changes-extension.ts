import { TestSuite } from '..'
import {
  executeDelete,
  executeInsert,
  executeUpdate,
  signInUser,
  waitFor,
  waitForChannel,
  waitForPostgresChannel,
} from '../helpers'
import assert from 'assert'
import { BROADCAST_CONFIG } from './const'

export default {
  'postgres changes extension': [
    {
      name: 'user is able to receive INSERT only events from a subscribed table with filter applied',
      body: async (supabase) => {
        await signInUser(supabase, 'filipe@supabase.io', 'test_test')
        await supabase.realtime.setAuth()

        let subscribed: string | null = null
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let result: any = null
        const topic = 'topic:' + crypto.randomUUID()

        const previousId = await executeInsert(supabase, 'pg_changes')
        await executeInsert(supabase, 'dummy')

        const channel = supabase
          .channel(topic, BROADCAST_CONFIG)
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

        await waitForChannel(channel)
        await waitFor(() => subscribed === 'ok')

        await executeInsert(supabase, 'pg_changes')
        await executeInsert(supabase, 'dummy')

        await waitFor(() => result !== null)
        const insertPayload = result
        assert.equal(typeof insertPayload.new.id, 'number')

        assert.equal(insertPayload.eventType, 'INSERT')
        assert.equal(insertPayload.new.id, previousId + 1)
      },
    },
    {
      name: 'user is able to receive UPDATE only events from a subscribed table with filter applied',
      body: async (supabase) => {
        await signInUser(supabase, 'filipe@supabase.io', 'test_test')
        await supabase.realtime.setAuth()

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let result: any = null
        let subscribed: string | null = null
        const topic = 'topic:' + crypto.randomUUID()

        const mainId = await executeInsert(supabase, 'pg_changes')
        const fakeId = await executeInsert(supabase, 'pg_changes')
        const dummyId = await executeInsert(supabase, 'dummy')

        const channel = supabase
          .channel(topic, BROADCAST_CONFIG)
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

        await waitForChannel(channel)
        await waitFor(() => subscribed === 'ok')

        executeUpdate(supabase, 'pg_changes', mainId)
        executeUpdate(supabase, 'pg_changes', fakeId)
        executeUpdate(supabase, 'dummy', dummyId)

        await waitFor(() => result !== null)
        const updatePayload = result
        assert.equal(typeof updatePayload.new.id, 'number')

        assert.equal(updatePayload.eventType, 'UPDATE')
        assert.equal(updatePayload.new.id, mainId)
      },
    },
    {
      name: 'user is able to receive DELETE only events from a subscribed table with filter applied',
      body: async (supabase) => {
        await signInUser(supabase, 'filipe@supabase.io', 'test_test')
        await supabase.realtime.setAuth()

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let result: any = null
        let subscribed: string | null = null
        const topic = 'topic:' + crypto.randomUUID()

        const mainId = await executeInsert(supabase, 'pg_changes')
        const fakeId = await executeInsert(supabase, 'pg_changes')
        const dummyId = await executeInsert(supabase, 'dummy')

        const channel = supabase
          .channel(topic, BROADCAST_CONFIG)
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

        await waitForChannel(channel)
        await waitFor(() => subscribed === 'ok')

        executeDelete(supabase, 'pg_changes', mainId)
        executeDelete(supabase, 'pg_changes', fakeId)
        executeDelete(supabase, 'dummy', dummyId)

        await waitFor(() => result !== null)
        const deletePayload = result
        assert.equal(typeof deletePayload.old.id, 'number')

        assert.equal(deletePayload.eventType, 'DELETE')
        assert.equal(deletePayload.old.id, mainId)
      },
    },
    {
      name: 'user receives INSERT, UPDATE and DELETE concurrently',
      body: async (supabase) => {
        await signInUser(supabase, 'filipe@supabase.io', 'test_test')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let insertResult: any = null,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          updateResult: any = null,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          deleteResult: any = null

        const insertId = await executeInsert(supabase, 'pg_changes')
        const updateId = await executeInsert(supabase, 'pg_changes')
        const deleteId = await executeInsert(supabase, 'pg_changes')

        const channel = supabase
          .channel('topic:' + crypto.randomUUID(), BROADCAST_CONFIG)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'pg_changes',
              filter: `id=eq.${insertId + 3}`,
            },
            (p) => (insertResult = p),
          )
          .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'pg_changes', filter: `id=eq.${updateId}` },
            (p) => (updateResult = p),
          )
          .on(
            'postgres_changes',
            { event: 'DELETE', schema: 'public', table: 'pg_changes', filter: `id=eq.${deleteId}` },
            (p) => (deleteResult = p),
          )
          .subscribe()

        await waitForPostgresChannel(channel)

        await Promise.all([
          executeInsert(supabase, 'pg_changes'),
          executeUpdate(supabase, 'pg_changes', updateId),
          executeDelete(supabase, 'pg_changes', deleteId),
        ])
        await Promise.all([
          waitFor(() => insertResult),
          waitFor(() => updateResult),
          waitFor(() => deleteResult),
        ])
        assert.strictEqual(insertResult.eventType, 'INSERT')
        assert.strictEqual(updateResult.eventType, 'UPDATE')
        assert.strictEqual(deleteResult.eventType, 'DELETE')
      },
    },
  ],
} satisfies TestSuite
