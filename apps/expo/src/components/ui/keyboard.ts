import { type KeyboardAvoidingViewProps, Platform, type ScrollViewProps } from 'react-native'

export function getKeyboardAvoidingBehavior(): KeyboardAvoidingViewProps['behavior'] {
  if (Platform.OS === 'ios') {
    return 'padding'
  }

  return 'position'
}

export function getKeyboardDismissMode(): ScrollViewProps['keyboardDismissMode'] {
  if (Platform.OS === 'ios') {
    return 'interactive'
  }

  return 'on-drag'
}
