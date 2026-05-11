import { runTest, testCases } from '@realtime-playground/tests'
import TestsPageClient from './_components/TestsPageClient'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{
    ci?: string
    url?: string
    key?: string
    email?: string
    password?: string
  }>
}

export default async function TestsPage({ searchParams }: Props) {
  const params = await searchParams

  if (params.ci === 'true') {
    const { url, key, email = '', password = '' } = params

    if (!url || !key) {
      return <pre>{JSON.stringify({ error: 'url and key are required' }, null, 2)}</pre>
    }

    const failed: { name: string; error?: string }[] = []
    for (const tests of Object.values(testCases)) {
      for (const test of tests) {
        const result = await runTest(test, url, key, email, password)
        if (result.status === 'failed') {
          failed.push({
            name: test.name,
            error: result.data?.type === 'normal' ? result.data.message : undefined,
          })
        }
      }
    }

    const result = failed.length === 0 ? { status: 200 } : { status: 400, failed }
    return <pre>{JSON.stringify(result, null, 2)}</pre>
  }

  return <TestsPageClient />
}
