import { testCases } from '@realtime-playground/tests'
import { Stack, useRouter } from 'expo-router'
import { SymbolView } from 'expo-symbols'
import { useCallback, useRef, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { colors, Dialog, Screen, Spinner, spacing, typography } from '../ui'
import { StatusBadge } from './StatusBadge'
import type { Status, TestRunnerHandle } from './shared'
import { TestSectionCard } from './TestSectionCard'
import { TestSettingsPanel } from './TestSettingsPanel'

export function TestsScreenContent() {
  const router = useRouter()
  const [status, setStatus] = useState<Status>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const suiteRefs = useRef<(TestRunnerHandle | null)[]>([])

  const prepare = useCallback(() => {
    setStatus('Running')
    for (const handle of suiteRefs.current) {
      handle?.prepare()
    }
  }, [])

  const runAllTests = useCallback(async () => {
    prepare()
    let nextStatus: 'Passed' | 'Failed' = 'Passed'

    for (const handle of suiteRefs.current) {
      if (handle && (await handle.handleRun()) === 'Failed') {
        nextStatus = 'Failed'
      }
    }

    setStatus(nextStatus)
  }, [prepare])

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={styles.headerRight}>
              <Pressable
                onPress={() => {
                  router.navigate('/ui-list')
                }}
              >
                <SymbolView name="ladybug" size={20} tintColor={colors.foreground} />
              </Pressable>
              <Pressable
                onPress={() => setSettingsOpen(true)}
                style={({ pressed }) => (pressed ? styles.headerButtonPressed : null)}
              >
                <SymbolView name="gearshape" size={20} tintColor={colors.foreground} />
              </Pressable>
              <Pressable
                onPress={runAllTests}
                style={({ pressed }) => (pressed ? styles.headerButtonPressed : null)}
              >
                {status === 'Running' ? (
                  <Spinner color={colors.warning} />
                ) : (
                  <SymbolView name="play" size={20} tintColor={colors.primary} />
                )}
              </Pressable>
            </View>
          ),
        }}
      />
      <Screen style={styles.screenContent}>
        <View style={styles.screenHeader}>
          <Text style={typography.title}>Test Runner</Text>
          {status && status !== 'Running' && <StatusBadge status={status} />}
        </View>

        {Object.entries(testCases).map(([name, tests], index) => (
          <TestSectionCard
            key={name}
            name={name}
            tests={tests}
            ref={(handle) => {
              suiteRefs.current[index] = handle
            }}
          />
        ))}

        <Dialog.Root open={settingsOpen} onOpenChange={setSettingsOpen}>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Test Settings</Dialog.Title>
            </Dialog.Header>
            <TestSettingsPanel />
          </Dialog.Content>
        </Dialog.Root>
      </Screen>
    </>
  )
}

const styles = StyleSheet.create({
  headerButtonPressed: {
    opacity: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.md,
  },
  headerRightContainer: {
    paddingRight: spacing.md,
  },
  screenContent: {
    gap: spacing.lg,
    padding: spacing.lg,
  },
  screenHeader: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
})
