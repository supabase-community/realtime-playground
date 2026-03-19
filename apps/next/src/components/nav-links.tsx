'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { buttonVariants } from './ui/button'
import { cn } from '@/lib/utils'

const links = [
  { href: '/playground', label: 'Playground' },
  { href: '/test', label: 'Test Runner' },
]

export function NavLinks() {
  const pathname = usePathname()

  return (
    <nav className="mb-4 flex gap-4">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            buttonVariants({
              variant: 'link',
              className: href === pathname ? 'text-primary' : 'text-foreground',
            }),
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}
