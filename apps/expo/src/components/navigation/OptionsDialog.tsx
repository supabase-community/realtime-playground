import { Link } from 'expo-router'
import { SymbolView } from 'expo-symbols'
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'

import { Dialog } from '../ui'
import { colors, radii, typography } from '../ui/theme'

type OptionsDialogProps = {
  onOpenChange: (open: boolean) => void
  open: boolean
}

const items = [
  {
    href: '/ui-list',
    icon: {
      ios: 'list.bullet',
      android: 'list',
      web: 'list',
    },
    label: 'Open UI list screen',
  },
] as const

export function OptionsDialog({ onOpenChange, open }: OptionsDialogProps) {
  return (
    <Dialog.Root onOpenChange={onOpenChange} open={open}>
      <Dialog.Content showCloseButton={false}>
        <Dialog.Header>
          <Dialog.Title>Options</Dialog.Title>
        </Dialog.Header>

        <FlatList
          contentContainerStyle={styles.listContent}
          data={items}
          keyExtractor={(item) => item.href}
          renderItem={({ item }) => (
            <Link asChild href={item.href}>
              <Pressable
                accessibilityRole="button"
                onPress={() => onOpenChange(false)}
                style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
              >
                <View style={styles.itemContent}>
                  <SymbolView
                    fallback={null}
                    name={item.icon}
                    size={18}
                    tintColor={colors.foreground}
                    weight="medium"
                  />
                  <Text style={styles.itemLabel}>{item.label}</Text>
                </View>
              </Pressable>
            </Link>
          )}
          scrollEnabled={false}
        />

        <Dialog.Footer showCloseButton />
      </Dialog.Content>
    </Dialog.Root>
  )
}

const styles = StyleSheet.create({
  item: {
    borderRadius: radii.md,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  itemContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  itemLabel: {
    ...typography.body,
    textAlign: 'right',
  },
  itemPressed: {
    backgroundColor: colors.secondary,
    opacity: 0.85,
  },
  listContent: {
    gap: 8,
  },
})
