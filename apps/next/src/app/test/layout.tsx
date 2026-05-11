import { Suspense } from 'react'

export default function TestLayout({ children }: { children: React.ReactNode }) {
  return <Suspense>{children}</Suspense>
}
