import { Rocket, RotateCcw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export type TestCaseResult = {
  name: string
  status: Status
  error?: string
}

export type TestCaseHandle = {
  handleRun: () => Promise<void>
  prepare: () => void
  getResult: () => TestCaseResult
}

export type Status = 'Running' | 'Passed' | 'Failed' | null

export const statusVariant = (status: Status) => {
  if (status === 'Running') return 'outline'
  if (status === 'Failed') return 'destructive'
  if (status === 'Passed') return 'default'
}

export type StatusBadgeProps = {
  status: Status
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  if (!status) return null
  return <Badge variant={statusVariant(status)}>{status}</Badge>
}

export type RunButtonProps = {
  status: Status
  onClick: () => void
  disabled?: boolean
}

export const RunButton = ({ status, onClick, disabled }: RunButtonProps) => {
  if (status === 'Running') return null
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon-sm" onClick={onClick} disabled={disabled}>
            {!status ? <Rocket /> : <RotateCcw />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{!status ? 'Run' : 'Rerun'}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
