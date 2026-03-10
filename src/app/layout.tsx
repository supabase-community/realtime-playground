import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { NavLinks } from '@/components/nav-links'
import { Toaster } from '@/components/ui/sonner'

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
            <NavLinks />
          </nav>

          <div className="h-[calc(100%-4rem)] min-h-0 overflow-hidden">{children}</div>
        </div>
        <Toaster position="bottom-left" theme="dark" />
      </body>
    </html>
  )
}
