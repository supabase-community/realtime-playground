'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FieldLabel } from '@/components/field-label'
import { NEXT_PUBLIC_TEST_USER_EMAIL } from '@/lib/constants'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').nonoptional(),
  password: z.string().min(1, 'Password is required').nonoptional(),
})

export type LoginValues = z.infer<typeof loginSchema>

type Props = {
  onSubmit: (values: LoginValues) => void
}

export function LoginForm({ onSubmit }: Props) {
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: NEXT_PUBLIC_TEST_USER_EMAIL,
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
