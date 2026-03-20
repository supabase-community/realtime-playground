import type { NextConfig } from 'next'
import { loadRootEnv } from '../../scripts/load-root-env.mjs'

loadRootEnv()

const nextConfig: NextConfig = {
  env: {
    PUBLIC_REALTIME_URL: process.env.PUBLIC_REALTIME_URL ?? '',
    PUBLIC_SUPABASE_URL: process.env.PUBLIC_SUPABASE_URL ?? '',
    PUBLIC_TEST_USER_EMAIL: process.env.PUBLIC_TEST_USER_EMAIL ?? '',
    PUBLIC_SUPABASE_KEY: process.env.PUBLIC_SUPABASE_KEY ?? '',
  },
}

export default nextConfig
