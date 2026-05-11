'use client'

import { useEnv } from '@realtime-playground/realtime-core'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export function UrlParamsSync() {
  const params = useSearchParams()
  const { setSupabaseUrl, setSupabaseKey, setTestUserEmail, setTestUserPassword } = useEnv()

  useEffect(() => {
    const url = params.get('url')
    const key = params.get('key')
    const email = params.get('email')
    const password = params.get('password')

    if (url) setSupabaseUrl(url)
    if (key) setSupabaseKey(key)
    if (email) setTestUserEmail(email)
    if (password) setTestUserPassword(password)
  }, [params, setSupabaseUrl, setSupabaseKey, setTestUserEmail, setTestUserPassword])

  return null
}
