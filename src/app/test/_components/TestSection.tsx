import { Test } from '@/lib/test'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { statusVariant, type Status, type TestCaseHandle } from './helpers'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import TestCase from './TestCase'

type TestSectionProps = {
  name: string
  tests: Test[]
}

const TestSection = forwardRef(({ name, tests }: TestSectionProps, ref) => {
  const [open, setOpen] = useState(true)
  const [status, setStatus] = useState<Status>(null)
  const testCasesRefs = useRef<(TestCaseHandle | null)[]>([])

  const runAllTests = async () => {
    setStatus('Running')
    // Copy all values so tests do not rerun indefinetly
    const cases = [...testCasesRefs.current]
    let failed = false
    for (let testCase of cases) {
      if (testCase) {
        if ((await testCase.handleRun()) == 'Failed') {
          failed = true
        }
      }
    }
    const res = failed ? 'Failed' : 'Passed'
    setStatus(res)
    return res
  }

  useImperativeHandle(ref, () => ({
    handleRun: runAllTests,
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
            disabled={!!status}
            variant={statusVariant(status)}
            size="sm"
            onClick={runAllTests}
          >
            {status || 'Run'}
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

export default TestSection
