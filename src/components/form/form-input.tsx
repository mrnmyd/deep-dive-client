import * as React from "react"
import type { Control, FieldValues, Path } from "react-hook-form"
import { Eye, EyeOff } from "lucide-react"

import { FormFieldWrapper } from "@/components/form/form-field-wrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type FormInputProps<TFieldValues extends FieldValues> = Omit<
  React.ComponentProps<typeof Input>,
  "name"
> & {
  control?: Control<TFieldValues>
  description?: React.ReactNode
  label?: React.ReactNode
  name: Path<TFieldValues>
}

function FormInput<TFieldValues extends FieldValues = FieldValues>({
  className,
  control,
  description,
  disabled,
  label,
  name,
  type = "text",
  ...props
}: FormInputProps<TFieldValues>) {
  const [showPassword, setShowPassword] = React.useState(false)
  const isPassword = type === "password"
  const resolvedType = isPassword && showPassword ? "text" : type

  return (
    <FormFieldWrapper
      control={control}
      description={description}
      label={label}
      name={name}
    >
      {({ field }) => (
        <div className="relative">
          <Input
            {...props}
            {...field}
            type={resolvedType}
            disabled={disabled}
            value={typeof field.value === "string" || typeof field.value === "number" ? field.value : ""}
            className={cn(isPassword && "pr-10", className)}
          />
          {isPassword ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="absolute top-1/2 right-1 -translate-y-1/2"
              onClick={() => setShowPassword((value) => !value)}
              disabled={disabled}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </Button>
          ) : null}
        </div>
      )}
    </FormFieldWrapper>
  )
}

export { FormInput }
