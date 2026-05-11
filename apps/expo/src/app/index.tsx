import { EnvProvider } from '@realtime-playground/realtime-core'
import { TestsScreenContent } from '../components/testUI'
import {
  PUBLIC_SUPABASE_KEY,
  PUBLIC_SUPABASE_URL,
  PUBLIC_TEST_USER_EMAIL,
  PUBLIC_TEST_USER_PASSWORD,
} from '../lib/constants'

export default function IndexScreen() {
  return (
    <EnvProvider
      defaults={{
        supabaseUrl: PUBLIC_SUPABASE_URL,
        supabaseKey: PUBLIC_SUPABASE_KEY,
        testUserEmail: PUBLIC_TEST_USER_EMAIL,
        testUserPassword: PUBLIC_TEST_USER_PASSWORD,
      }}
    >
      <TestsScreenContent />
    </EnvProvider>
  )
}
