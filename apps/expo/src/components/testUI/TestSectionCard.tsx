import type { Test } from '@realtime-playground/tests'
import { SymbolView } from 'expo-symbols'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { Button, Card, colors, spacing } from '../ui'
import { StatusBadge } from './StatusBadge'
import type { Status, TestRunnerHandle } from './shared'
import { TestCaseRow } from './TestCaseRow'

type TestSectionCardProps = {
  name: string
  tests: Test[]
}

export const TestSectionCard = forwardRef<TestRunnerHandle, TestSectionCardProps>(
  function TestSectionCard({ name, tests }, ref) {
    const [open, setOpen] = useState(true)
    const [status, setStatus] = useState<Status>(null)
    const testCaseRefs = useRef<(TestRunnerHandle | null)[]>([])

    useEffect(() => {
      if (status === 'Passed') {
        setOpen(false)
        return
      }

      if (status === 'Running' || status === null) {
        setOpen(true)
      }
    }, [status])

    const prepare = useCallback(() => {
      setStatus('Running')
      for (const handle of testCaseRefs.current) {
        handle?.prepare()
      }
    }, [])

    const handleRun = useCallback(async () => {
      prepare()
      let nextStatus: 'Passed' | 'Failed' = 'Passed'
      for (const handle of testCaseRefs.current) {
        if (handle && (await handle.handleRun()) === 'Failed') {
          nextStatus = 'Failed'
        }
      }
      setStatus(nextStatus)
      return nextStatus
    }, [prepare])

    useImperativeHandle(
      ref,
      () => ({
        handleRun,
        prepare,
      }),
      [handleRun, prepare],
    )

    return (
      <Card collapsible onOpenChange={setOpen} open={open} style={styles.sectionCard}>
        <Card.Header>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.titleRow}>
              <StatusBadge status={status} />
              <Card.Title>{name}</Card.Title>
            </View>
            <View style={styles.caseActions}>
              <Card.Trigger hitSlop={8} style={styles.collapseTrigger}>
                <SymbolView
                  name={open ? 'chevron.down' : 'chevron.right'}
                  size={14}
                  tintColor={colors.mutedForeground}
                />
              </Card.Trigger>
              <Button
                onPress={() => void handleRun()}
                disabled={status === 'Running'}
                size="icon"
                variant="ghost"
              >
                <SymbolView
                  name={status === 'Running' ? 'gearshape' : 'play'}
                  size={16}
                  tintColor={colors.primary}
                  animationSpec={
                    status === 'Running'
                      ? {
                          repeating: true,
                          speed: 0.5,
                          effect: {
                            type: 'pulse',
                            wholeSymbol: true,
                          },
                        }
                      : undefined
                  }
                />
              </Button>
            </View>
          </View>
        </Card.Header>
        <Card.CollapsibleContent style={styles.sectionBody}>
          {tests.map((test, index) => (
            <TestCaseRow
              key={test.name}
              test={test}
              ref={(handle) => {
                testCaseRefs.current[index] = handle
              }}
            />
          ))}
        </Card.CollapsibleContent>
      </Card>
    )
  },
)

const styles = StyleSheet.create({
  caseActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  collapseTrigger: {
    alignItems: 'center',
    borderRadius: 8,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  sectionBody: {
    gap: spacing.sm,
  },
  sectionCard: {
    overflow: 'hidden',
  },
  sectionHeaderRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
})
