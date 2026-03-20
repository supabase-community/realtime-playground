'use client'

import { testCases } from '@/lib/test'
import { useCallback, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Status, statusVariant, type TestCaseHandle } from './_components/helpers'
import TestSection from './_components/TestSection'
import { TestSettingsProvider } from '@/hooks/useTestSettings'
import TestSettingsModal from './_components/TestSettingsModal'

export default function TestsPage() {
  const [status, setStatus] = useState<Status>(null)
  const testSuitesRefs = useRef<(TestCaseHandle | null)[]>([])
  const sectionCount = Object.keys(testCases).length
  const childStatuses = useRef<Status[]>(Array.from({ length: sectionCount }, () => null))

  const computePageStatus = useCallback((): Status => {
    const statuses = childStatuses.current
    if (statuses.some((s) => s === 'Failed')) return 'Failed'
    if (statuses.every((s) => s === 'Passed')) return 'Passed'
    if (statuses.some((s) => s === 'Running')) return 'Running'
    return null
  }, [])

  const handleSectionStatusChange = useCallback(
    (index: number) => (sectionStatus: Status) => {
      childStatuses.current[index] = sectionStatus
      setStatus(computePageStatus())
    },
    [computePageStatus],
  )

  const prepare = useCallback(() => {
    setStatus('Running')
    childStatuses.current = Array.from({ length: sectionCount }, () => null)
    for (let i = 0; i < testSuitesRefs.current.length; i++) {
      testSuitesRefs.current[i]?.prepare()
    }
  }, [sectionCount])

  const handleClick = useCallback(async () => {
    prepare()
    for (let i = 0; i < testSuitesRefs.current.length; i++) {
      const testCase = testSuitesRefs.current[i]
      if (testCase) {
        await testCase.handleRun()
      }
    }
    setStatus(computePageStatus())
  }, [prepare, computePageStatus])

  return (
    <TestSettingsProvider>
      <div className="mx-auto flex h-full max-w-7xl flex-col overflow-y-hidden p-2 font-mono text-sm">
        <div className="flex h-16 items-center justify-between pb-4">
          <h1 className="text-2xl font-bold">Test Runner</h1>
          <div className="flex items-center gap-2">
            <TestSettingsModal />
            <Button
              disabled={status === 'Running'}
              variant={statusVariant(status)}
              size="sm"
              onClick={handleClick}
            >
              {status || 'Run'}
            </Button>
          </div>
        </div>
        <div className="h-[calc(100%-2rem)] space-y-4 overflow-y-auto">
          {Object.entries(testCases).map(([k, v], i) => (
            <TestSection
              key={k}
              name={k}
              tests={v}
              onStatusChange={handleSectionStatusChange(i)}
              ref={(el) => {
                testSuitesRefs.current[i] = el as TestCaseHandle
              }}
            />
          ))}
        </div>
      </div>
    </TestSettingsProvider>
  )
}
