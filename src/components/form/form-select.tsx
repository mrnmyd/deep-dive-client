import * as React from "react"
import type { Control, FieldValues, Path } from "react-hook-form"

import { FormFieldWrapper } from "@/components/form/form-field-wrapper"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type SelectOption = {
  label: string
  value: string
}

type FormSelectProps<TFieldValues extends FieldValues> = {
  control?: Control<TFieldValues>
  description?: React.ReactNode
  disabled?: boolean
  label?: React.ReactNode
  name: Path<TFieldValues>
  options: SelectOption[]
  placeholder?: string
}

function FormSelect<TFieldValues extends FieldValues = FieldValues>({
  control,
  description,
  disabled,
  label,
  name,
  options,
  placeholder,
}: FormSelectProps<TFieldValues>) {
  return (
    <FormFieldWrapper
      control={control}
      description={description}
      label={label}
      name={name}
    >
      {({ field }) => (
        <Select
          disabled={disabled}
          value={typeof field.value === "string" ? field.value : ""}
          onValueChange={field.onChange}
        >
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </FormFieldWrapper>
  )
}

export type { SelectOption }
export { FormSelect }
