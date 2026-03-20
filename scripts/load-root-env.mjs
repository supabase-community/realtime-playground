import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

export function loadRootEnv() {
  const envPath = resolve(import.meta.dirname, '..', '.env')

  if (existsSync(envPath) && typeof process.loadEnvFile === 'function') {
    process.loadEnvFile(envPath)
  }

  return envPath
}
