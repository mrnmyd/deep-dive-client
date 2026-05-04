import * as React from "react"
import type { Control, FieldValues, Path } from "react-hook-form"

import { FormFieldWrapper } from "@/components/form/form-field-wrapper"
import { Slider } from "@/components/ui/slider"

type FormSliderProps<TFieldValues extends FieldValues> = Omit<
  React.ComponentProps<typeof Slider>,
  "name" | "value" | "defaultValue" | "onValueChange"
> & {
  control?: Control<TFieldValues>
  description?: React.ReactNode
  label?: React.ReactNode
  name: Path<TFieldValues>
}

function FormSlider<TFieldValues extends FieldValues = FieldValues>({
  control,
  description,
  label,
  max = 100,
  min = 0,
  name,
  step = 1,
  ...props
}: FormSliderProps<TFieldValues>) {
  return (
    <FormFieldWrapper
      control={control}
      description={description}
      label={label}
      name={name}
    >
      {({ field }) => {
        const value = Array.isArray(field.value)
          ? field.value.map((item: unknown) => Number(item))
          : [Number(field.value ?? min)]

        return (
          <div className="space-y-3">
            <Slider
              {...props}
              min={min}
              max={max}
              step={step}
              value={value}
              onValueChange={(nextValue) =>
                field.onChange(Array.isArray(field.value) ? nextValue : nextValue[0])
              }
            />
            <div className="text-sm text-muted-foreground">
              {Array.isArray(field.value) ? value.join(", ") : value[0]}
            </div>
          </div>
        )
      }}
    </FormFieldWrapper>
  )
}

export { FormSlider }
