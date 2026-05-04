import * as React from "react"
import type { Control, FieldValues, Path } from "react-hook-form"

import { FormFieldWrapper } from "@/components/form/form-field-wrapper"
import { Switch } from "@/components/ui/switch"

type FormSwitchProps<TFieldValues extends FieldValues> = {
  control?: Control<TFieldValues>
  description?: React.ReactNode
  disabled?: boolean
  label?: React.ReactNode
  name: Path<TFieldValues>
  switchLabel?: React.ReactNode
}

function FormSwitch<TFieldValues extends FieldValues = FieldValues>({
  control,
  description,
  disabled,
  label,
  name,
  switchLabel,
}: FormSwitchProps<TFieldValues>) {
  return (
    <FormFieldWrapper
      control={control}
      description={description}
      label={label}
      name={name}
    >
      {({ field }) => (
        <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
          {switchLabel ? <span className="text-sm">{switchLabel}</span> : <span />}
          <Switch
            checked={Boolean(field.value)}
            disabled={disabled}
            onCheckedChange={field.onChange}
          />
        </div>
      )}
    </FormFieldWrapper>
  )
}

export { FormSwitch }
