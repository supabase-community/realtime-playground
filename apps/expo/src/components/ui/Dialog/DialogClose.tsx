import { composeEventHandlers } from '../utils'
import { ClonePressable, type TriggerProps } from './ClonePressable'
import { useDialogContext } from './DialogContext'

export function DialogClose({ children, onPress, ...props }: TriggerProps) {
  const { setOpen } = useDialogContext()

  return (
    <ClonePressable onPress={composeEventHandlers(onPress, () => setOpen(false))} {...props}>
      {children}
    </ClonePressable>
  )
}
