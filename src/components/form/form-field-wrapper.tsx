import * as React from "react"
import type {
  Control,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
} from "react-hook-form"
import { useFormContext } from "react-hook-form"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

type FormFieldWrapperProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
> = {
  children: (props: {
    field: ControllerRenderProps<TFieldValues, TName>
    fieldState: ControllerFieldState
  }) => React.ReactNode
  className?: string
  control?: Control<TFieldValues>
  description?: React.ReactNode
  label?: React.ReactNode
  name: TName
}

function FormFieldWrapper<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
>({
  children,
  className,
  control,
  description,
  label,
  name,
}: FormFieldWrapperProps<TFieldValues, TName>) {
  const form = useFormContext<TFieldValues>()
  const resolvedControl = control ?? form.control

  return (
    <FormField
      control={resolvedControl}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label ? <FormLabel>{label}</FormLabel> : null}
          <FormControl>{children({ field, fieldState })}</FormControl>
          {description ? <FormDescription>{description}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export { FormFieldWrapper }
