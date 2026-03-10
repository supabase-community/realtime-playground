import { Spinner } from '@/components/ui/spinner'

export default function PageLoading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner className="size-12" />
    </div>
  )
}
