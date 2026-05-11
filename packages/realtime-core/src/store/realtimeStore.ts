import { type RealtimeChannel, RealtimeClient } from '@supabase/supabase-js'
import { create } from 'zustand'

import { toast } from '../toaster'
import type { RealtimeStore } from './types'

export const useRealtimeStore = create<RealtimeStore>((set, get) => ({
  client: null,
  channels: new Map(),

  create: (url, options) => {
    get().client?.disconnect()

    set({
      client: new RealtimeClient(url, options),
    })
  },

  destroy: () => {
    get().client?.disconnect()

    set({
      client: null,
      channels: new Map(),
    })
  },

  syncChannels: () => {
    const { client } = get()

    if (!client) {
      toast.error('Realtime client not initialized')
      return
    }

    set({
      channels: new Map(client.getChannels().map((channel) => [channel.subTopic, channel])),
    })
  },

  createChannel: (name, options) => {
    const { client, channels, syncChannels } = get()

    if (!client) {
      toast.error('Realtime client not initialized')
      return
    }

    if (channels.has(name)) {
      toast.error(`Channel with name "${name}" already exists`)
      return
    }

    let channel: RealtimeChannel

    try {
      channel = client.channel(name, options)
    } catch (error) {
      toast.error(`[CHANNEL]: ${error instanceof Error ? error.message : JSON.stringify(error)}`)
      return
    }

    channel.on('system', {}, (payload) => {
      const msg = `[SYSTEM] ${payload.message}`

      if (payload.status === 'ok') {
        toast.success(msg)
      } else {
        toast.error(msg)
      }
    })

    syncChannels()
  },

  removeChannel: (name) => {
    const { channels, syncChannels } = get()

    const channel = channels.get(name)

    if (!channel) {
      toast.error(`Channel with name "${name}" does not exist`)
      return
    }

    channel.unsubscribe()
    syncChannels()
  },

  subscribe: (name) => {
    const { channels, syncChannels } = get()
    const channel = channels.get(name)

    if (!channel) {
      toast.error(`Channel with name "${name}" does not exist`)
      return
    }

    channel.subscribe((status, err) => {
      if (err) {
        toast.error(`[SUBSCRIBE]: ${err instanceof Error ? err.message : JSON.stringify(err)}`)
      } else if (status === 'SUBSCRIBED') {
        toast.success(`Subscribed to channel "${name}"`)
      }

      syncChannels()
    })
  },

  unsubscribe: (name) => {
    const { channels, syncChannels } = get()
    const channel = channels.get(name)

    if (!channel) {
      toast.error(`Channel with name "${name}" does not exist`)
      return
    }

    channel.unsubscribe()
    syncChannels()
  },

  trackPresence: (name, payload) => {
    const channel = get().channels.get(name)

    if (!channel) {
      toast.error(`Channel with name "${name}" does not exist`)
      return
    }

    channel.track(payload)
  },

  untrackPresence: (name) => {
    const channel = get().channels.get(name)

    if (!channel) {
      toast.error(`Channel with name "${name}" does not exist`)
      return
    }

    channel.untrack()
  },

  setAuth: (token) => {
    get().client?.setAuth(token)
  },
}))

export const useClientCreated = () => useRealtimeStore(({ client }) => !!client)
