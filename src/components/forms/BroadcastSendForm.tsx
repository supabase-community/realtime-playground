"use client";

import { useMemo } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  broadcastSendSchema,
  type BroadcastSendValues,
} from "@/schemas/channel";
import { useRealtimeStore } from "@/store/realtimeStore";

export default function BroadcastSendForm() {
  const channels = useRealtimeStore((s) => s.channels);

  const subscribedTopics = useMemo(
    () =>
      Array.from(channels.entries())
        .filter(([, ch]) => ch.state === "joined")
        .map(([topic]) => topic),
    [channels],
  );

  if (subscribedTopics.length === 0) {
    return (
      <div className="px-4 p-2">
        <p className="text-xs text-muted-foreground">No subscribed topics</p>
      </div>
    );
  }

  return <BroadcastSendFormInner subscribedTopics={subscribedTopics} />;
}

type BroadcastSendFormInnerProps = {
  subscribedTopics: string[];
};

function BroadcastSendFormInner({
  subscribedTopics,
}: BroadcastSendFormInnerProps) {
  const form = useForm<BroadcastSendValues>({
    resolver: zodResolver(broadcastSendSchema),
    defaultValues: broadcastSendSchema.parse({
      channel: subscribedTopics[0],
    }),
  });

  const selectedChannel = useWatch({ control: form.control, name: "channel" });

  const handleSubmit = form.handleSubmit(({ event, channel, message }) => {
    const ch = useRealtimeStore.getState().channels.get(channel);
    if (!ch) {
      toast.error(`[BROADCAST] Channel "${channel}" not found`);
      return;
    }
    ch.send({ type: "broadcast", event, payload: { message } });
    form.reset({ event: form.getValues("event"), channel, message: "" });
  });

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
      <Input
        className="h-8 text-xs w-24 shrink-0"
        placeholder="event"
        {...form.register("event")}
      />
      <Controller
        control={form.control}
        name="channel"
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className="h-8 text-xs w-32 shrink-0">
              <SelectValue placeholder="channel" />
            </SelectTrigger>
            <SelectContent>
              {subscribedTopics.map((topic) => (
                <SelectItem key={topic} value={topic} className="text-xs">
                  {topic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <Input
        className="h-8 text-xs flex-1"
        placeholder="message"
        {...form.register("message")}
      />
      <Button
        type="submit"
        size="sm"
        className="h-8 text-xs shrink-0"
        disabled={!selectedChannel}
      >
        Send
      </Button>
    </form>
  );
}
