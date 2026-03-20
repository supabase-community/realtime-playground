import type { ExpoConfig } from 'expo/config'
import { loadRootEnv } from '../../scripts/load-root-env.mjs'

loadRootEnv()

const config: ExpoConfig = {
  name: 'expo-example',
  slug: 'expo-example',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  scheme: 'realtime-playground',
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  plugins: ['expo-router', 'expo-font'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.supabase.realtimeplayground',
  },
  android: {
    package: 'com.supabase.realtimeplayground',
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundImage: './assets/android-icon-background.png',
      monochromeImage: './assets/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    favicon: './assets/favicon.png',
  },
  extra: {
    PUBLIC_REALTIME_URL: process.env.PUBLIC_REALTIME_URL ?? '',
    PUBLIC_SUPABASE_URL: process.env.PUBLIC_SUPABASE_URL ?? '',
    PUBLIC_TEST_USER_EMAIL: process.env.PUBLIC_TEST_USER_EMAIL ?? '',
    PUBLIC_SUPABASE_KEY: process.env.PUBLIC_SUPABASE_KEY ?? '',
  },
}

export default config
