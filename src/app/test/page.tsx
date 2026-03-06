'use client'

import { runTest, Test, testCases } from '@/lib/test'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronsUpDown, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_KEY,
} from "@/lib/constants";

export default function TestsPage() {
  const [state, setState] = useState('Run')
  const testSuitesRefs = useRef<(TestCaseHandle | null)[]>([])

  const runAllTests = async () => {
    setState('Loading')
    await Promise.all(testSuitesRefs.current.filter((e) => !!e).map((e) => e.handleRun()))
    setState('Done')
  }

  return (
    <div className="min-h-screen p-4 font-mono text-sm">
      <div className="mx-auto max-w-7xl">
        <div className="flex justify-between">
          <h1 className="mb-6 text-2xl font-bold">Test Runner</h1>
          <Button disabled={state != 'Run'} size="sm" onClick={runAllTests}>
            {state}
          </Button>
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
  )
}

type TestCaseProps = {
  test: Test
}

type TestCaseHandle = {
  handleRun: () => Promise<void>
}

type Status = 'running' | 'passed' | 'failed' | null

const statusBadge = (status: Status) => {
  if (!status) return <></>
  if (status === 'passed')
    return (
      <Badge className="border border-green-600/40 bg-green-950/60 text-green-400 hover:bg-green-950/60">
        passed
      </Badge>
    )
  if (status === 'failed') return <Badge variant="destructive">failed</Badge>
  return <Badge variant="secondary">running…</Badge>
}

const TestCase = forwardRef(({ test }: TestCaseProps, ref) => {
  const [status, setStatus] = useState<Status>(null)
  const [message, setMessage] = useState<string>('')
  const [open, setOpen] = useState(true)

  const handleRun = async () => {
    setStatus('running')
    setMessage('')
    const res = await runTest(test, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_KEY)
    if (res.status == 'passed') {
      setStatus('passed')
    } else {
      setStatus('failed')
      setMessage(res.message)
    }
  }

  useImperativeHandle(ref, () => ({
    handleRun: () => handleRun(),
  }))

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="border-border flex flex-col gap-1 border-b py-2 last:border-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-foreground font-mono text-xs">{test.name}</span>
          <div className="flex gap-4 items-center">
            {message && (
              <CollapsibleTrigger className="flex items-center gap-1 transition-opacity hover:opacity-70">
                <ChevronsUpDown className="text-muted-foreground size-3" />
              </CollapsibleTrigger>
            )}
            {statusBadge(status)}
            {!(status && ['passed', 'running'].includes(status)) && (
              <Button variant="ghost" size="icon-sm" onClick={handleRun}>
                <Rocket />
              </Button>
            )}
          </div>
        </div>
        <CollapsibleContent>
          {message && (
            <p className="text-destructive bg-destructive/10 mt-1 rounded px-2 py-1 font-mono text-xs break-all">
              {message}
            </p>
          )}
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
})
TestCase.displayName = 'TestCase'

type TestSectionProps = {
  name: string
  tests: Test[]
}

const TestSection = forwardRef(({ name, tests }: TestSectionProps, ref) => {
  const [open, setOpen] = useState(true)
  const [state, setState] = useState('Run')
  const testCasesRefs = useRef<(TestCaseHandle | null)[]>([])

  const runAllTests = async () => {
    setState('Loading')
    await Promise.all(testCasesRefs.current.filter((e) => !!e).map((e) => e.handleRun()))
    setState('Done')
  }

  useImperativeHandle(ref, () => ({
    handleRun: async () => {
      await runAllTests()
    },
  }))

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card>
        <CardHeader className="flex justify-between pb-2">
          <CollapsibleTrigger className="flex w-full items-center gap-2 text-left">
            <ChevronsUpDown className="text-muted-foreground size-4 shrink-0" />
            <CardTitle className="text-base">{name}</CardTitle>
          </CollapsibleTrigger>
          <Button disabled={state != 'Run'} size="sm" onClick={runAllTests}>
            {state}
          </Button>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            <div>
              {tests.map((t) => (
                <TestCase
                  key={t.name}
                  test={t}
                  ref={(el) => {
                    testCasesRefs.current.push(el as TestCaseHandle)
                  }}
                />
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
})
TestSection.displayName = 'TestSection'
