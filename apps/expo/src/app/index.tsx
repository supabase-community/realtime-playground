import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { colors, surfaces, typography } from '../components/ui/theme'

export default function IndexScreen() {
  return (
    <SafeAreaView style={surfaces.screen} edges={['left', 'right']}>
      <View style={styles.content}>
        <Text style={typography.title}>Welcome</Text>
        <Text style={typography.muted}>
          Open the header info menu to view the Expo UI component list.
        </Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: 12,
    paddingHorizontal: 24,
  },
})
