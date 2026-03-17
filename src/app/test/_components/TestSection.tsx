import { Test } from '@/lib/test'
import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react'
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

  const prepare = useCallback(() => {
    setStatus('Running')
    for (const c of testCasesRefs.current) {
      c?.prepare()
    }
  }, [])

  const runAllTests = async () => {
    prepare()
    let res: 'Passed' | 'Failed' = 'Passed'
    for (const testCase of testCasesRefs.current) {
      if (testCase) {
        if ((await testCase.handleRun()) === 'Failed') {
          res = 'Failed'
        }
      }
    }
    setStatus(res)
    return res
  }

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
              {tests.map((t, i) => (
                <TestCase
                  key={t.name}
                  test={t}
                  ref={(el) => {
                    testCasesRefs.current[i] = el as TestCaseHandle
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
