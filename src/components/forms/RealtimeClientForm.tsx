"use client";

import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  realtimeClientSchema,
  vsnSchema,
  type RealtimeClientFormValues,
} from "@/schemas/client";

type Props = {
  onSubmit: (values: RealtimeClientFormValues) => void;
  onDelete: () => void;
  onConnect: () => void;
  onDisconnect: () => void;
  disabled?: boolean;
  status?: string;
};

export function RealtimeClientForm({
  onSubmit,
  onDelete,
  onConnect,
  onDisconnect,
  disabled = false,
  status,
}: Props) {
  const form = useForm<RealtimeClientFormValues>({
    resolver: zodResolver(realtimeClientSchema),
    defaultValues: realtimeClientSchema.parse({}),
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Realtime Client</CardTitle>
          {disabled && status && (
            <div className="flex items-center gap-2">
              <span
                className={`inline-block w-2.5 h-2.5 rounded-full ${
                  status === "open"
                    ? "bg-green-500"
                    : status === "connecting"
                      ? "bg-yellow-500 animate-pulse"
                      : "bg-red-500"
                }`}
              />
              <span className="text-xs font-semibold uppercase text-muted-foreground">
                {status}
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="wss://your-project.supabase.co/realtime/v1"
                      disabled={disabled}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">API Key</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your-anon-key"
                      disabled={disabled}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <div className="rounded-md border border-border/50 bg-muted/20 p-3 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">
                Options
              </p>

              <FormField
                control={form.control}
                name="worker"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={disabled}
                      />
                    </FormControl>
                    <FormLabel className="font-normal text-xs text-muted-foreground cursor-pointer">
                      Use Web Worker
                    </FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vsn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">VSN</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={disabled}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vsnSchema.options.map((v) => (
                          <SelectItem key={v} value={v}>
                            {v}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="timeout"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Timeout (ms)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="10000"
                          type="number"
                          min={1}
                          disabled={disabled}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="heartbeatIntervalMs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Heartbeat (ms)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="30000"
                          type="number"
                          min={1}
                          disabled={disabled}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {!disabled ? (
              <Button type="submit" className="w-full">
                Create Client
              </Button>
            ) : (
              <div className="flex gap-2 pt-1">
                <Button
                  type="button"
                  className="flex-1"
                  variant={status === "open" ? "secondary" : "default"}
                  onClick={status === "open" ? onDisconnect : onConnect}
                >
                  {status === "open" ? "Disconnect" : "Connect"}
                </Button>
                <Button type="button" variant="destructive" onClick={onDelete}>
                  Delete
                </Button>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
