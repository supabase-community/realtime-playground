import type { SupabaseClient } from '@supabase/supabase-js'

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const waitFor = (cond: () => boolean, timeout = 5000, retryDelay = 200) => {
  return new Promise<void>(async (resolve, reject) => {
    setTimeout(() => {
      reject({ message: 'timeout' })
    }, timeout)

    while (true) {
      if (cond()) {
        resolve()
        return
      } else {
        await sleep(retryDelay)
      }
    }
  })
}

export async function signInUser(supabase: SupabaseClient, email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw new Error(`Error signing in: ${error.message}`)
  return data!.session!.access_token
}

export async function executeInsert(supabase: SupabaseClient, table: string): Promise<number> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error }: any = await supabase
    .from(table)
    .insert([{ value: crypto.randomUUID() }])
    .select('id')

  if (error) throw new Error(`Error inserting data: ${error.message}`)
  return data[0].id
}

export async function executeUpdate(supabase: SupabaseClient, table: string, id: number) {
  const { data, error } = await supabase
    .from(table)
    .update({ value: crypto.randomUUID() })
    .eq('id', id)

  if (error) throw new Error(`Error updating data: ${error.message}`)
  return data
}

export async function executeDelete(supabase: SupabaseClient, table: string, id: number) {
  const { data, error } = await supabase.from(table).delete().eq('id', id)
  if (error) {
    throw new Error(`Error deleting data: ${error.message}`)
  }
  return data
}
