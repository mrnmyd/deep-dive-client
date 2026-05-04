import { z } from "zod"

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const mobileRegex = /^[0-9]{10}$/

export const loginSchema = z.object({
    emailOrMobile: z
        .string()
        .trim()
        .min(1, "Email or mobile number is required")
        .refine(
            (value) => emailRegex.test(value) || mobileRegex.test(value),
            {
                message: "Enter a valid email address or 10-digit mobile number",
            }
        ),

    password: z
        .string()
        .trim()
        .min(6, "Password must be at least 6 characters"),
})

export type LoginFormInputs = z.infer<typeof loginSchema>