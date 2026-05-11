import { runTest, testCases } from '@realtime-playground/tests'
import { type NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const url = searchParams.get('url')
  const key = searchParams.get('key')
  const email = searchParams.get('email') ?? ''
  const password = searchParams.get('password') ?? ''

  if (!url || !key) {
    return NextResponse.json({ error: 'url and key are required' }, { status: 400 })
  }

  const failed: { name: string; error?: string; stack?: string }[] = []

  for (const tests of Object.values(testCases)) {
    for (const test of tests) {
      const result = await runTest(test, url, key, email, password)
      if (result.status === 'failed') {
        const data = result.data?.type === 'normal' ? result.data : undefined
        failed.push({
          name: test.name,
          error: data?.message,
          stack: data?.stack,
        })
      }
    }
  }

  if (failed.length === 0) {
    return NextResponse.json({ status: 200 })
  }

  return NextResponse.json({ status: 400, failed }, { status: 400 })
}
