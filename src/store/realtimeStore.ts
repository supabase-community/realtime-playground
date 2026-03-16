import { create } from 'zustand'
import { RealtimeClient, RealtimeChannel } from '@supabase/supabase-js'
import { toast } from 'sonner'
import z from 'zod'
import { realtimeClientSchema } from '@/schemas/client'
import { channelConfigSchema } from '@/schemas/channel'

export type SocketStatus = 'closed' | 'connecting' | 'open' | 'closing'

type SocketConfigValues = z.infer<typeof realtimeClientSchema>
type ChannelConfigValues = z.infer<typeof channelConfigSchema>

type Logger = (kind: string, msg: string, data: unknown) => void

export type RealtimeStore = {
  client: RealtimeClient | null
  socketConfig: SocketConfigValues | null
  status: SocketStatus
  channels: Map<string, RealtimeChannel>

  create: (config: SocketConfigValues, logger?: Logger) => void
  destroy: () => void
  syncStatus: () => void
  syncChannels: () => void

  connect: () => void
  disconnect: () => void

  createChannel: (name: string, config?: ChannelConfigValues) => void
  removeChannel: (name: string) => void
  subscribedChannels: () => [string, RealtimeChannel][]
  subscribe: (name: string) => void
  unsubscribe: (name: string) => void
  trackPresence: (name: string, payload: Record<string, unknown>) => void
  untrackPresence: (name: string) => void

  setAuth: (token: string) => void
}

export const useRealtimeStore = create<RealtimeStore>((set, get) => ({
  client: null,
  socketConfig: null,
  status: 'closed',
  channels: new Map(),

  create(config, logger) {
    get().client?.disconnect()
    const timeout = config.timeout ? parseInt(config.timeout) : undefined
    const heartbeatIntervalMs = config.heartbeatIntervalMs
      ? parseInt(config.heartbeatIntervalMs)
      : undefined
    set({
      socketConfig: config,
      client: new RealtimeClient(config.url, {
        params: {
          apikey: config.apiKey,
          ...(config.vsn ? { vsn: config.vsn } : {}),
        },
        worker: config.worker,
        ...(timeout !== undefined ? { timeout } : {}),
        ...(heartbeatIntervalMs !== undefined ? { heartbeatIntervalMs } : {}),
        logger,
      }),
    })
  },

  destroy() {
    get().client?.disconnect()
    set({
      client: null,
      socketConfig: null,
      status: 'closed',
      channels: new Map(),
    })
  },

  syncStatus() {
    const { client } = get()
    if (!client) return
    const status = client.connectionState() as SocketStatus
    set({ status })
  },

  syncChannels() {
    const { client } = get()
    if (!client) return
    set({
      channels: new Map(client.getChannels().map((ch) => [ch.subTopic, ch])),
    })
  },

  connect: () => get().client?.connect(),
  disconnect: () => get().client?.disconnect(),

  createChannel(name, config) {
    const { client, channels, syncChannels } = get()
    if (!client) return
    if (channels.has(name)) {
      toast.warning(`Channel "${name}" already exists`)
      return
    }

    let ch: RealtimeChannel

    try {
      ch = client.channel(name, config ? { config } : undefined)
    } catch (e) {
      toast.error(
        `Error while creating channel: ${e instanceof Error ? e.message : JSON.stringify(e)}`,
      )
      return
    }

    ch.on('system', {}, (payload) => {
      const msg = `[SYSTEM] ${payload.message}`
      if (payload.status === 'ok') toast.success(msg)
      else toast.error(msg)
    })
    syncChannels()
  },

  removeChannel(name) {
    const { channels, syncChannels } = get()
    const ch = channels.get(name)
    if (!ch) {
      toast.error(`[REMOVE] Channel "${name}" not found`)
      return
    }
    ch.unsubscribe()
    syncChannels()
  },

  subscribedChannels() {
    const { channels } = get()
    return Array.from(channels.entries()).filter(([, ch]) => ch.state === 'joined')
  },

  subscribe(name) {
    const { channels, syncChannels } = get()
    const ch = channels.get(name)
    if (!ch) {
      toast.error(`[SUBSCRIBE] Channel "${name}" not found`)
      return
    }
    ch.subscribe((status, err) => {
      if (err) {
        toast.error(`[SUBSCRIBE] Error: ${err.message}`)
      } else if (status === 'SUBSCRIBED') {
        toast.success(`[SUBSCRIBE] Subscribed to "${name}"`)
      }

      syncChannels()
    })
  },

  unsubscribe(name) {
    const { channels, syncChannels } = get()
    const ch = channels.get(name)
    if (!ch) {
      toast.error(`[UNSUBSCRIBE] Channel "${name}" not found`)
      return
    }
    ch.unsubscribe()
    syncChannels()
  },

  trackPresence(name, payload) {
    const ch = get().channels.get(name)
    if (!ch) {
      toast.error(`[TRACK] Channel "${name}" not found`)
      return
    }
    ch.track(payload)
  },

  untrackPresence(name) {
    const ch = get().channels.get(name)
    if (!ch) {
      toast.error(`[UNTRACK] Channel "${name}" not found`)
      return
    }
    ch.untrack()
  },

  setAuth: (token) => get().client?.setAuth(token),
}))
