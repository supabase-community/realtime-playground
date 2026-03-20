import { View, type ViewProps } from 'react-native'

export function SelectGroup({ children, ...props }: ViewProps) {
  return <View {...props}>{children}</View>
}
