import * as React from "react"
import type { Control, FieldValues, Path } from "react-hook-form"

import { FormFieldWrapper } from "@/components/form/form-field-wrapper"
import { Input } from "@/components/ui/input"

type FormOTPInputProps<TFieldValues extends FieldValues> = {
  control?: Control<TFieldValues>
  description?: React.ReactNode
  disabled?: boolean
  label?: React.ReactNode
  length: number
  name: Path<TFieldValues>
}

function FormOTPInput<TFieldValues extends FieldValues = FieldValues>({
  control,
  description,
  disabled,
  label,
  length,
  name,
}: FormOTPInputProps<TFieldValues>) {
  const inputRefs = React.useRef<Array<HTMLInputElement | null>>([])

  return (
    <FormFieldWrapper
      control={control}
      description={description}
      label={label}
      name={name}
    >
      {({ field }) => {
        const value = typeof field.value === "string" ? field.value : ""
        const slots = Array.from({ length }, (_, index) => value[index] ?? "")

        const updateValue = (index: number, nextChar: string) => {
          const normalizedChar = nextChar.replace(/\s+/g, "").slice(-1)
          const nextSlots = [...slots]
          nextSlots[index] = normalizedChar
          field.onChange(nextSlots.join(""))

          if (normalizedChar && index < length - 1) {
            inputRefs.current[index + 1]?.focus()
          }
        }

        return (
          <div className="flex gap-2">
            {slots.map((slotValue, index) => (
              <Input
                key={index}
                ref={(element) => {
                  inputRefs.current[index] = element
                }}
                inputMode="numeric"
                maxLength={1}
                disabled={disabled}
                className="h-10 w-10 text-center"
                value={slotValue}
                onChange={(event) => updateValue(index, event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Backspace" && !slots[index] && index > 0) {
                    inputRefs.current[index - 1]?.focus()
                  }
                }}
              />
            ))}
          </div>
        )
      }}
    </FormFieldWrapper>
  )
}

export { FormOTPInput }
