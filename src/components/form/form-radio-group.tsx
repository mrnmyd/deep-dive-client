import * as React from "react"
import type { Control, FieldValues, Path } from "react-hook-form"

import { FormFieldWrapper } from "@/components/form/form-field-wrapper"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type RadioOption = {
  description?: string
  label: string
  value: string
}

type FormRadioGroupProps<TFieldValues extends FieldValues> = {
  control?: Control<TFieldValues>
  description?: React.ReactNode
  disabled?: boolean
  label?: React.ReactNode
  name: Path<TFieldValues>
  options: RadioOption[]
}

function FormRadioGroup<TFieldValues extends FieldValues = FieldValues>({
  control,
  description,
  disabled,
  label,
  name,
  options,
}: FormRadioGroupProps<TFieldValues>) {
  return (
    <FormFieldWrapper
      control={control}
      description={description}
      label={label}
      name={name}
    >
      {({ field }) => (
        <RadioGroup
          disabled={disabled}
          onValueChange={field.onChange}
          value={typeof field.value === "string" ? field.value : ""}
        >
          {options.map((option) => (
            <label key={option.value} className="flex items-start gap-3 rounded-lg border border-border p-3">
              <RadioGroupItem value={option.value} />
              <div className="space-y-1">
                <div className="text-sm font-medium">{option.label}</div>
                {option.description ? (
                  <div className="text-sm text-muted-foreground">{option.description}</div>
                ) : null}
              </div>
            </label>
          ))}
        </RadioGroup>
      )}
    </FormFieldWrapper>
  )
}

export type { RadioOption }
export { FormRadioGroup }
