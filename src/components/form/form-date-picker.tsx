import * as React from "react"
import { format } from "date-fns"
import type { Control, FieldValues, Path } from "react-hook-form"
import type { DateRange } from "react-day-picker"
import { CalendarIcon } from "lucide-react"

import { FormFieldWrapper } from "@/components/form/form-field-wrapper"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type CalendarBaseProps = Omit<
  React.ComponentProps<typeof Calendar>,
  "mode" | "onSelect" | "selected" | "disabled"
>

type BaseFormDatePickerProps<TFieldValues extends FieldValues> = CalendarBaseProps & {
  control?: Control<TFieldValues>
  description?: React.ReactNode
  disabled?: boolean
  label?: React.ReactNode
  name: Path<TFieldValues>
  placeholder?: string
  triggerClassName?: string
}

type SingleDatePickerProps<TFieldValues extends FieldValues> =
  BaseFormDatePickerProps<TFieldValues> & {
    mode?: "single"
  }

type MultipleDatePickerProps<TFieldValues extends FieldValues> =
  BaseFormDatePickerProps<TFieldValues> & {
    mode: "multiple"
  }

type RangeDatePickerProps<TFieldValues extends FieldValues> =
  BaseFormDatePickerProps<TFieldValues> & {
    mode: "range"
  }

type FormDatePickerProps<TFieldValues extends FieldValues> =
  | SingleDatePickerProps<TFieldValues>
  | MultipleDatePickerProps<TFieldValues>
  | RangeDatePickerProps<TFieldValues>

function isDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime())
}

function isDateArray(value: unknown): value is Date[] {
  return Array.isArray(value) && value.every((item) => isDate(item))
}

function isDateRange(value: unknown): value is DateRange {
  if (!value || typeof value !== "object") {
    return false
  }

  const candidate = value as { from?: unknown; to?: unknown }

  return (
    ("from" in candidate || "to" in candidate) &&
    (candidate.from === undefined || isDate(candidate.from)) &&
    (candidate.to === undefined || isDate(candidate.to))
  )
}

function formatTriggerValue(
  mode: "single" | "multiple" | "range",
  value: Date | Date[] | DateRange | undefined,
  placeholder: string
) {
  if (mode === "multiple") {
    if (!Array.isArray(value) || value.length === 0) {
      return placeholder
    }

    if (value.length === 1) {
      return format(value[0], "PPP")
    }

    return `${value.length} dates selected`
  }

  if (mode === "range") {
    if (!value || Array.isArray(value) || value instanceof Date) {
      return placeholder
    }

    if (value.from && value.to) {
      return `${format(value.from, "PPP")} - ${format(value.to, "PPP")}`
    }

    if (value.from) {
      return format(value.from, "PPP")
    }

    return placeholder
  }

  if (value instanceof Date) {
    return format(value, "PPP")
  }

  return placeholder
}

function FormDatePicker<TFieldValues extends FieldValues = FieldValues>({
  control,
  description,
  disabled,
  label,
  name,
  placeholder = "Pick a date",
  triggerClassName,
  mode = "single",
  ...calendarProps
}: FormDatePickerProps<TFieldValues>) {
  return (
    <FormFieldWrapper
      control={control}
      description={description}
      label={label}
      name={name}
    >
      {({ field }) => {
        const rawValue = field.value as unknown

        const selectedValue =
          mode === "multiple"
            ? isDateArray(rawValue)
              ? rawValue
              : undefined
            : mode === "range"
              ? isDateRange(rawValue)
                ? rawValue
                : undefined
              : isDate(rawValue)
                ? rawValue
                : undefined

        const buttonLabel = formatTriggerValue(mode, selectedValue, placeholder)

        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                disabled={disabled}
                className={cn(
                  "h-10 w-full justify-between font-normal",
                  !selectedValue && "text-muted-foreground",
                  triggerClassName
                )}
              >
                <span className="truncate">{buttonLabel}</span>
                <CalendarIcon className="size-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-3">
              {mode === "multiple" ? (
                <Calendar
                  {...calendarProps}
                  mode="multiple"
                  disabled={disabled}
                  selected={isDateArray(selectedValue) ? selectedValue : undefined}
                  onSelect={field.onChange}
                  className={cn("rounded-lg border", calendarProps.className)}
                />
              ) : mode === "range" ? (
                <Calendar
                  {...calendarProps}
                  mode="range"
                  disabled={disabled}
                  selected={isDateRange(selectedValue) ? selectedValue : undefined}
                  onSelect={field.onChange}
                  className={cn("rounded-lg border", calendarProps.className)}
                />
              ) : (
                <Calendar
                  {...calendarProps}
                  mode="single"
                  disabled={disabled}
                  selected={isDate(selectedValue) ? selectedValue : undefined}
                  onSelect={field.onChange}
                  className={cn("rounded-lg border", calendarProps.className)}
                />
              )}
            </PopoverContent>
          </Popover>
        )
      }}
    </FormFieldWrapper>
  )
}

export { FormDatePicker }
export type {
  FormDatePickerProps,
  MultipleDatePickerProps,
  RangeDatePickerProps,
  SingleDatePickerProps,
}
