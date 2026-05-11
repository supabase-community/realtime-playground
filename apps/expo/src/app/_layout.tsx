import { Stack } from 'expo-router'

import { Toaster } from '../components/ui'
import { colors } from '../components/ui/theme'

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerTransparent: true,
          headerTitleStyle: {
            color: colors.foreground,
          },
        }}
      >
        <Stack.Screen name="index" options={{ title: '' }} />
        <Stack.Screen name="ui-list" options={{ title: 'UI List' }} />
      </Stack>
      <Toaster />
    </>
  )
}
