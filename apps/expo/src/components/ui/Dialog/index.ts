import { DialogRoot } from './Dialog'
import { DialogClose } from './DialogClose'
import { DialogContent } from './DialogContent'
import { DialogDescription } from './DialogDescription'
import { DialogFooter } from './DialogFooter'
import { DialogHeader } from './DialogHeader'
import { DialogOverlay } from './DialogOverlay'
import { DialogPortal } from './DialogPortal'
import { DialogTitle } from './DialogTitle'
import { DialogTrigger } from './DialogTrigger'

export const Dialog = Object.assign(DialogRoot, {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Portal: DialogPortal,
  Close: DialogClose,
  Overlay: DialogOverlay,
  Content: DialogContent,
  Header: DialogHeader,
  Footer: DialogFooter,
  Title: DialogTitle,
  Description: DialogDescription,
})
