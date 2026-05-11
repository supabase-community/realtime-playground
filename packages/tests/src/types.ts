import type { SupabaseClient } from '@supabase/supabase-js'

export type Test = {
  name: string
  body: (
    client: SupabaseClient,
    opts: {
      url: string
      key: string
      email: string
      password: string
    },
    // biome-ignore lint/suspicious/noConfusingVoidType: void needed to accept async functions that don't return
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
      stack?: string
    }
  | {
      type: 'load'
      metrics: {
        label: string
        value: number
        unit: string
      }[]
    }
