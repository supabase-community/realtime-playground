import { useSupabaseStore } from '@/store/supabaseStore'

import { LoginValues } from '@/schemas/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoginForm } from './forms'
import { Button } from '@/components/ui/button'

export default function Auth() {
  const { userId, email: userEmail, token, login, logout } = useSupabaseStore()

  const handleLogin = async ({ email, password }: LoginValues) => {
    await login(email, password)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">User Authentication</CardTitle>
      </CardHeader>
      <CardContent>
        {!userId ? (
          <div className="flex flex-col gap-2">
            <LoginForm onSubmit={handleLogin} />
            <p className="text-muted-foreground text-xs">
              Tip: Set NEXT_PUBLIC_TEST_USER_EMAIL in .env
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="space-y-1 rounded-md border border-green-600/40 bg-green-950/30 p-3">
              <p className="text-xs font-semibold text-green-400">✓ Authenticated</p>
              <p className="text-muted-foreground text-xs break-all">
                <span className="font-semibold">User ID:</span> {userId}
              </p>
              <p className="text-muted-foreground text-xs">
                <span className="font-semibold">Email:</span> {userEmail}
              </p>
              <p className="text-xs wrap-break-word">
                <span className="font-semibold underline">Token: </span> {token}
              </p>
            </div>
            <Button variant="destructive" className="w-full" onClick={logout}>
              Log Out
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
