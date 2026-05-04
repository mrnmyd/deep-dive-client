import * as React from "react"
import type { Control, FieldValues, Path } from "react-hook-form"

import { FormFieldWrapper } from "@/components/form/form-field-wrapper"
import { Checkbox } from "@/components/ui/checkbox"

type FormCheckboxProps<TFieldValues extends FieldValues> = {
  checkboxLabel?: React.ReactNode
  control?: Control<TFieldValues>
  description?: React.ReactNode
  disabled?: boolean
  label?: React.ReactNode
  name: Path<TFieldValues>
}

function FormCheckbox<TFieldValues extends FieldValues = FieldValues>({
  checkboxLabel,
  control,
  description,
  disabled,
  label,
  name,
}: FormCheckboxProps<TFieldValues>) {
  return (
    <FormFieldWrapper
      control={control}
      description={description}
      label={label}
      name={name}
    >
      {({ field }) => (
        <label className="flex items-center gap-3">
          <Checkbox
            checked={Boolean(field.value)}
            disabled={disabled}
            onCheckedChange={(checked) => field.onChange(Boolean(checked))}
          />
          {checkboxLabel ? <span className="text-sm">{checkboxLabel}</span> : null}
        </label>
      )}
    </FormFieldWrapper>
  )
}

export { FormCheckbox }
