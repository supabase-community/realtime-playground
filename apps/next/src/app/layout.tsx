import { EnvProvider } from '@realtime-playground/realtime-core'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Suspense } from 'react'
import { NavLinks } from '@/components/nav-links'
import { UrlParamsSync } from '@/components/UrlParamsSync'
import { Toaster } from '@/components/ui/sonner'
import {
  ENABLE_PLAYGROUND,
  PUBLIC_SUPABASE_KEY,
  PUBLIC_SUPABASE_URL,
  PUBLIC_TEST_USER_EMAIL,
  PUBLIC_TEST_USER_PASSWORD,
} from '@/lib/constants'
import './globals.css'

const sans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const mono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Realtime Playground',
  description: 'Explore Supabase Realtime features interactively',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark h-full">
      <body className={`${sans.variable} ${mono.variable} h-screen w-screen antialiased`}>
        <div className="flex h-full flex-col overflow-hidden p-4 font-mono text-sm">
          <nav className="flex h-16 items-center justify-between">
            <div className="mb-4 shrink-0 text-2xl font-bold">Supabase Realtime Interactive</div>
            <NavLinks enablePlayground={ENABLE_PLAYGROUND} />
          </nav>

          <EnvProvider
            defaults={{
              supabaseUrl: PUBLIC_SUPABASE_URL,
              supabaseKey: PUBLIC_SUPABASE_KEY,
              testUserEmail: PUBLIC_TEST_USER_EMAIL,
              testUserPassword: PUBLIC_TEST_USER_PASSWORD,
            }}
          >
            <Suspense>
              <UrlParamsSync />
            </Suspense>
            <div className="h-[calc(100%-4rem)] min-h-0 overflow-hidden">{children}</div>
          </EnvProvider>
        </div>
        <Toaster position="bottom-left" theme="dark" closeButton />
      </body>
    </html>
  )
}
