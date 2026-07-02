import {
  postgresChangesFilter,
  type RealtimePostgresDeletePayload,
  type RealtimePostgresInsertPayload,
  type RealtimePostgresUpdatePayload,
} from '@supabase/supabase-js'
import assert from 'assert'
import {
  executeDelete,
  executeInsert,
  executeUpdate,
  randomId,
  signInUser,
  waitFor,
  waitForChannel,
  waitForPostgresChannel,
} from '../helpers'
import type { TestSuite } from '../types'
import { BROADCAST_CONFIG } from './const'

type Payload = Record<string, unknown>

export default {
  'postgres changes extension': [
    {
      name: 'user is able to receive INSERT only events from a subscribed table with filter applied',
      body: async (supabase, { email, password }) => {
        await signInUser(supabase, email, password)
        await supabase.realtime.setAuth()

        let subscribed: string | null = null
        let result: RealtimePostgresInsertPayload<Payload> | null = null
        const topic = `topic:${randomId()}`

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

        // biome-ignore lint/style/noNonNullAssertion: waitFor guarantees non-null
        assert.equal(typeof result!.new.id, 'number')
        // biome-ignore lint/style/noNonNullAssertion: waitFor guarantees non-null
        assert.equal(result!.eventType, 'INSERT')
        // biome-ignore lint/style/noNonNullAssertion: waitFor guarantees non-null
        assert.equal(result!.new.id, previousId + 1)
      },
    },
    {
      name: 'user is able to receive UPDATE only events from a subscribed table with filter applied',
      body: async (supabase, { email, password }) => {
        await signInUser(supabase, email, password)
        await supabase.realtime.setAuth()

        let result: RealtimePostgresUpdatePayload<Payload> | null = null
        let subscribed: string | null = null
        const topic = `topic:${randomId()}`

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

        void executeUpdate(supabase, 'pg_changes', mainId)
        void executeUpdate(supabase, 'pg_changes', fakeId)
        void executeUpdate(supabase, 'dummy', dummyId)

        await waitFor(() => result !== null)

        // biome-ignore lint/style/noNonNullAssertion: waitFor guarantees non-null
        assert.equal(typeof result!.new.id, 'number')
        // biome-ignore lint/style/noNonNullAssertion: waitFor guarantees non-null
        assert.equal(result!.eventType, 'UPDATE')
        // biome-ignore lint/style/noNonNullAssertion: waitFor guarantees non-null
        assert.equal(result!.new.id, mainId)
      },
    },
    {
      name: 'user is able to receive DELETE only events from a subscribed table with filter applied',
      body: async (supabase, { email, password }) => {
        await signInUser(supabase, email, password)
        await supabase.realtime.setAuth()

        let result: RealtimePostgresDeletePayload<Payload> | null = null
        let subscribed: string | null = null
        const topic = `topic:${randomId()}`

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

        void executeDelete(supabase, 'pg_changes', mainId)
        void executeDelete(supabase, 'pg_changes', fakeId)
        void executeDelete(supabase, 'dummy', dummyId)

        await waitFor(() => result !== null)

        // biome-ignore lint/style/noNonNullAssertion: waitFor guarantees non-null
        assert.equal(typeof result!.old.id, 'number')
        // biome-ignore lint/style/noNonNullAssertion: waitFor guarantees non-null
        assert.equal(result!.eventType, 'DELETE')
        // biome-ignore lint/style/noNonNullAssertion: waitFor guarantees non-null
        assert.equal(result!.old.id, mainId)
      },
    },
    {
      name: 'user receives INSERT, UPDATE and DELETE concurrently',
      body: async (supabase, { email, password }) => {
        await signInUser(supabase, email, password)
        let insertResult: RealtimePostgresInsertPayload<Payload> | null = null
        let updateResult: RealtimePostgresUpdatePayload<Payload> | null = null
        let deleteResult: RealtimePostgresDeletePayload<Payload> | null = null

        const insertId = await executeInsert(supabase, 'pg_changes')
        const updateId = await executeInsert(supabase, 'pg_changes')
        const deleteId = await executeInsert(supabase, 'pg_changes')

        const channel = supabase
          .channel(`topic:${randomId()}`, BROADCAST_CONFIG)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'pg_changes',
              filter: `id=eq.${insertId + 3}`,
            },
            (payload) => (insertResult = payload),
          )
          .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'pg_changes', filter: `id=eq.${updateId}` },
            (payload) => (updateResult = payload),
          )
          .on(
            'postgres_changes',
            { event: 'DELETE', schema: 'public', table: 'pg_changes', filter: `id=eq.${deleteId}` },
            (payload) => (deleteResult = payload),
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

        // biome-ignore lint/style/noNonNullAssertion: waitFor guarantees non-null
        assert.strictEqual(insertResult!.eventType, 'INSERT')
        // biome-ignore lint/style/noNonNullAssertion: waitFor guarantees non-null
        assert.strictEqual(updateResult!.eventType, 'UPDATE')
        // biome-ignore lint/style/noNonNullAssertion: waitFor guarantees non-null
        assert.strictEqual(deleteResult!.eventType, 'DELETE')
      },
    },
    {
      name: 'user receives INSERT matching a postgresChangesFilter() builder (eq)',
      body: async (supabase, { email, password }) => {
        await signInUser(supabase, email, password)
        await supabase.realtime.setAuth()

        let result: RealtimePostgresInsertPayload<Payload> | null = null
        const value = randomId()

        const channel = supabase
          .channel(`topic:${randomId()}`, BROADCAST_CONFIG)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'pg_changes',
              filter: postgresChangesFilter().eq('value', value),
            },
            (payload) => {
              if (payload.new.value === value) result = payload
            },
          )
          .subscribe()

        await waitForPostgresChannel(channel)

        await supabase.from('pg_changes').insert([{ value }])
        await executeInsert(supabase, 'pg_changes')

        await waitFor(() => result !== null)

        // biome-ignore lint/style/noNonNullAssertion: waitFor guarantees non-null
        assert.equal(result!.eventType, 'INSERT')
        // biome-ignore lint/style/noNonNullAssertion: waitFor guarantees non-null
        assert.equal(result!.new.value, value)
      },
    },
    {
      name: 'user receives INSERT matching a composite AND filter (value + id)',
      body: async (supabase, { email, password }) => {
        await signInUser(supabase, email, password)
        await supabase.realtime.setAuth()

        let result: RealtimePostgresInsertPayload<Payload> | null = null
        const value = randomId()
        const previousId = await executeInsert(supabase, 'pg_changes')

        const channel = supabase
          .channel(`topic:${randomId()}`, BROADCAST_CONFIG)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'pg_changes',
              // value = <value>  AND  id > previousId
              filter: postgresChangesFilter().eq('value', value).gt('id', previousId),
            },
            (payload) => {
              if (payload.new.value === value) result = payload
            },
          )
          .subscribe()

        await waitForPostgresChannel(channel)

        await supabase.from('pg_changes').insert([{ value }])

        await waitFor(() => result !== null)

        // biome-ignore lint/style/noNonNullAssertion: waitFor guarantees non-null
        assert.equal(result!.eventType, 'INSERT')
        // biome-ignore lint/style/noNonNullAssertion: waitFor guarantees non-null
        assert.equal(result!.new.value, value)
        // biome-ignore lint/style/noNonNullAssertion: waitFor guarantees non-null
        const receivedId = Number(result!.new.id)
        assert.ok(receivedId > previousId, 'id should satisfy the id > previousId clause')
      },
    },
    {
      name: 'user receives INSERT matching a negated filter (not eq)',
      body: async (supabase, { email, password }) => {
        await signInUser(supabase, email, password)
        await supabase.realtime.setAuth()

        const excluded = randomId()
        const delivered = randomId()
        const seen: unknown[] = []

        const channel = supabase
          .channel(`topic:${randomId()}`, BROADCAST_CONFIG)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'pg_changes',
              filter: postgresChangesFilter().not('value', 'eq', excluded),
            },
            (payload) => {
              if (payload.new.value === excluded || payload.new.value === delivered)
                seen.push(payload.new.value)
            },
          )
          .subscribe()

        await waitForPostgresChannel(channel)

        // Insert the excluded row first; only the delivered row must reach us.
        await supabase.from('pg_changes').insert([{ value: excluded }])
        await supabase.from('pg_changes').insert([{ value: delivered }])

        await waitFor(() => seen.includes(delivered))

        assert.ok(seen.includes(delivered), 'delivered row should pass the not filter')
        assert.ok(!seen.includes(excluded), 'excluded row should be filtered out')
      },
    },
    {
      name: 'user receives only selected columns via select',
      body: async (supabase, { email, password }) => {
        await signInUser(supabase, email, password)
        await supabase.realtime.setAuth()

        let result: RealtimePostgresInsertPayload<Payload> | null = null
        const value = randomId()

        const channel = supabase
          .channel(`topic:${randomId()}`, BROADCAST_CONFIG)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'pg_changes',
              // Match our row by value, but only ask for `id` back.
              filter: postgresChangesFilter().eq('value', value),
              select: ['id'],
            },
            (payload) => {
              result = payload
            },
          )
          .subscribe()

        await waitForPostgresChannel(channel)

        await supabase.from('pg_changes').insert([{ value }])

        await waitFor(() => result !== null)

        // biome-ignore lint/style/noNonNullAssertion: waitFor guarantees non-null
        assert.equal(typeof result!.new.id, 'number')
        // biome-ignore lint/style/noNonNullAssertion: waitFor guarantees non-null
        assert.ok(!('value' in result!.new), 'value should be excluded by select')
      },
    },
  ],
} satisfies TestSuite
