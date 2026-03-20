import { SymbolView, type SFSymbol } from 'expo-symbols'
import { Pressable, Text, View } from 'react-native'

import { colors } from '../theme'
import { dismiss } from './sonnerStore'
import { sonnerStyles } from './sonnerStyles'
import type { ToastRecord, ToastType } from './sonnerTypes'

type SonnerToastProps = {
  record: ToastRecord
  wide?: boolean
}

function iconForType(type: ToastType): SFSymbol {
  switch (type) {
    case 'success':
      return 'checkmark'
    case 'info':
      return 'info'
    case 'warning':
      return 'exclamationmark.triangle.fill'
    case 'error':
      return 'xmark'
    case 'loading':
      return 'ellipsis'
  }
}

function colorForType(type: ToastType) {
  switch (type) {
    case 'success':
      return colors.success
    case 'info':
      return colors.info
    case 'warning':
      return colors.warning
    case 'error':
      return colors.error
    case 'loading':
      return colors.mutedForeground
  }
}

export function SonnerToast({ record, wide = false }: SonnerToastProps) {
  const hasDescription = !!record.description

  return (
    <View
      style={[
        sonnerStyles.toast,
        wide ? sonnerStyles.toastWide : null,
        !hasDescription ? sonnerStyles.toastCentered : null,
      ]}
    >
      <View
        style={[
          sonnerStyles.iconContainer,
          !hasDescription ? sonnerStyles.iconContainerCentered : null,
          { backgroundColor: colorForType(record.type) },
        ]}
      >
        <SymbolView
          name={iconForType(record.type)}
          tintColor={colors.primaryForeground}
          size={12}
          weight="bold"
        />
      </View>
      <View style={[sonnerStyles.copy, !hasDescription ? sonnerStyles.copyCentered : null]}>
        <Text style={sonnerStyles.title}>{record.title}</Text>
        {record.description ? (
          <Text style={sonnerStyles.description}>{record.description}</Text>
        ) : null}
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={() => dismiss(record.id)}
        style={sonnerStyles.close}
      >
        <SymbolView name="xmark" tintColor={colors.mutedForeground} size={14} weight="semibold" />
      </Pressable>
    </View>
  )
}
