import assert from 'assert'
import broadcastExtension from './broadcast-extension'

export type Test = {
  name: string
  body: (url: string, key: string) => Promise<void>
}

export type TestSuite = {
  [name: string]: Test[]
}

export type TestResult =
  | {
    status: 'passed'
  }
  | {
    status: 'failed'
    message: string
  }

export const testCases: TestSuite = {
  ...broadcastExtension
}

export const runTest = async (test: Test, url: string, key: string): Promise<TestResult> => {
  try {
    await test.body(url, key)
  } catch (e) {
    return {
      status: 'failed',
      message: (e as Error).message,
    }
  }

  return {
    status: 'passed',
  }
}
