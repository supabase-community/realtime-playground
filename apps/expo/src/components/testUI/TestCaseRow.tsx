import { useEnv } from '@realtime-playground/realtime-core'
import { runTest, type Test, type TestData } from '@realtime-playground/tests'
import { SymbolView } from 'expo-symbols'
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { Button, colors, spacing, typography } from '../ui'
import { StatusBadge } from './StatusBadge'
import type { Status, TestRunnerHandle } from './shared'
import { TestResults } from './TestResults'

export const TestCaseRow = forwardRef<TestRunnerHandle, { test: Test }>(function TestCaseRow(
  { test },
  ref,
) {
  const [status, setStatus] = useState<Status>(null)
  const [data, setData] = useState<TestData | undefined>()
  const { supabaseKey, supabaseUrl, testUserEmail, testUserPassword } = useEnv()

  const prepare = useCallback(() => {
    setStatus('Running')
    setData(undefined)
  }, [])

  const handleRun = useCallback(async () => {
    prepare()
    const result = await runTest(test, supabaseUrl, supabaseKey, testUserEmail, testUserPassword)
    setData(result.data)
    const nextStatus = result.status === 'passed' ? 'Passed' : 'Failed'
    setStatus(nextStatus)
    return nextStatus
  }, [prepare, supabaseKey, supabaseUrl, testUserEmail, testUserPassword, test])

  useImperativeHandle(
    ref,
    () => ({
      handleRun,
      prepare,
    }),
    [handleRun, prepare],
  )

  return (
    <View style={styles.caseRow}>
      <View style={styles.caseHeader}>
        <View style={styles.titleRow}>
          <StatusBadge status={status} />
          <Text style={styles.caseName}>{test.name}</Text>
        </View>
        <View style={styles.caseActions}>
          <Button
            onPress={handleRun}
            disabled={status === 'Running'}
            variant="ghost"
            size="icon-sm"
          >
            <SymbolView name="play" size={14} tintColor={colors.primary} />
          </Button>
        </View>
      </View>
      {data && <TestResults data={data} />}
    </View>
  )
})

const styles = StyleSheet.create({
  caseHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
    width: '100%',
  },
  caseActions: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.xs,
  },
  caseName: {
    ...typography.label,
    textTransform: 'capitalize',
    flexShrink: 1,
  },
  caseRow: {
    borderColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: spacing.sm,
    paddingTop: spacing.md,
  },
  titleRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
    flexShrink: 1,
  },
})
