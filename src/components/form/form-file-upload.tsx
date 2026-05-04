import * as React from "react"
import type { Control, FieldValues, Path } from "react-hook-form"
import { ImageIcon, Upload } from "lucide-react"

import { FormFieldWrapper } from "@/components/form/form-field-wrapper"
import { Input } from "@/components/ui/input"

type FormFileUploadProps<TFieldValues extends FieldValues> = Omit<
  React.ComponentProps<typeof Input>,
  "name" | "type" | "value" | "onChange"
> & {
  control?: Control<TFieldValues>
  description?: React.ReactNode
  imagePreview?: boolean
  label?: React.ReactNode
  name: Path<TFieldValues>
}

function FormFileUpload<TFieldValues extends FieldValues = FieldValues>({
  accept,
  control,
  description,
  disabled,
  imagePreview = false,
  label,
  name,
  ...props
}: FormFileUploadProps<TFieldValues>) {
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)

  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  return (
    <FormFieldWrapper
      control={control}
      description={description}
      label={label}
      name={name}
    >
      {({ field }) => {
        const rawValue = field.value as unknown
        const file = rawValue instanceof File ? rawValue : null

        const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          const nextFile = event.target.files?.[0] ?? null
          field.onChange(nextFile)

          if (previewUrl) {
            URL.revokeObjectURL(previewUrl)
          }

          if (imagePreview && nextFile?.type.startsWith("image/")) {
            setPreviewUrl(URL.createObjectURL(nextFile))
            return
          }

          setPreviewUrl(null)
        }

        return (
          <div className="space-y-3">
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border px-4 py-6 text-center">
              <Upload className="mb-2 size-5 text-muted-foreground" />
              <span className="text-sm font-medium">
                {file ? file.name : "Choose a file"}
              </span>
              <span className="text-xs text-muted-foreground">
                {accept ?? "Any file type"}
              </span>
              <Input
                {...props}
                accept={accept}
                disabled={disabled}
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            {imagePreview && previewUrl ? (
              <img
                src={previewUrl}
                alt={file?.name ?? "Selected preview"}
                className="max-h-48 rounded-lg border border-border object-cover"
              />
            ) : file ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ImageIcon className="size-4" />
                <span>{file.name}</span>
              </div>
            ) : null}
          </div>
        )
      }}
    </FormFieldWrapper>
  )
}

export { FormFileUpload }
