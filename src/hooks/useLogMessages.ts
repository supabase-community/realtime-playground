import { useCallback, useState } from 'react'
import type { LogEntry } from '@/types/realtime'

export function useLogMessages() {
  const [logs, setLogs] = useState<LogEntry[]>([])

  const addLog = useCallback((kind: string, message: string, data: unknown) => {
    setLogs((prev) => [
      ...prev,
      {
        timestamp: new Date().toISOString(),
        kind,
        message,
        data:
          data !== null && typeof data === 'object' ? (data as Record<string, unknown>) : undefined,
      },
    ])
  }, [])

  const clear = () => setLogs([])

  return { logs, addLog, clear }
}
