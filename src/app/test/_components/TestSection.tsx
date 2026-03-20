import { Test } from '@/lib/test'
import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react'
import { statusVariant, type Status, type TestCaseHandle } from './helpers'
import { Collapsible, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import TestCase from './TestCase'

type TestSectionProps = {
  name: string
  tests: Test[]
  onStatusChange?: (status: Status) => void
}

const TestSection = forwardRef(({ name, tests, onStatusChange }: TestSectionProps, ref) => {
  const [open, setOpen] = useState(true)
  const [status, setStatus] = useState<Status>(null)
  const testCasesRefs = useRef<(TestCaseHandle | null)[]>([])
  const childStatuses = useRef<Status[]>(tests.map(() => null))

  const computeSectionStatus = useCallback((): Status => {
    const statuses = childStatuses.current
    if (statuses.some((s) => s === 'Failed')) return 'Failed'
    if (statuses.every((s) => s === 'Passed')) return 'Passed'
    if (statuses.some((s) => s === 'Running')) return 'Running'
    return null
  }, [])

  const handleChildStatusChange = useCallback(
    (index: number) => (childStatus: Status) => {
      childStatuses.current[index] = childStatus
      const newStatus = computeSectionStatus()
      setStatus(newStatus)
      onStatusChange?.(newStatus)
    },
    [computeSectionStatus, onStatusChange],
  )

  const prepare = useCallback(() => {
    setStatus('Running')
    onStatusChange?.('Running')
    childStatuses.current = tests.map(() => null)
    for (let i = 0; i < testCasesRefs.current.length; i++) {
      testCasesRefs.current[i]?.prepare()
    }
  }, [onStatusChange, tests])

  const runAllTests = useCallback(async () => {
    for (let i = 0; i < testCasesRefs.current.length; i++) {
      const testCase = testCasesRefs.current[i]
      if (testCase) {
        await testCase.handleRun()
      }
    }
    const finalStatus = computeSectionStatus()
    setStatus(finalStatus)
    onStatusChange?.(finalStatus)
  }, [onStatusChange, computeSectionStatus])

  const handleClick = useCallback(() => {
    prepare()
    runAllTests()
  }, [prepare, runAllTests])

  useImperativeHandle(ref, () => ({
    handleRun: runAllTests,
    prepare,
  }))

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card>
        <CardHeader className="flex justify-between pb-2">
          <CollapsibleTrigger className="flex w-full items-center gap-2 text-left">
            <ChevronsUpDown className="text-muted-foreground size-4 shrink-0" />
            <CardTitle className="text-base">{name}</CardTitle>
          </CollapsibleTrigger>
          <Button
            disabled={status === 'Running'}
            variant={statusVariant(status)}
            size="sm"
            onClick={handleClick}
          >
            {status || 'Run'}
          </Button>
        </CardHeader>
        <CardContent className={open ? undefined : 'hidden'}>
          <div>
            {tests.map((t, i) => (
              <TestCase
                key={t.name}
                test={t}
                onStatusChange={handleChildStatusChange(i)}
                ref={(el) => {
                  testCasesRefs.current[i] = el as TestCaseHandle
                }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </Collapsible>
  )
})
TestSection.displayName = 'TestSection'

export default TestSection
