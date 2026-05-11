import type { TestData } from '@realtime-playground/tests'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

import { colors, spacing } from '../ui'

export function TestResults({ data }: { data: TestData }) {
  if (data.type === 'normal') {
    return <Text style={styles.monoText}>{data.message}</Text>
  }

  return (
    <ScrollView
      horizontal
      contentContainerStyle={styles.metricList}
      showsHorizontalScrollIndicator={false}
    >
      {data.metrics.map((metric) => (
        <MetricCard
          key={metric.label}
          label={metric.label}
          value={metric.value}
          unit={metric.unit}
        />
      ))}
    </ScrollView>
  )
}

interface MetricCardProps {
  label: string
  value: number
  unit: string
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, unit }) => (
  <View style={styles.metricCard}>
    <Text style={styles.metricLabel}>{label}</Text>
    <Text style={styles.metricValue}>
      {value.toFixed(2)}
      <Text style={styles.metricUnit}> {unit}</Text>
    </Text>
  </View>
)

const styles = StyleSheet.create({
  metricList: {
    gap: spacing.xs,
  },
  metricCard: {
    backgroundColor: colors.secondary,
    borderColor: colors.border,
    borderWidth: StyleSheet.hairlineWidth,
    gap: spacing.xs,
    minWidth: 92,
    padding: spacing.xs,
  },
  metricLabel: {
    fontSize: 10,
    color: colors.mutedForeground,
    textTransform: 'uppercase',
  },
  metricUnit: {
    color: colors.mutedForeground,
    fontSize: 10,
  },
  metricValue: {
    color: colors.foreground,
    fontSize: 12,
    fontWeight: '500',
  },
  monoText: {
    color: colors.foreground,
    fontFamily: 'Courier',
    fontSize: 12,
    lineHeight: 18,
  },
})
