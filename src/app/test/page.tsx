'use client'

import { testCases } from '@/lib/test'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Status, statusVariant, type TestCaseHandle } from './_components/helpers'
import TestSection from './_components/TestSection'
import { TestSettingsProvider } from '@/hooks/useTestSettings'
import TestSettingsModal from './_components/TestSettingsModal'

export default function TestsPage() {
  const [status, setStatus] = useState<Status>(null)
  const testSuitesRefs = useRef<(TestCaseHandle | null)[]>([])

  const runAllTests = async () => {
    setStatus('Running')
    const res = await Promise.all(
      testSuitesRefs.current.filter((e) => !!e).map((e) => e.handleRun()),
    )
    if (res.every((e) => e === 'Passed')) {
      setStatus('Passed')
    } else {
      setStatus('Failed')
    }
  }

  return (
    <TestSettingsProvider>
      <div className="min-h-screen p-4 font-mono text-sm">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Test Runner</h1>
            <div className="flex items-center gap-2">
              <TestSettingsModal />
              <Button
                disabled={!!status}
                variant={statusVariant(status)}
                size="sm"
                onClick={runAllTests}
              >
                {status || 'Run'}
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            {Object.entries(testCases).map(([k, v]) => (
              <TestSection
                key={k}
                name={k}
                tests={v}
                ref={(el) => {
                  testSuitesRefs.current.push(el as TestCaseHandle)
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </TestSettingsProvider>
  )
}
