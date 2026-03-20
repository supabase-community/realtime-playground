import { Check, Copy } from 'lucide-react'
import { useRef, useState } from 'react'

type Props = {
  content: string
  className?: string
  timeout?: number
}

export function CopyButton({ content, timeout, className }: Props) {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

  const handleCopy = async () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    await navigator.clipboard.writeText(content)
    setCopied(true)
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null
      setCopied(false)
    }, timeout ?? 2000)
  }
  return (
    <button onClick={handleCopy} className={`p-1 text-xs ${className}`}>
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
    </button>
  )
}
