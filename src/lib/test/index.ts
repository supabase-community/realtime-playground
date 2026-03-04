import assert from "assert";

export type Test = {
  name: string,
  body: () => Promise<void>
};

export type TestSuite = {
  [name: string]: Test[]
};

export const testCases: TestSuite = {
  "add": [
    {
      name: "should add 1 + 1",
      body: async () => {
        assert.equal(1 + 1, 2)
      },
    },
    {
      name: "should add 2 + 1",
      body: async () => {
        assert.equal(2 + 1, 4)
      },
    },
  ],
  "subtract": [
    {
      name: "should subtract 1 - 1",
      body: async () => {
        assert.equal(1 - 1, 0)
      },
    },
    {
      name: "should add 2 - 1",
      body: async () => {
        assert.equal(2 - 1, 2)
      },
    },
  ],
}

export type TestResult = {
  status: 'passed'
} | {
  status: 'failed',
  message: string
}

export const runTest = async (test: Test): Promise<TestResult> => {
  try {
    await test.body()
  } catch (e) {
    if (e instanceof assert.AssertionError) {
      return {
        status: 'failed',
        message: e.message
      }
    }
    throw e
  }

  return {
    status: 'passed'
  }
}
