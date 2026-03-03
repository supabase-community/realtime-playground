"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { NEXT_PUBLIC_TEST_USER_EMAIL } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChannelForm } from "@/components/forms/ChannelForm";
import { RealtimeClientForm } from "@/components/forms/RealtimeClientForm";
import { ActiveChannels } from "@/components/channels/ActiveChannels";
import {
  PostgresListenerValues,
  type ChannelFormValues,
} from "@/schemas/channel";
import { type RealtimeClientFormValues } from "@/schemas/realtimeClient";
import { useBroadcastMessages } from "@/hooks/useBroadcastMessages";
import { useLogMessages } from "@/hooks/useLogMessages";
import { usePostgresChanges } from "@/hooks/usePostgresChanges";
import { usePresenceState } from "@/hooks/usePresenceState";
import {
  BroadcastMessagesTable,
  LogsTable,
  PostgresChangesTable,
  PresenceStateTable,
} from "@/components/tables";
import { useRealtimeStore } from "@/store/realtimeStore";
import { useSupabaseStore } from "@/store/supabaseStore";
import { PostgresListenerForm } from "@/components/forms/PostgresListenerForm";

export default function Home() {
  const status = useRealtimeStore((s) => s.status);
  const socketConfig = useRealtimeStore((s) => s.socketConfig);

  const { userId, email: userEmail, login, logout } = useSupabaseStore();

  const [loginEmail, setLoginEmail] = useState(NEXT_PUBLIC_TEST_USER_EMAIL);
  const [loginPassword, setLoginPassword] = useState("");

  const [presencePayload, setPresencePayload] = useState<
    Record<string, unknown>
  >({});

  const { logs, addLog, clear: clearLogs } = useLogMessages();

  const {
    messages: broadcastMessages,
    addListener: registerBroadcastListener,
    clear: clearBroadcastMessages,
  } = useBroadcastMessages();

  const {
    changes: postgresChanges,
    addListener: registerPostgresListener,
    clear: clearPostgresChanges,
  } = usePostgresChanges();

  const {
    presenceState,
    addListener: registerPresenceListener,
    clear: clearPresenceState,
  } = usePresenceState();

  // Initialize stores once on mount
  useEffect(() => {
    useSupabaseStore.getState().init();
    return () => useRealtimeStore.getState().destroy();
  }, []);

  const handleCreateClient = (config: RealtimeClientFormValues) => {
    useRealtimeStore.getState().create(config, addLog);
  };

  const handleDeleteSocket = () => {
    useRealtimeStore.getState().destroy();
  };

  // Poll connection status
  useEffect(() => {
    const interval = setInterval(
      () => useRealtimeStore.getState().syncStatus(),
      500,
    );
    useRealtimeStore.getState().syncStatus();
    return () => clearInterval(interval);
  }, []);

  // ---------------------------------------------------------------------------
  // Auth
  // ---------------------------------------------------------------------------

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      toast.warning("Please enter both email and password");
      return;
    }
    await login(loginEmail, loginPassword);
  };

  const handleLogout = async () => {
    await logout();
    setLoginEmail(NEXT_PUBLIC_TEST_USER_EMAIL);
    setLoginPassword("");
  };

  // ---------------------------------------------------------------------------
  // Listener registration (bridges store channels → React hook state)
  // ---------------------------------------------------------------------------

  const addBroadcastListener = (name: string, event: string) => {
    const ch = useRealtimeStore.getState().channels.get(name);
    if (!ch) return;
    registerBroadcastListener(ch, name, event);
    useRealtimeStore.getState().syncChannels();
  };

  const addPresenceListener = (name: string) => {
    const ch = useRealtimeStore.getState().channels.get(name);
    if (!ch) return;
    registerPresenceListener(ch, name);
    useRealtimeStore.getState().syncChannels();
  };

  const addPostgresChangesListener = ({
    channel,
    event,
    schema,
    table,
  }: PostgresListenerValues) => {
    const ch = useRealtimeStore.getState().channels.get(channel);
    if (!ch) return;
    registerPostgresListener(ch, channel, event, schema, table);
    useRealtimeStore.getState().syncChannels();
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="min-h-screen p-4 font-mono text-sm">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold mb-6">
          Realtime-js Interactive Example
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* ---------------------------------------------------------------- */}
          {/* Left Column: Controls                                            */}
          {/* ---------------------------------------------------------------- */}
          <div className="space-y-4">
            {/* Realtime Client */}
            <RealtimeClientForm
              onSubmit={handleCreateClient}
              onDelete={handleDeleteSocket}
              onConnect={() => useRealtimeStore.getState().connect()}
              onDisconnect={() => useRealtimeStore.getState().disconnect()}
              disabled={!!socketConfig}
              status={status}
            />

            {/* User Authentication */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">User Authentication</CardTitle>
              </CardHeader>
              <CardContent>
                {!userId ? (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="user@example.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                      />
                    </div>
                    <Button className="w-full" onClick={handleLogin}>
                      Log In
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Tip: Set NEXT_PUBLIC_TEST_USER_EMAIL and
                      NEXT_PUBLIC_TEST_USER_PASSWORD in .env.local
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="rounded-md border border-green-600/40 bg-green-950/30 p-3 space-y-1">
                      <p className="text-green-400 font-semibold text-xs">
                        ✓ Authenticated
                      </p>
                      <p className="text-xs text-muted-foreground break-all">
                        <span className="font-semibold">User ID:</span> {userId}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold">Email:</span>{" "}
                        {userEmail}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={handleLogout}
                    >
                      Log Out
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <ChannelForm
              onSubmit={({ name, config }: ChannelFormValues) =>
                useRealtimeStore.getState().createChannel(name, config)
              }
            />

            <ActiveChannels
              onAddBroadcastListener={addBroadcastListener}
              onAddPresenceListener={addPresenceListener}
            />

            {/* Postgres Changes Config */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Postgres Changes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <PostgresListenerForm onSubmit={addPostgresChangesListener} />
              </CardContent>
            </Card>

            {/* Presence Track */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Presence Track</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <Label>Track Payload (JSON format)</Label>
                  <Textarea
                    placeholder='{"status": "online", "name": "Alice"}'
                    className="font-mono text-xs"
                    rows={3}
                    defaultValue={JSON.stringify(presencePayload, null, 2)}
                    onChange={(e) => {
                      try {
                        setPresencePayload(JSON.parse(e.target.value));
                      } catch {
                        // Allow typing invalid JSON temporarily
                        toast.error("Invalid JSON format");
                      }
                    }}
                  />
                </div>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {useRealtimeStore.getState().subscribedChannels().length ===
                  0 ? (
                    <div className="text-center py-3 border border-dashed rounded-md">
                      <p className="text-muted-foreground text-xs">
                        No subscribed channels
                      </p>
                      <p className="text-muted-foreground/60 text-xs">
                        Subscribe to a channel first
                      </p>
                    </div>
                  ) : (
                    useRealtimeStore
                      .getState()
                      .subscribedChannels()
                      .map(([key]) => (
                        <Button
                          key={key}
                          className="w-full justify-start text-xs"
                          variant="secondary"
                          onClick={() =>
                            useRealtimeStore
                              .getState()
                              .trackPresence(key, presencePayload)
                          }
                        >
                          👥 Track to: {key}
                        </Button>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Right Column: Data Tables                                        */}
          {/* ---------------------------------------------------------------- */}
          <div className="space-y-4">
            <LogsTable logs={logs} onClear={clearLogs} />
            <BroadcastMessagesTable
              messages={broadcastMessages}
              onClear={clearBroadcastMessages}
            />
            <PostgresChangesTable
              changes={postgresChanges}
              onClear={clearPostgresChanges}
            />
            <PresenceStateTable
              presenceState={presenceState}
              onClear={clearPresenceState}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
