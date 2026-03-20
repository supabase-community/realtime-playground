import { Stack } from 'expo-router'
import * as React from 'react'

import { HeaderInfoButton } from '../components/navigation/HeaderInfoButton'
import { OptionsDialog } from '../components/navigation/OptionsDialog'
import { colors } from '../components/ui/theme'

export default function RootLayout() {
  const [infoOpen, setInfoOpen] = React.useState(false)

  return (
    <>
      <Stack
        screenOptions={{
          contentStyle: {
            backgroundColor: colors.background,
          },
          headerRight: () => <HeaderInfoButton onPress={() => setInfoOpen(true)} />,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.foreground,
          headerTitleStyle: {
            color: colors.foreground,
          },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Welcome' }} />
        <Stack.Screen name="ui-list" options={{ title: 'UI List' }} />
      </Stack>

      <OptionsDialog onOpenChange={setInfoOpen} open={infoOpen} />
    </>
  )
}
