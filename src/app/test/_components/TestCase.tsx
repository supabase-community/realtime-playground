import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { runTest, Test, TestData } from '@/lib/test'
import { ChevronsUpDown, Rocket } from 'lucide-react'
import { useCallback, forwardRef, useImperativeHandle, useState } from 'react'
import { Status, statusVariant } from './helpers'
import { useTestSettings } from '@/hooks/useTestSettings'
import { cn } from '@/lib/utils'

const statusBadge = (status: Status) => {
  return <Badge variant={statusVariant(status)}>{status}</Badge>
}

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
      <span
        className={cn(
          'mt-1 rounded px-2 py-1 font-mono text-xs break-all',
          status === 'Passed' ? 'text-primary bg-primary/10' : 'text-destructive bg-destructive/10',
        )}
      >
        {data.message}
      </span>
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

const TestCase = forwardRef(({ test, onStatusChange }: TestCaseProps, ref) => {
  const [status, setStatus] = useState<Status>(null)
  const [data, setData] = useState<TestData | undefined>()
  const [open, setOpen] = useState(true)
  const { supabaseUrl, supabaseKey } = useTestSettings()

  const prepare = useCallback(() => {
    setStatus('Running')
    onStatusChange?.('Running')
    setData(undefined)
  }, [onStatusChange])

  const handleRun = useCallback(async () => {
    prepare()
    const res = await runTest(test, supabaseUrl, supabaseKey)
    setData(res.data)
    const newStatus = res.status === 'passed' ? 'Passed' : 'Failed'
    setStatus(newStatus)
    onStatusChange?.(newStatus)
    return newStatus
  }, [test, supabaseUrl, supabaseKey, prepare, onStatusChange])

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
            {data && (
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
          {data && <RenderTestData data={data} status={status} />}
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
})
TestCase.displayName = 'TestCase'

export default TestCase
