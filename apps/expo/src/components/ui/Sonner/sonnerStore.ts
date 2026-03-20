import { useSyncExternalStore } from 'react'

import type { ToastInput, ToastRecord, ToastType } from './sonnerTypes'

const DEFAULT_DURATION = 3000

let records: ToastRecord[] = []
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot() {
  return records
}

function createToast(type: ToastType, title: string, input?: ToastInput) {
  const id = input?.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const nextToast: ToastRecord = {
    description: input?.description,
    duration: input?.duration ?? DEFAULT_DURATION,
    id,
    title,
    type,
  }

  records = [...records, nextToast]
  emit()

  if (nextToast.duration > 0) {
    setTimeout(() => {
      dismiss(id)
    }, nextToast.duration)
  }

  return id
}

export function dismiss(id?: string) {
  records = id ? records.filter((record) => record.id !== id) : []
  emit()
}

export function useToasts() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

export const toast = {
  dismiss,
  error: (title: string, input?: ToastInput) => createToast('error', title, input),
  info: (title: string, input?: ToastInput) => createToast('info', title, input),
  loading: (title: string, input?: ToastInput) =>
    createToast('loading', title, { ...input, duration: 0 }),
  show: (title: string, input?: ToastInput & { type?: ToastType }) =>
    createToast(input?.type ?? 'info', title, input),
  success: (title: string, input?: ToastInput) => createToast('success', title, input),
  warning: (title: string, input?: ToastInput) => createToast('warning', title, input),
}
