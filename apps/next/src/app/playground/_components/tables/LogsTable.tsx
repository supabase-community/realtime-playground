import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { LogEntry } from '@/types/realtime'

interface Props {
  logs: LogEntry[]
  onClear: () => void
}

export function LogsTable({ logs, onClear }: Props) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Socket Logs</CardTitle>
          <div className="flex items-center gap-2">
            {logs.length > 0 && <Badge variant="secondary">{logs.length}</Badge>}
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs"
              onClick={onClear}
              disabled={logs.length === 0}
            >
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <p className="text-muted-foreground py-4 text-center text-xs">No logs yet</p>
        ) : (
          <ul className="max-h-96 space-y-2 overflow-auto">
            {logs.map((log, idx) => (
              <li key={idx} className="border-border space-y-1 rounded-md border px-3 py-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground whitespace-nowrap tabular-nums">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <Badge variant="outline" className="font-mono text-xs">
                    {log.kind}
                  </Badge>
                  <span className="text-muted-foreground break-all">{log.message}</span>
                </div>
                {log.data !== undefined && (
                  <pre className="text-muted-foreground break-all whitespace-pre-wrap">
                    {JSON.stringify(log.data, null, 2)}
                  </pre>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
