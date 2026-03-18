'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { loginSchema, type LoginValues } from '@/schemas/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
type Props = {
  onSubmit: (values: LoginValues) => void
}

export function LoginForm({ onSubmit }: Props) {
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: loginSchema.pick({ email: true }).parse({}),
    reValidateMode: 'onSubmit',
  })

  const handleSubmit = form.handleSubmit(onSubmit)
  const errors = form.formState.errors

  return (
    <form id="login-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2">
        <div className="flex justify-between">
          <Label htmlFor="login-form-email">Email</Label>
          {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
        </div>
        <div className="flex justify-between gap-2">
          <Label htmlFor="login-form-password">Password</Label>
          {errors.password && (
            <p className="text-destructive items-end text-right text-xs">
              {errors.password.message}
            </p>
          )}
        </div>
        <Input id="login-form-email" placeholder="user@example.com" {...form.register('email')} />

        <Input
          id="login-form-password"
          type="password"
          placeholder="Enter your password"
          {...form.register('password')}
        />
      </div>
      <Button className="w-full" type="submit">
        Log In
      </Button>
    </form>
  )
}
