'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useTestSettings } from '@/hooks/useTestSettings'
import { ArrowLeft, ClipboardPaste, Cog } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import SqlSnippet from './SqlSnippet'

type Screen = 'settings' | 'setup'

function SettingsScreen({ onShowSetup }: { onShowSetup: () => void }) {
  const { supabase_url, supabase_key, setSupabaseUrl, setSupabaseKey } = useTestSettings()

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText()
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)
    for (const line of lines) {
      const eqIndex = line.indexOf('=')
      if (eqIndex === -1) continue
      const prefix = line.slice(0, eqIndex)
      const value = line.slice(eqIndex + 1).replace(/^["']|["']$/g, '')
      if (prefix.includes('URL')) setSupabaseUrl(value)
      if (prefix.includes('KEY')) setSupabaseKey(value)
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Test Settings</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="supabase-url">Supabase URL</Label>
          <Input
            id="supabase-url"
            value={supabase_url}
            onChange={(e) => setSupabaseUrl(e.target.value)}
            placeholder="https://your-project.supabase.co"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="supabase-key">Supabase Key</Label>
          <Input
            id="supabase-key"
            value={supabase_key}
            onChange={(e) => setSupabaseKey(e.target.value)}
            placeholder="your-anon-key"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePaste}>
            <ClipboardPaste className="mr-1 size-3.5" />
            Paste keys
          </Button>
          <Button variant="ghost" size="sm" onClick={onShowSetup}>
            How to setup
          </Button>
        </div>
        <p className="text-muted-foreground text-xs">
          <a
            href="https://supabase.com/dashboard/project/_?showConnect=true&connectTab=frameworks"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            Get your keys at supabase.com
          </a>
        </p>
      </div>
    </>
  )
}

function SetupScreen({ onBack }: { onBack: () => void }) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>
          <button
            className="text-muted-foreground hover:text-foreground mr-2 inline-flex items-center" onClick={onBack}
          >
            <ArrowLeft className="size-4" />
          </button>
          How to setup
        </DialogTitle>
      </DialogHeader>
      <div className="text-muted-foreground flex flex-col gap-3 text-sm">
        <p>TODO: write instruction</p>
        <SqlSnippet />
      </div>
    </>
  )
}

export default function TestSettingsModal({ children }: { children?: ReactNode }) {
  const [screen, setScreen] = useState<Screen>('settings')

  return (
    <Dialog onOpenChange={(open) => { if (!open) setScreen('settings') }}>
      <DialogTrigger asChild>
        {children ?? (
          <Button variant="outline" size="icon-sm">
            <Cog />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className={screen === 'setup' ? 'sm:max-w-2xl' : undefined}>
        {screen === 'settings' ? (
          <SettingsScreen onShowSetup={() => setScreen('setup')} />
        ) : (
          <SetupScreen onBack={() => setScreen('settings')} />
        )}
      </DialogContent>
    </Dialog>
  )
}
