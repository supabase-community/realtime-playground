export type TestCaseHandle = {
  handleRun: () => Promise<'Passed' | 'Failed'>
  prepare: () => void
}

export type Status = 'Running' | 'Passed' | 'Failed' | null

export const statusVariant = (status: Status) => {
  if (status == 'Running') return 'outline'
  if (status == 'Failed') return 'destructive'
  if (status == 'Passed') return 'default'
}
