'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { type LoginValues, loginSchema, useEnv } from '@realtime-playground/realtime-core'
import { useForm } from 'react-hook-form'

import { FieldLabel } from '@/components/field-label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Props = {
  onSubmit: (values: LoginValues) => void
}

export function LoginForm({ onSubmit }: Props) {
  const { testUserEmail, testUserPassword } = useEnv()

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: testUserEmail,
      password: testUserPassword,
    },
    reValidateMode: 'onSubmit',
  })

  const handleSubmit = form.handleSubmit(onSubmit)
  const errors = form.formState.errors

  return (
    <form id="login-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2">
        <FieldLabel htmlFor="login-form-email" error={errors.email}>
          Email
        </FieldLabel>
        <FieldLabel htmlFor="login-form-password" error={errors.password}>
          Password
        </FieldLabel>
        <Input
          id="login-form-email"
          placeholder="user@example.com"
          {...form.register('email')}
          autoComplete="email"
        />

        <Input
          id="login-form-password"
          type="password"
          placeholder="Enter your password"
          {...form.register('password')}
          autoComplete="current-password"
        />
      </div>
      <Button className="w-full" type="submit">
        Log In
      </Button>
    </form>
  )
}
