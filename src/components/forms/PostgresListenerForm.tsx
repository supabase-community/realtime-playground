"use client";

import {
  postgresListenerSchema,
  PostgresListenerValues,
} from "@/schemas/channel";
import { useRealtimeStore } from "@/store/realtimeStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { REALTIME_POSTGRES_CHANGES_LISTEN_EVENT } from "@supabase/supabase-js";

type Props = {
  onSubmit: (values: PostgresListenerValues) => void;
};

export default function PostgresListenerForm({ onSubmit }: Props) {
  const channels = useRealtimeStore((s) => s.channels);
  const channelTopics = useMemo(() => Array.from(channels.keys()), [channels]);

  if (channelTopics.length === 0) {
    return (
      <div className="px-4 p-2">
        <p className="text-xs text-muted-foreground">No subscribed channels</p>
      </div>
    );
  }

  return (
    <PostgresListenerFormInner
      onSubmit={onSubmit}
      channelTopics={channelTopics}
    />
  );
}

type PostgresListenerFormInnerProps = {
  onSubmit: (values: PostgresListenerValues) => void;
  channelTopics: string[];
};

function PostgresListenerFormInner({
  onSubmit,
  channelTopics,
}: PostgresListenerFormInnerProps) {
  const form = useForm<PostgresListenerValues>({
    resolver: zodResolver(postgresListenerSchema),
    defaultValues: postgresListenerSchema.parse({
      channel: channelTopics[0],
    }),
  });

  const selectedChannel = useWatch({ control: form.control, name: "channel" });

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">Schema</label>
        <Input placeholder="public" {...form.register("schema")} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">Table</label>
        <Input placeholder="*" {...form.register("table")} />
      </div>
      <Controller
        control={form.control}
        name="event"
        render={({ field }) => (
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Event</label>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="h-8 text-xs w-32 shrink-0">
                <SelectValue placeholder="INSERT" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(REALTIME_POSTGRES_CHANGES_LISTEN_EVENT).map(
                  (value) => (
                    <SelectItem key={value} value={value} className="text-xs">
                      {value}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
        )}
      />
      <Controller
        control={form.control}
        name="channel"
        render={({ field }) => (
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Channel</label>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="h-8 text-xs w-32 shrink-0">
                <SelectValue placeholder="channel" />
              </SelectTrigger>
              <SelectContent>
                {channelTopics.map((topic) => (
                  <SelectItem key={topic} value={topic} className="text-xs">
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      />
      <Button
        type="submit"
        size="sm"
        className="h-8 text-xs shrink-0"
        disabled={!selectedChannel}
      >
        Add Listener
      </Button>
    </form>
  );
}
