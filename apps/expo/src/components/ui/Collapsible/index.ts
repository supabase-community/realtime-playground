import { CollapsibleContent } from './CollapsibleContent'
import { CollapsibleRoot } from './Collapsible'
import { CollapsibleTrigger } from './CollapsibleTrigger'

export const Collapsible = Object.assign(CollapsibleRoot, {
  Root: CollapsibleRoot,
  Trigger: CollapsibleTrigger,
  Content: CollapsibleContent,
})
