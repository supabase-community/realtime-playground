import { createClient, SupabaseClient } from '@supabase/supabase-js'

export { testCases } from './test_suites'

export type Test = {
  name: string
  body: (
    client: SupabaseClient,
    opts: {
      url: string
      key: string
    },
  ) => Promise<string | void>
}

export type TestSuite = {
  [name: string]: Test[]
}

export type TestResult = {
  status: 'passed' | 'failed'
  message?: string
}

export const runTest = async (test: Test, url: string, key: string): Promise<TestResult> => {
  const client = createClient(url, key, {
    realtime: { heartbeatIntervalMs: 5000, timeout: 5000 },
    auth: {
      storageKey: crypto.randomUUID(),
    },
  })
  let result: TestResult
  try {
    const message = (await test.body(client, { url, key })) ?? undefined
    result = {
      status: 'passed',
      message,
    }
  } catch (e) {
    result = {
      status: 'failed',
      message: (e as Error)?.message,
    }
  }
  client.realtime.disconnect()

  return result
}
