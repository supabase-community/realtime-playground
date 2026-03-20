import * as React from 'react'
import { useFormContext, useFormState } from 'react-hook-form'

import { FormFieldContext } from './FormFieldContext'
import { FormItemContext } from './FormItemContext'

export function useFormField() {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: fieldContext.name })
  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>.')
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formDescriptionId: `${id}-description`,
    formItemId: `${id}-item`,
    formLabelId: `${id}-label`,
    formMessageId: `${id}-message`,
    ...fieldState,
  }
}
