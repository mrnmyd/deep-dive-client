import { ChevronsUpDown, X } from "lucide-react"
import * as React from "react"
import type { Control, FieldValues, Path } from "react-hook-form"

import { FormFieldWrapper } from "@/components/form/form-field-wrapper"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type MultiSelectOption = {
  label: string
  value: string
}

type FormMultiSelectProps<TFieldValues extends FieldValues> = {
  control?: Control<TFieldValues>
  description?: React.ReactNode
  disabled?: boolean
  label?: React.ReactNode
  name: Path<TFieldValues>
  options: MultiSelectOption[]
  placeholder?: string
}

function FormMultiSelect<TFieldValues extends FieldValues = FieldValues>({
  control,
  description,
  disabled,
  label,
  name,
  options,
  placeholder = "Select options",
}: FormMultiSelectProps<TFieldValues>) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")

  return (
    <FormFieldWrapper
      control={control}
      description={description}
      label={label}
      name={name}
    >
      {({ field }) => {
        const selectedValues = Array.isArray(field.value)
          ? field.value.filter(
            (value: unknown): value is string => typeof value === "string"
          )
          : []

        const filteredOptions = options.filter((option) =>
          option.label.toLowerCase().includes(query.toLowerCase())
        )

        const toggleValue = (value: string) => {
          const nextValue = selectedValues.includes(value)
            ? selectedValues.filter((item: string) => item !== value)
            : [...selectedValues, value]

          field.onChange(nextValue)
        }

        return (
          <div className="space-y-3">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={disabled}
                  className="w-full justify-between font-normal h-10"
                >
                  <span className="truncate">
                    {selectedValues.length
                      ? `${selectedValues.length} selected`
                      : placeholder}
                  </span>
                  <ChevronsUpDown className="size-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-(--radix-popover-trigger-width) p-0">
                <Command>
                  <CommandInput
                    placeholder="Search..."
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                  <CommandList>
                    {filteredOptions.length ? (
                      <CommandGroup>
                        {filteredOptions.map((option) => {
                          const selected = selectedValues.includes(option.value)

                          return (
                            <CommandItem
                              key={option.value}
                              selected={selected}
                              onClick={() => toggleValue(option.value)}
                            >
                              {option.label}
                            </CommandItem>
                          )
                        })}
                      </CommandGroup>
                    ) : (
                      <CommandEmpty>No options found.</CommandEmpty>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {selectedValues.length ? (
              <div className="flex flex-wrap gap-2">
                {selectedValues.map((value: string) => {
                  const option = options.find(
                    (item: MultiSelectOption) => item.value === value
                  )

                  return (
                    <Badge key={value} variant="secondary" className="gap-1">
                      {option?.label ?? value}
                      <button
                        type="button"
                        className="rounded-full outline-none"
                        onClick={() => toggleValue(value)}
                        disabled={disabled}
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  )
                })}
              </div>
            ) : null}
          </div>
        )
      }}
    </FormFieldWrapper>
  )
}

export { FormMultiSelect }
export type { MultiSelectOption }

