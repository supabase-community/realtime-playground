'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { buttonVariants } from './ui/button'

type Props = { enablePlayground: boolean }

export function NavLinks({ enablePlayground }: Props) {
  const pathname = usePathname()

  const links = [
    ...(enablePlayground ? [{ href: '/playground', label: 'Playground' }] : []),
    { href: '/test', label: 'Test Runner' },
  ]

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
