import { z } from "zod"

const selectOptions = ["react", "vue", "svelte"] as const
const radioOptions = ["email", "sms", "push"] as const

export const formComponentsDemoSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters"),
  bio: z
    .string()
    .trim()
    .min(20, "Bio must be at least 20 characters"),
  framework: z.enum(selectOptions, {
    message: "Select a framework",
  }),
  termsAccepted: z
    .boolean()
    .refine((value) => value, "You must accept the terms"),
  notificationChannel: z.enum(radioOptions, {
    message: "Select a notification channel",
  }),
  marketingEnabled: z
    .boolean()
    .refine((value) => value, "Enable marketing notifications for this demo"),
  satisfactionScore: z
    .number()
    .min(30, "Move the slider to at least 30"),
  startDate: z.date({
    message: "Select a start date",
  }),
  multipleDates: z
    .array(z.date())
    .min(2, "Select at least two dates"),
  dateRange: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .refine((value) => value.from && value.to, {
      message: "Select a complete date range",
    }),
  avatar: z.custom<File>((value) => value instanceof File, {
    message: "Upload an avatar file",
  }),
  teamSize: z
    .number({
      message: "Enter a team size",
    })
    .min(1, "Team size must be at least 1")
    .max(500, "Team size must be 500 or less"),
  skills: z
    .array(z.string())
    .min(2, "Select at least two skills"),
  otp: z
    .string()
    .length(6, "Enter the 6-digit verification code"),
})

export type FormComponentsDemoValues = z.infer<typeof formComponentsDemoSchema>
