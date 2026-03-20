import { composeEventHandlers } from '../utils'
import { ClonePressable, type TriggerProps } from './ClonePressable'
import { useDialogContext } from './DialogContext'

export function DialogTrigger({ children, onPress, ...props }: TriggerProps) {
  const { open, setOpen } = useDialogContext()

  return (
    <ClonePressable
      accessibilityRole="button"
      accessibilityState={{ expanded: open }}
      onPress={composeEventHandlers(onPress, () => setOpen(true))}
      {...props}
    >
      {children}
    </ClonePressable>
  )
}
