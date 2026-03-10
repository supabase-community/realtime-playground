'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

const links = [
  { href: '/playground', label: 'Playground' },
  { href: '/test', label: 'Test Runner' },
]

export function NavLinks() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="mb-4 flex gap-2">
      {links.map(({ href, label }) => (
        <Button
          key={href}
          size="sm"
          className={pathname === href ? 'text-primary' : ''}
          variant="ghost"
          onClick={() => router.push(href)}
        >
          {label}
        </Button>
      ))}
    </div>
  )
}
