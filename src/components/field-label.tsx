import { Label } from '@/components/ui/label'
import type { FieldError } from 'react-hook-form'

type Props = {
  children: React.ReactNode
  error?: FieldError
  htmlFor?: string
  className?: string
}

export function FieldLabel({ children, error, htmlFor, className }: Props) {
  return (
    <div className="flex justify-between">
      <Label className={className} htmlFor={htmlFor}>
        {children}
      </Label>
      {error && <p className="text-destructive text-xs">{error.message}</p>}
    </div>
  )
}
