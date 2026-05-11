'use client'

import type { ReactNode } from 'react'

export type ToastType = 'success' | 'info' | 'warning' | 'error' | 'loading'

type TitleType = (() => ReactNode) | ReactNode

export interface ExtraPayload {
  description?: string
  duration?: number
  id?: string
}

export interface ToasterProvider {
  info: (title: TitleType, input?: ExtraPayload) => string | number
  error: (title: TitleType, input?: ExtraPayload) => string | number
  success: (title: TitleType, input?: ExtraPayload) => string | number
  warning: (title: TitleType, input?: ExtraPayload) => string | number
}

class ToasterWrapper {
  provider?: ToasterProvider

  validateProvider(): asserts this is { provider: ToasterProvider } {
    console.log('Validating toaster provider')
    if (!this.provider) {
      throw new Error('Toaster provider not set')
    }
  }

  setProvider(provider: ToasterProvider) {
    console.log('Setting toaster provider')
    this.provider = provider
  }

  info(title: TitleType, input?: ExtraPayload) {
    this.validateProvider()
    return this.provider.info(title, input)
  }

  error(title: TitleType, input?: ExtraPayload) {
    this.validateProvider()
    return this.provider.error(title, input)
  }

  success(title: TitleType, input?: ExtraPayload) {
    this.validateProvider()
    return this.provider.success(title, input)
  }

  warning(title: TitleType, input?: ExtraPayload) {
    this.validateProvider()
    return this.provider.warning(title, input)
  }
}

export const toast = new ToasterWrapper()
