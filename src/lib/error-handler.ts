// lib/api/api-error.util.ts

import type { AxiosError } from "axios"
import type { FieldValues, Path, UseFormSetError } from "react-hook-form"
import { toast } from "sonner"
import { useAuthStore } from "@/stores/auth.store"
import { ROUTES } from "@/constants/routes.constant"

/**
 * Backend error shape (aligned with Spring Boot ProblemDetail)
 */
export type ProblemDetail = {
    status?: number
    detail?: string
    errors?: Record<string, string>
}

/**
 * Normalized frontend error
 */
export type AppError = {
    status: number
    message: string
    fieldErrors?: Record<string, string>
    isNetworkError?: boolean
}

/**
 * STEP 1: Normalize backend/unknown error → AppError
 */
export function normalizeError(error: unknown): AppError {
    const err = error as AxiosError<ProblemDetail>

    // Network / unknown error
    if (!err?.response) {
        return {
            status: 0,
            message: "Unable to reach server. Please check your connection.",
            isNetworkError: true,
        }
    }

    const data: ProblemDetail = err.response.data

    return {
        status: data?.status ?? err.response.status,
        message: data?.detail || "Something went wrong",
        fieldErrors: data?.errors,
    }
}

/**
 * STEP 2: Global handler (decides behavior)
 */
export function handleApiError(error: AppError) {
    // Unauthorized → logout + redirect
    if (error.status === 401) {
        useAuthStore.getState().setUnauthenticated()
        window.location.href = ROUTES.AUTH.LOGIN
        return
    }

    // Validation errors → handled by form, no toast
    if (error.fieldErrors) {
        return
    }

    // Network error
    if (error.isNetworkError) {
        toast.error(error.message)
        return
    }

    // Default fallback
    toast.error(error.message)
}

/**
 * STEP 3: Apply errors to React Hook Form
 */
export function applyFormErrors<T extends FieldValues>(
    error: AppError,
    setError: UseFormSetError<T>
) {
    // Field-level errors
    if (error.fieldErrors) {
        Object.entries(error.fieldErrors).forEach(([field, message]) => {
            setError(field as Path<T>, {
                type: "server",
                message,
            })
        })
        return
    }

    // Global form error
    setError("root" as Path<T>, {
        type: "server",
        message: error.message,
    })
}

export function handleMutationError<T extends FieldValues>(
    err: unknown,
    setError?: UseFormSetError<T>
) {
    const error = normalizeError(err)

    // Case 1: Form error + form handler exists
    if (error.fieldErrors && setError) {
        applyFormErrors(error, setError)
        return
    }

    // Case 2: Form error but no form → show message
    if (error.fieldErrors && !setError) {
        const message = Object.values(error.fieldErrors).join(", ")
        handleApiError({ ...error, message })
        return
    }

    // Case 3: All other errors
    handleApiError(error)
}
