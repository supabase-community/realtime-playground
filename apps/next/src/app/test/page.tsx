'use client'

import { useEnv } from '@realtime-playground/realtime-core'
import { testCases } from '@realtime-playground/tests'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import SettingsModal from '@/components/SettingsModal'
import { RunButton, type Status, StatusBadge, type TestCaseHandle } from './_components/helpers'
import TestSection from './_components/TestSection'

type CiResult = { status: 200 } | { status: 400; failed: { name: string; error?: string }[] }

export default function TestsPage() {
  const [status, setStatus] = useState<Status>(null)
  const [ciResult, setCiResult] = useState<CiResult | null>(null)
  const { supabaseUrl, supabaseKey } = useEnv()
  const configured = Boolean(supabaseUrl && supabaseKey)
  const params = useSearchParams()
  const autorun = params.get('autorun') === 'true'
  const jsonMode = params.get('result') === 'json'
  const hasAutoRun = useRef(false)

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
    setCiResult(null)
    childStatuses.current = Array.from({ length: sectionCount }, () => null)
    for (let i = 0; i < testSuitesRefs.current.length; i++) {
      testSuitesRefs.current[i]?.prepare()
    }
  }, [sectionCount])

  const handleClick = useCallback(async () => {
    prepare()
    for (let i = 0; i < testSuitesRefs.current.length; i++) {
      const testCase = testSuitesRefs.current[i]
      if (testCase) await testCase.handleRun()
    }
    const finalStatus = computePageStatus()
    setStatus(finalStatus)

    const allResults = testSuitesRefs.current.flatMap((r) => (r ? r.getResult() : []))
    const failed = allResults
      .filter((r) => r.status === 'Failed')
      .map(({ name, error }) => ({ name, error }))

    setCiResult(failed.length === 0 ? { status: 200 } : { status: 400, failed })
  }, [prepare, computePageStatus])

  useEffect(() => {
    if (autorun && configured && !hasAutoRun.current) {
      hasAutoRun.current = true
      handleClick()
    }
  }, [autorun, configured, handleClick])

  const sections = Object.entries(testCases).map(([k, v], i) => (
    <TestSection
      key={k}
      name={k}
      tests={v}
      onStatusChange={handleSectionStatusChange(i)}
      ref={(el) => {
        testSuitesRefs.current[i] = el as TestCaseHandle
      }}
    />
  ))

  if (jsonMode) {
    return (
      <>
        <div style={{ display: 'none' }}>{sections}</div>
        {ciResult && <pre>{JSON.stringify(ciResult, null, 2)}</pre>}
      </>
    )
  }

  return (
    <div className="mx-auto flex h-full max-w-7xl flex-col overflow-y-hidden p-2 font-mono text-sm">
      <div className="flex h-16 items-center justify-between pb-4">
        <h1 className="text-2xl font-bold">Test Runner</h1>
        <div className="flex items-center gap-2">
          {!configured && (
            <span className="text-muted-foreground text-xs">Configure your project in</span>
          )}
          <SettingsModal />
          <RunButton status={status} onClick={handleClick} disabled={!configured} />
          <StatusBadge status={status} />
        </div>
      </div>

      <div className="h-[calc(100%-2rem)] space-y-4 overflow-y-auto">{sections}</div>

      {/* CI automation result — poll this element for test outcome */}
      <div
        id="ci-result"
        aria-hidden="true"
        style={{ display: 'none' }}
        data-status={ciResult?.status ?? 'pending'}
        data-result={ciResult ? JSON.stringify(ciResult) : undefined}
      />
    </div>
  )
}
