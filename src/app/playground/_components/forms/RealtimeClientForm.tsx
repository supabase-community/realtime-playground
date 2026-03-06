"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

  const errors = form.formState.errors;

  return (
    <form
      id="realtime-client-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      <div className="grid grid-cols-2 gap-2">
        <div className="flex justify-between">
          <Label className="text-xs" htmlFor="realtime-client-form-url">
            URL
          </Label>
          {errors.url && (
            <p className="text-xs text-destructive">{errors.url.message}</p>
          )}
        </div>
        <div className="flex justify-between">
          <Label className="text-xs" htmlFor="realtime-client-form-apikey">
            API Key
          </Label>
          {errors.apiKey && (
            <p className="text-xs text-destructive">{errors.apiKey.message}</p>
          )}
        </div>
        <Input
          id="realtime-client-form-url"
          placeholder="https://your-project.supabase.co/realtime/v1"
          disabled={disabled}
          aria-invalid={!!errors.url}
          {...form.register("url")}
        />
        <Input
          id="realtime-client-form-apikey"
          placeholder="your-anon-key"
          disabled={disabled}
          aria-invalid={!!errors.apiKey}
          {...form.register("apiKey")}
        />
      </div>

      <div className="grid grid-cols-[auto_auto_1fr_1fr] gap-2 place-content-stretch ">
        <Label className="text-xs" htmlFor="realtime-client-form-worker">
          Worker?
        </Label>
        <Label className="text-xs" htmlFor="realtime-client-form-vsn">
          VSN
        </Label>
        <Label className="text-xs" htmlFor="realtime-client-form-heartbeat">
          Heartbeat Interval (ms)
        </Label>
        <Label className="text-xs" htmlFor="realtime-client-form-timeout">
          Timeout (ms)
        </Label>

        <Controller
          control={form.control}
          name="worker"
          render={({ field }) => (
            <Checkbox
              id="realtime-client-form-worker"
              className="m-auto"
              disabled={disabled}
              name={field.name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />

        <Controller
          control={form.control}
          name="vsn"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent id="realtime-client-form-vsn">
                {vsnSchema.options.map((v) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <Input
          id="realtime-client-form-heartbeat"
          placeholder="30000"
          type="number"
          disabled={disabled}
          {...form.register("heartbeatIntervalMs")}
        />
        <Input
          id="realtime-client-form-timeout"
          placeholder="10000"
          type="number"
          disabled={disabled}
          {...form.register("timeout")}
        />
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
  );
}
