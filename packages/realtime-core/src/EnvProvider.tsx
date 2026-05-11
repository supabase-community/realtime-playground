'use client'

import React, { createContext, type ReactNode, useContext, useMemo, useState } from 'react'

interface Environ {
  supabaseUrl: string
  supabaseKey: string
  testUserEmail: string
  testUserPassword: string
}

interface EnvProviderProps {
  children: ReactNode
  defaults: Environ
}

interface EnvContextType extends Environ {
  setSupabaseUrl: (url: string) => void
  setSupabaseKey: (key: string) => void
  setTestUserEmail: (email: string) => void
  setTestUserPassword: (password: string) => void
}

export const EnvContext = createContext<EnvContextType | null>(null)

export const EnvProvider: React.FC<EnvProviderProps> = ({ children, defaults }) => {
  const [supabaseUrl, setSupabaseUrl] = useState<string>(defaults.supabaseUrl)
  const [supabaseKey, setSupabaseKey] = useState<string>(defaults.supabaseKey)
  const [testUserEmail, setTestUserEmail] = useState<string>(defaults.testUserEmail)
  const [testUserPassword, setTestUserPassword] = useState<string>(defaults.testUserPassword)

  const value = useMemo(
    () => ({
      supabaseUrl,
      supabaseKey,
      testUserEmail,
      testUserPassword,
      setSupabaseUrl,
      setSupabaseKey,
      setTestUserEmail,
      setTestUserPassword,
    }),
    [supabaseUrl, supabaseKey, testUserEmail, testUserPassword],
  )

  return <EnvContext.Provider value={value}>{children}</EnvContext.Provider>
}

export function useEnv() {
  const context = useContext(EnvContext)

  if (!context) {
    throw new Error('useEnv must be used within an EnvProvider')
  }

  return context
}
