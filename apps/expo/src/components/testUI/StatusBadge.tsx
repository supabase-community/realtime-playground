import { type SFSymbol, SymbolView } from 'expo-symbols'

import { colors } from '../ui'
import type { Status } from './shared'

type StatusBadgeProps = {
  status: Status
}

function configForStatus(status: Status): { color: string; name: SFSymbol } {
  switch (status) {
    case 'Passed':
      return { color: colors.success, name: 'checkmark.circle.fill' }
    case 'Failed':
      return { color: colors.error, name: 'xmark.circle.fill' }
    case 'Running':
      return { color: colors.info, name: 'hourglass' }
    default:
      return { color: colors.mutedForeground, name: 'hourglass' }
  }
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { color, name } = configForStatus(status)

  return <SymbolView name={name} size={18} tintColor={color} />
}
