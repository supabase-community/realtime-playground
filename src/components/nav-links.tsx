'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
          className={`m-auto rounded-sm px-3 py-1.5 text-sm font-semibold ${
            pathname === href
              ? 'text-primary border-primary border'
              : 'text-foreground border-foreground hover:border'
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}
