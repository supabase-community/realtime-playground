export type ToastType = 'success' | 'info' | 'warning' | 'error' | 'loading'

export type ToastRecord = {
  description?: string
  duration: number
  id: string
  title: string
  type: ToastType
}

export type ToastInput = {
  description?: string
  duration?: number
  id?: string
}
