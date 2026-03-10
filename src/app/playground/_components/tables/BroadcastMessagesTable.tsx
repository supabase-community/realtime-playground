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
import type { BroadcastMessage } from '@/types/realtime'

interface Props {
  messages: BroadcastMessage[]
  onClear: () => void
}

export function BroadcastMessagesTable({ messages, onClear }: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Broadcast Messages</CardTitle>
          <div className="flex items-center gap-2">
            {messages.length > 0 && <Badge variant="secondary">{messages.length}</Badge>}
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs"
              onClick={onClear}
              disabled={messages.length === 0}
            >
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {messages.length === 0 ? (
          <p className="text-muted-foreground py-4 text-center text-xs">
            No broadcast messages yet
          </p>
        ) : (
          <div className="max-h-96 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20 text-xs">Time</TableHead>
                  <TableHead className="w-28 text-xs">Channel</TableHead>
                  <TableHead className="w-28 text-xs">Event</TableHead>
                  <TableHead className="text-xs">Payload</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((msg, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="text-muted-foreground align-top text-xs whitespace-nowrap tabular-nums">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </TableCell>
                    <TableCell className="max-w-28 truncate align-top text-xs">
                      {msg.channel}
                    </TableCell>
                    <TableCell className="align-top text-xs">
                      <Badge variant="outline" className="font-mono text-xs">
                        {msg.event}
                      </Badge>
                    </TableCell>
                    <TableCell className="align-top text-xs">
                      <pre className="text-muted-foreground overflow-x-auto">
                        {JSON.stringify(msg.payload, null, 2)}
                      </pre>
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
