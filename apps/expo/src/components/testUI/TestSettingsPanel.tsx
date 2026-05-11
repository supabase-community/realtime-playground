import { useEnv } from '@realtime-playground/realtime-core'
import { StyleSheet, Text, View } from 'react-native'

import { Input, Label, spacing, typography } from '../ui'

export function TestSettingsPanel() {
  const { setSupabaseKey, setSupabaseUrl, supabaseKey, supabaseUrl } = useEnv()

  return (
    <View style={styles.formStack}>
      <View style={styles.field}>
        <Label>Supabase URL</Label>
        <Input value={supabaseUrl} onChangeText={setSupabaseUrl} autoCapitalize="none" />
      </View>
      <View style={styles.field}>
        <Label>Supabase Key</Label>
        <Input value={supabaseKey} onChangeText={setSupabaseKey} autoCapitalize="none" />
      </View>
      <Text style={typography.muted}>All suites use this connection.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  field: {
    gap: spacing.xs,
  },
  formStack: {
    gap: spacing.md,
  },
})
