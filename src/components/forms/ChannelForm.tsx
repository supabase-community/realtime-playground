"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { channelFormSchema, type ChannelFormValues } from "@/schemas/channel";

interface Props {
  onSubmit: (values: ChannelFormValues) => void;
}

export default function ChannelForm({ onSubmit }: Props) {
  const form = useForm<ChannelFormValues>({
    resolver: zodResolver(channelFormSchema),
    defaultValues: channelFormSchema.parse({
      name: "test",
    }),
  });

  const presenceEnabled = useWatch({
    control: form.control,
    name: "config.presence.enabled",
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Create Channel</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {/* Channel name + private */}
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Channel Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., my-room, game-lobby, chat-1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="config.private"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal text-muted-foreground cursor-pointer">
                      Private channel
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <div className="border-t pt-3 space-y-3">
              {/* Broadcast config */}
              <div className="rounded-md border border-blue-600/30 bg-blue-950/20 p-3 space-y-2">
                <p className="text-xs font-semibold text-blue-400">
                  Broadcast Configuration
                </p>
                <FormField
                  control={form.control}
                  name="config.broadcast.ack"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal text-xs text-muted-foreground cursor-pointer">
                        Send acknowledgments (ack)
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="config.broadcast.self"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal text-xs text-muted-foreground cursor-pointer">
                        Receive own messages (self)
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              {/* Presence config */}
              <div className="rounded-md border border-green-600/30 bg-green-950/20 p-3 space-y-2">
                <p className="text-xs font-semibold text-green-400">
                  Presence Configuration
                </p>
                <FormField
                  control={form.control}
                  name="config.presence.enabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal text-xs text-muted-foreground cursor-pointer">
                        Enable presence tracking
                      </FormLabel>
                    </FormItem>
                  )}
                />
                {presenceEnabled && (
                  <FormField
                    control={form.control}
                    name="config.presence.key"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">
                          Presence Key (optional)
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., user-id" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            <Button type="submit" className="w-full">
              Create Channel
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
