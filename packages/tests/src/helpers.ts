import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js'
import assert from 'assert'

import { now, randomId } from './runtime'
import type { TestData } from './types'

export { now, randomId }

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const waitFor = async <T>(cond: () => T, timeout = 5000, retryDelay = 50) => {
  const start = Date.now()
  const deadline = start + timeout

  while (true) {
    if (cond()) {
      return Date.now() - start
    }

    if (Date.now() > deadline) {
      throw new Error('timeout')
    }

    await sleep(retryDelay)
  }
}

export const waitForChannel = async (channel: RealtimeChannel) => {
  const result = await waitFor(() => channel.state !== 'joining')

  if (channel.state !== 'joined') {
    throw new Error('Channel failed to join')
  }

  return result
}

export const waitForPostgresChannel = async (channel: RealtimeChannel) => {
  let systemOk = false
  channel.on('system', '*', ({ status, extension }: { status: string; extension: string }) => {
    if (status === 'ok' && extension === 'postgres_changes') systemOk = true
  })

  await waitForChannel(channel)

  return waitFor(() => systemOk)
}

export const measureThroughput = async (
  latencies: number[],
  total: number,
  slo: number,
): Promise<TestData> => {
  try {
    await waitFor(() => latencies.length === total, 20_000)
  } catch (error) {
    if (!(error instanceof Error) || error.message !== 'timeout') throw error
  }

  const delivered = latencies.length
  const deliveryRate = (delivered / total) * 100
  const sorted = latencies.slice().sort((a, b) => a - b)
  assert(deliveryRate >= slo, `Delivery rate ${deliveryRate.toFixed(1)}% below ${slo}% SLO`)

  return {
    type: 'load',
    metrics: [
      { label: 'delivered', value: deliveryRate, unit: '%' },
      { label: 'p50', value: sorted[Math.ceil(sorted.length * 0.5) - 1] ?? 0, unit: 'ms' },
      { label: 'p95', value: sorted[Math.ceil(sorted.length * 0.95) - 1] ?? 0, unit: 'ms' },
      { label: 'p99', value: sorted[Math.ceil(sorted.length * 0.99) - 1] ?? 0, unit: 'ms' },
    ],
  }
}

export async function signInUser(supabase: SupabaseClient, email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(`Error signing in: ${error.message}`)
  }

  return data.session?.access_token
}

export async function executeInsert(supabase: SupabaseClient, table: string): Promise<number> {
  const { data, error } = await supabase
    .from(table)
    .insert([{ value: randomId() }])
    .select('id')
    .single()

  if (error) {
    throw new Error(`Error inserting data: ${error.message}`)
  }

  return data.id
}

export async function executeUpdate(supabase: SupabaseClient, table: string, id: number) {
  const { data, error } = await supabase.from(table).update({ value: randomId() }).eq('id', id)

  if (error) {
    throw new Error(`Error updating data: ${error.message}`)
  }

  return data
}

export async function executeDelete(supabase: SupabaseClient, table: string, id: number) {
  const { data, error } = await supabase.from(table).delete().eq('id', id)

  if (error) {
    throw new Error(`Error deleting data: ${error.message}`)
  }

  return data
}
