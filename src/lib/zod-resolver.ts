import type { FieldErrors, FieldValues, Resolver } from "react-hook-form"
import type { ZodError } from "zod"

function setFieldError(
  errors: FieldErrors<FieldValues>,
  path: string,
  message: string
) {
  errors[path] = {
    message,
    type: "manual",
  }
}

export function zodResolver<TFieldValues extends FieldValues>(
  schema: {
    safeParseAsync: (
      values: unknown
    ) => Promise<
      | { success: true; data: TFieldValues }
      | { success: false; error: ZodError<TFieldValues> }
    >
  }
): Resolver<TFieldValues> {
  return (async (values) => {
    const result = await schema.safeParseAsync(values)

    if (result.success) {
      return {
        errors: {},
        values: result.data,
      }
    }

    const errors: FieldErrors<FieldValues> = {}

    for (const issue of result.error.issues) {
      const path = issue.path.join(".")

      if (!path || errors[path]) {
        continue
      }

      setFieldError(errors, path, issue.message)
    }

    return {
      errors: errors as FieldErrors<TFieldValues>,
      values: {} as TFieldValues,
    }
  }) as Resolver<TFieldValues>
}
