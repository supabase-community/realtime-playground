import { create } from 'zustand'
import {
  RealtimeClient,
  RealtimeChannel,
  RealtimeClientOptions,
  RealtimeChannelOptions,
} from '@supabase/supabase-js'
import { toast } from 'sonner'

export type SocketStatus = 'closed' | 'connecting' | 'open' | 'closing'

type State = {
  client: RealtimeClient | null
  channels: Map<string, RealtimeChannel>
}

type Action = {
  create: (url: string, options: RealtimeClientOptions) => void
  destroy: () => void
  syncChannels: () => void

  createChannel: (name: string, config?: RealtimeChannelOptions) => void
  removeChannel: (name: string) => void
  subscribe: (name: string) => void
  unsubscribe: (name: string) => void
  trackPresence: (name: string, payload: Record<string, unknown>) => void
  untrackPresence: (name: string) => void

  setAuth: (token: string) => void
}

export type RealtimeStore = State & Action

export const useClientCreated = () => useRealtimeStore(({ client }) => !!client)

export const useRealtimeStore = create<RealtimeStore>((set, get) => ({
  client: null,
  channels: new Map(),

  create(url, options) {
    get().client?.disconnect()
    set({
      client: new RealtimeClient(url, options),
    })
  },

  destroy() {
    get().client?.disconnect()
    set({
      client: null,
      channels: new Map(),
    })
  },

  syncChannels() {
    const { client } = get()
    if (!client) return
    set({
      channels: new Map(client.getChannels().map((ch) => [ch.subTopic, ch])),
    })
  },

  createChannel(name, config) {
    const { client, channels, syncChannels } = get()
    if (!client) return
    if (channels.has(name)) {
      toast.warning(`[CHANNEL]: "${name}" already exists`)
      return
    }

    let ch: RealtimeChannel

    try {
      ch = client.channel(name, config)
    } catch (e) {
      toast.error(`[CHANNEL]: ${e instanceof Error ? e.message : JSON.stringify(e)}`)
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
