import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import BroadcastSendForm from "@/components/forms/BroadcastSendForm";
import type { BroadcastMessage } from "@/types/realtime";

interface Props {
  messages: BroadcastMessage[];
  onClear: () => void;
}

export function BroadcastMessagesTable({ messages, onClear }: Props) {
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Broadcast Messages</CardTitle>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <Badge variant="secondary">{messages.length}</Badge>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="text-xs h-7"
              onClick={onClear}
              disabled={messages.length === 0}
            >
              Clear
            </Button>
          </div>
        </div>
        <BroadcastSendForm />
      </CardHeader>
      <CardContent className="space-y-3">
        {messages.length === 0 ? (
          <p className="text-muted-foreground text-center py-4 text-xs">
            No broadcast messages yet
          </p>
        ) : (
          <div className="overflow-auto max-h-96">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs w-20">Time</TableHead>
                  <TableHead className="text-xs w-28">Channel</TableHead>
                  <TableHead className="text-xs w-28">Event</TableHead>
                  <TableHead className="text-xs">Payload</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((msg, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="text-xs whitespace-nowrap align-top tabular-nums text-muted-foreground">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </TableCell>
                    <TableCell className="text-xs align-top max-w-28 truncate">
                      {msg.channel}
                    </TableCell>
                    <TableCell className="text-xs align-top">
                      <Badge variant="outline" className="text-xs font-mono">
                        {msg.event}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs align-top">
                      <pre className="overflow-x-auto text-muted-foreground">
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
  );
}
