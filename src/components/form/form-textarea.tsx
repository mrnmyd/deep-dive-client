import * as React from "react"
import type { Control, FieldValues, Path } from "react-hook-form"

import { FormFieldWrapper } from "@/components/form/form-field-wrapper"
import { Textarea } from "@/components/ui/textarea"

type FormTextareaProps<TFieldValues extends FieldValues> = Omit<
  React.ComponentProps<typeof Textarea>,
  "name"
> & {
  control?: Control<TFieldValues>
  description?: React.ReactNode
  label?: React.ReactNode
  name: Path<TFieldValues>
}

function FormTextarea<TFieldValues extends FieldValues = FieldValues>({
  control,
  description,
  label,
  name,
  ...props
}: FormTextareaProps<TFieldValues>) {
  return (
    <FormFieldWrapper
      control={control}
      description={description}
      label={label}
      name={name}
    >
      {({ field }) => <Textarea {...props} {...field} value={field.value ?? ""} />}
    </FormFieldWrapper>
  )
}

export { FormTextarea }
