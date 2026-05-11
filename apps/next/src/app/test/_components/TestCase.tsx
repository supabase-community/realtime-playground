import { useEnv } from '@realtime-playground/realtime-core'
import { runTest, type Test, type TestData } from '@realtime-playground/tests'
import { ChevronsUpDown } from 'lucide-react'
import { type ForwardedRef, forwardRef, useCallback, useImperativeHandle, useState } from 'react'
import { buttonVariants } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { RunButton, type Status, StatusBadge, type TestCaseHandle } from './helpers'

type RenderTestDataProps = {
  data: TestData
  status: Status
}

const metricColor = (value: number, unit: string) => {
  if (unit === '%') {
    if (value >= 99) return 'bg-green-500/15 text-green-700'
    if (value >= 95) return 'bg-yellow-500/15 text-yellow-700'
    return 'bg-red-500/15 text-red-700'
  }
  if (unit === 'ms') {
    if (value <= 100) return 'bg-green-500/15 text-green-700'
    if (value <= 500) return 'bg-yellow-500/15 text-yellow-700'
    return 'bg-red-500/15 text-red-700'
  }
  return ''
}

const MetricValue = ({ value, unit }: { value: number; unit: string }) => (
  <span
    className={cn('inline-block rounded px-1.5 py-0.5 font-semibold', metricColor(value, unit))}
  >
    {value.toFixed(2)}
    <span className="ml-0.5 font-normal opacity-70">{unit}</span>
  </span>
)

const RenderTestData = ({ data, status }: RenderTestDataProps) => {
  if (data.type === 'normal')
    return (
      <div className="mt-1 flex flex-col gap-1">
        <span
          className={cn(
            'rounded px-2 py-1 font-mono text-xs break-all',
            status === 'Passed'
              ? 'text-primary bg-primary/10'
              : 'text-destructive bg-destructive/10',
          )}
        >
          {data.message}
        </span>
        {data.stack && status !== 'Passed' && (
          <pre className="text-muted-foreground bg-muted max-h-64 overflow-y-auto rounded px-2 py-1 font-mono text-xs whitespace-pre-wrap break-words">
            {data.stack.startsWith(data.message)
              ? data.stack.slice(data.message.length).trimStart()
              : data.stack}
          </pre>
        )}
      </div>
    )
  if (data.type === 'load')
    return (
      <Table className="bg-muted/50 mt-1 w-auto rounded border">
        <TableHeader>
          <TableRow>
            {data.metrics.map((m) => (
              <TableHead key={m.label}>{m.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            {data.metrics.map((m) => (
              <TableCell key={m.label} className="font-mono text-xs">
                <MetricValue value={m.value} unit={m.unit} />
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    )
  return null
}

type TestCaseProps = {
  test: Test
  onStatusChange?: (status: Status) => void
}

const TestCase = forwardRef(
  ({ test, onStatusChange }: TestCaseProps, ref: ForwardedRef<TestCaseHandle>) => {
    const [status, setStatus] = useState<Status>(null)
    const [data, setData] = useState<TestData | undefined>()
    const [open, setOpen] = useState(true)
    const { supabaseUrl, supabaseKey, testUserEmail, testUserPassword } = useEnv()

    const prepare = useCallback(() => {
      setStatus('Running')
      onStatusChange?.('Running')
      setData(undefined)
    }, [onStatusChange])

    const handleRun = useCallback(async () => {
      const res = await runTest(test, supabaseUrl, supabaseKey, testUserEmail, testUserPassword)
      setData(res.data)
      const newStatus = res.status === 'passed' ? 'Passed' : 'Failed'
      setStatus(newStatus)
      onStatusChange?.(newStatus)
    }, [test, supabaseUrl, supabaseKey, testUserEmail, testUserPassword, onStatusChange])

    const handleClick = useCallback(async () => {
      prepare()
      await handleRun()
    }, [handleRun, prepare])

    useImperativeHandle(ref, () => ({
      handleRun,
      prepare,
      getResult: () => ({
        name: test.name,
        status,
        error: status === 'Failed' && data?.type === 'normal' ? data.message : undefined,
        stack: status === 'Failed' && data?.type === 'normal' ? data.stack : undefined,
      }),
    }))

    return (
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="border-border flex flex-col gap-1 border-b py-2 last:border-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-foreground font-mono text-xs">{test.name}</span>
            <div className="flex items-center gap-4">
              {data && (
                <CollapsibleTrigger
                  className={cn(
                    'flex items-center gap-1 transition-opacity hover:opacity-70',
                    buttonVariants({ variant: 'ghost', size: 'icon-sm' }),
                  )}
                >
                  <ChevronsUpDown className="text-muted-foreground size-3" />
                </CollapsibleTrigger>
              )}
              <StatusBadge status={status} />
              <RunButton status={status} onClick={handleClick} />
            </div>
          </div>
          <CollapsibleContent>
            {data && <RenderTestData data={data} status={status} />}
          </CollapsibleContent>
        </div>
      </Collapsible>
    )
  },
)
TestCase.displayName = 'TestCase'

export default TestCase
