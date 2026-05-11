import { redirect } from 'next/navigation'
import { ENABLE_PLAYGROUND } from '@/lib/constants'

export default function PlaygroundLayout({ children }: { children: React.ReactNode }) {
  if (!ENABLE_PLAYGROUND) redirect('/test')
  return <>{children}</>
}
