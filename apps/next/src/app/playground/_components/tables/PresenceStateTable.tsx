import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { PresenceByChannel } from '@/types/realtime'

interface Props {
  presenceState: PresenceByChannel
  onClear: () => void
}

export function PresenceStateTable({ presenceState, onClear }: Props) {
  const channelCount = Object.keys(presenceState).length
  const totalUsers = Object.values(presenceState).reduce(
    (acc, state) => acc + Object.keys(state).length,
    0,
  )

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Presence State</CardTitle>
          <div className="flex items-center gap-2">
            {totalUsers > 0 && <Badge variant="secondary">{totalUsers} online</Badge>}
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs"
              onClick={onClear}
              disabled={channelCount === 0}
            >
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {channelCount === 0 ? (
          <p className="text-muted-foreground py-4 text-center text-xs">No presence data yet</p>
        ) : (
          <div className="max-h-96 space-y-3 overflow-y-auto">
            {Object.entries(presenceState).map(([channelName, state]) => {
              const userCount = Object.keys(state).length
              return (
                <div key={channelName} className="rounded-md border p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-xs font-semibold">{channelName}</h3>
                    <Badge variant="outline" className="border-green-600/40 text-xs text-green-400">
                      {userCount} {userCount === 1 ? 'user' : 'users'}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(state).map(([key, presences]) => (
                      <div key={key} className="bg-muted/50 rounded border p-2">
                        <p className="text-muted-foreground mb-1 font-mono text-xs">
                          key: <span className="text-foreground font-semibold">{key}</span>
                          {Array.isArray(presences) && presences.length > 1 && (
                            <Badge variant="secondary" className="ml-2 h-4 text-xs">
                              {presences.length}
                            </Badge>
                          )}
                        </p>
                        {Array.isArray(presences) &&
                          presences.map((presence, i) => (
                            <pre key={i} className="text-muted-foreground overflow-x-auto text-xs">
                              {JSON.stringify(presence, null, 2)}
                            </pre>
                          ))}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
