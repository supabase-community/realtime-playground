import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { runTest, Test } from '@/lib/test'
import { ChevronsUpDown, Rocket } from 'lucide-react'
import { useCallback, forwardRef, useImperativeHandle, useState } from 'react'
import { Status, statusVariant } from './helpers'
import { useTestSettings } from '@/hooks/useTestSettings'
import { cn } from '@/lib/utils'

const statusBadge = (status: Status) => {
  return <Badge variant={statusVariant(status)}>{status}</Badge>
}

type TestCaseProps = {
  test: Test
}

const TestCase = forwardRef(({ test }: TestCaseProps, ref) => {
  const [status, setStatus] = useState<Status>(null)
  const [message, setMessage] = useState<string>('')
  const [open, setOpen] = useState(true)
  const { supabaseUrl, supabaseKey } = useTestSettings()

  const prepare = useCallback(() => {
    setStatus('Running')
    setMessage('')
  }, [])

  const handleRun = useCallback(async () => {
    prepare()
    const res = await runTest(test, supabaseUrl, supabaseKey)
    setMessage(res.message || '')
    if (res.status === 'passed') {
      setStatus('Passed')
      return 'Passed'
    } else {
      setStatus('Failed')
      return 'Failed'
    }
  }, [test, supabaseUrl, supabaseKey, prepare])

  useImperativeHandle(ref, () => ({
    handleRun,
    prepare,
  }))

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="border-border flex flex-col gap-1 border-b py-2 last:border-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-foreground font-mono text-xs">{test.name}</span>
          <div className="flex items-center gap-4">
            {message && (
              <CollapsibleTrigger className="flex items-center gap-1 transition-opacity hover:opacity-70">
                <ChevronsUpDown className="text-muted-foreground size-3" />
              </CollapsibleTrigger>
            )}
            {status && statusBadge(status)}
            {(!status || status === 'Failed') && (
              <Button variant="ghost" size="icon-sm" onClick={handleRun}>
                <Rocket />
              </Button>
            )}
          </div>
        </div>
        <CollapsibleContent>
          {message && (
            <pre
              className={cn(
                'mt-1 rounded px-2 py-1 font-mono text-xs break-all',
                status === 'Passed'
                  ? 'text-primary bg-primary/10'
                  : 'text-destructive bg-destructive/10',
              )}
            >
              {message}
            </pre>
          )}
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
})
TestCase.displayName = 'TestCase'

export default TestCase
