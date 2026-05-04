import * as React from "react"
import type { Control, FieldValues, Path } from "react-hook-form"

import { FormFieldWrapper } from "@/components/form/form-field-wrapper"
import { Input } from "@/components/ui/input"

type FormNumberInputProps<TFieldValues extends FieldValues> = Omit<
  React.ComponentProps<typeof Input>,
  "name" | "type" | "value" | "onChange"
> & {
  control?: Control<TFieldValues>
  description?: React.ReactNode
  label?: React.ReactNode
  name: Path<TFieldValues>
}

function FormNumberInput<TFieldValues extends FieldValues = FieldValues>({
  control,
  description,
  label,
  name,
  ...props
}: FormNumberInputProps<TFieldValues>) {
  return (
    <FormFieldWrapper
      control={control}
      description={description}
      label={label}
      name={name}
    >
      {({ field }) => (
        <Input
          {...props}
          type="number"
          value={field.value ?? ""}
          onChange={(event) => {
            const nextValue = event.target.value
            field.onChange(nextValue === "" ? undefined : Number(nextValue))
          }}
        />
      )}
    </FormFieldWrapper>
  )
}

export { FormNumberInput }
