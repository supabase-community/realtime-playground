import { createClient } from '@supabase/supabase-js'

import { randomId } from './runtime'
import type { Test, TestResult } from './types'

export const runTest = async (
  test: Test,
  url: string,
  key: string,
  email: string,
  password: string,
): Promise<TestResult> => {
  const client = createClient(url, key, {
    realtime: { heartbeatIntervalMs: 5000, timeout: 5000 },
    auth: {
      storageKey: randomId(),
    },
  })

  let result: TestResult
  try {
    const data = (await test.body(client, { url, key, email, password })) ?? undefined
    result = {
      status: 'passed',
      data,
    }
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    result = {
      status: 'failed',
      data: {
        type: 'normal',
        message: err.message,
        stack: err.stack,
      },
    }
  }

  client.realtime.disconnect()

  return result
}
