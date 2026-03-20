import * as React from 'react'
import { View, type ViewProps } from 'react-native'

import { FormItemContext } from './FormItemContext'

export function FormItem({ style, ...props }: ViewProps) {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <View style={[{ gap: 8 }, style]} {...props} />
    </FormItemContext.Provider>
  )
}
