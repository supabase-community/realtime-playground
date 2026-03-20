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
  ) => Promise<TestData | void>
}

export type TestSuite = {
  [name: string]: Test[]
}

export type TestResult = {
  status: 'passed' | 'failed'
  data?: TestData
}

export type TestData =
  | {
      type: 'normal'
      message: string
    }
  | {
      type: 'load'
      metrics: {
        label: string
        value: number
        unit: string
      }[]
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
    const data = (await test.body(client, { url, key })) ?? undefined
    result = {
      status: 'passed',
      data,
    }
  } catch (e) {
    result = {
      status: 'failed',
      data: {
        type: 'normal',
        message: (e as Error)?.message,
      },
    }
  }
  client.realtime.disconnect()

  return result
}
