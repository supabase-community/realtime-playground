import React, { useEffect } from 'react'
import { StyleProp, StyleSheet, ViewProps, ViewStyle } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'

import { colors, radii } from './theme'

type SkeletonProps = ViewProps & {
  style?: StyleProp<ViewStyle>
}

export function Skeleton({ style, ...props }: SkeletonProps) {
  const opacity = useSharedValue(0.45)

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.95, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.45, { duration: 700, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
    )
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  return <Animated.View style={[styles.base, animatedStyle, style]} {...props} />
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.accent,
    borderRadius: radii.md,
  },
})
