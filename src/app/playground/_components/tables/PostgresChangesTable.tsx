import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { PostgresChange } from '@/types/realtime'

interface Props {
  changes: PostgresChange[]
  onClear: () => void
}

function EventBadge({ eventType }: { eventType: string }) {
  const styles: Record<string, string> = {
    INSERT: 'border-green-600/40 text-green-400 bg-green-950/30',
    UPDATE: 'border-yellow-600/40 text-yellow-400 bg-yellow-950/30',
    DELETE: 'border-red-600/40 text-red-400 bg-red-950/30',
  }
  return (
    <Badge variant="outline" className={`font-mono text-xs ${styles[eventType] ?? ''}`}>
      {eventType}
    </Badge>
  )
}

function ChangeData({ change }: { change: PostgresChange }) {
  if (change.eventType === 'INSERT') {
    return (
      <pre className="overflow-x-auto text-xs text-green-400/80">
        {JSON.stringify(change.new, null, 2)}
      </pre>
    )
  }

  if (change.eventType === 'DELETE') {
    return (
      <pre className="overflow-x-auto text-xs text-red-400/80">
        {JSON.stringify(change.old, null, 2)}
      </pre>
    )
  }

  if (change.eventType === 'UPDATE') {
    return (
      <div className="space-y-1">
        <div>
          <span className="text-xs font-semibold text-red-400/60">before</span>
          <pre className="overflow-x-auto text-xs text-red-400/60">
            {JSON.stringify(change.old, null, 2)}
          </pre>
        </div>
        <div>
          <span className="text-xs font-semibold text-green-400">after</span>
          <pre className="overflow-x-auto text-xs text-green-400/80">
            {JSON.stringify(change.new, null, 2)}
          </pre>
        </div>
      </div>
    )
  }

  return (
    <pre className="text-muted-foreground overflow-x-auto text-xs">
      {JSON.stringify(change, null, 2)}
    </pre>
  )
}

export function PostgresChangesTable({ changes, onClear }: Props) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Postgres Changes</CardTitle>
          <div className="flex items-center gap-2">
            {changes.length > 0 && <Badge variant="secondary">{changes.length}</Badge>}
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs"
              onClick={onClear}
              disabled={changes.length === 0}
            >
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {changes.length === 0 ? (
          <p className="text-muted-foreground py-4 text-center text-xs">No postgres changes yet</p>
        ) : (
          <div className="max-h-96 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20 text-xs">Time</TableHead>
                  <TableHead className="w-28 text-xs">Channel</TableHead>
                  <TableHead className="w-24 text-xs">Event</TableHead>
                  <TableHead className="w-32 text-xs">Table</TableHead>
                  <TableHead className="text-xs">Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {changes.map((change, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="text-muted-foreground align-top text-xs whitespace-nowrap tabular-nums">
                      {new Date(change.timestamp).toLocaleTimeString()}
                    </TableCell>
                    <TableCell className="max-w-28 truncate align-top text-xs">
                      {change.channel}
                    </TableCell>
                    <TableCell className="align-top text-xs">
                      <EventBadge eventType={change.eventType} />
                    </TableCell>
                    <TableCell className="text-muted-foreground align-top font-mono text-xs">
                      {change.schema}.{change.table}
                    </TableCell>
                    <TableCell className="align-top text-xs">
                      <ChangeData change={change} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
