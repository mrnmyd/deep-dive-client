import * as React from "react"
import { useForm } from "react-hook-form"

import {
  FormCheckbox,
  FormDatePicker,
  FormFileUpload,
  FormInput,
  FormMultiSelect,
  FormNumberInput,
  FormOTPInput,
  FormRadioGroup,
  FormSelect,
  FormSlider,
  FormSwitch,
  FormTextarea,
} from "@/components/form"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import {
  formComponentsDemoSchema,
  type FormComponentsDemoValues,
} from "@/features/form-demo/schemas/form-demo.schema"
import { zodResolver } from "@/lib/zod-resolver"
import { toast } from "sonner"

const frameworkOptions = [
  { label: "React", value: "react" },
  { label: "Vue", value: "vue" },
  { label: "Svelte", value: "svelte" },
]

const notificationOptions = [
  {
    label: "Email",
    value: "email",
    description: "Send release updates and system alerts by email.",
  },
  {
    label: "SMS",
    value: "sms",
    description: "Use SMS for urgent alerts and verification messages.",
  },
  {
    label: "Push Notification",
    value: "push",
    description: "Deliver updates directly to the user dashboard and app.",
  },
]

const skillOptions = [
  { label: "TypeScript", value: "typescript" },
  { label: "React Hook Form", value: "react-hook-form" },
  { label: "Zod", value: "zod" },
  { label: "Tailwind CSS", value: "tailwindcss" },
  { label: "Shadcn UI", value: "shadcn-ui" },
]

const defaultValues: Partial<FormComponentsDemoValues> = {
  avatar: undefined,
  bio: "",
  email: "",
  framework: undefined,
  dateRange: undefined,
  marketingEnabled: false,
  multipleDates: [],
  notificationChannel: undefined,
  otp: "",
  password: "",
  satisfactionScore: 10,
  skills: [],
  startDate: undefined,
  teamSize: undefined,
  termsAccepted: false,
}

export function FormComponentsDemoPage() {
  const [submittedValues, setSubmittedValues] =
    React.useState<FormComponentsDemoValues | null>(null)

  const form = useForm<FormComponentsDemoValues>({
    defaultValues,
    resolver: zodResolver(formComponentsDemoSchema),
  })

  const onSubmit = (values: FormComponentsDemoValues) => {
    setSubmittedValues(values)
  }

  React.useEffect(() => {
    toast.success("Toaster test!")
  }, [])

  return (
    <div className="min-h-screen bg-muted/30 px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Form Components Demo
          </h1>
          <p className="max-w-3xl text-sm text-muted-foreground">
            Reference page for the reusable form components. Submit with empty or
            invalid values to verify that the shared RHF and Zod wiring surfaces
            field errors correctly.
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-6 rounded-2xl border border-border bg-background p-6 shadow-sm lg:grid-cols-2"
            noValidate
          >
            <FormInput<FormComponentsDemoValues>
              name="email"
              label="Email"
              placeholder="jane@company.com"
            />

            <FormInput<FormComponentsDemoValues>
              name="password"
              label="Password"
              type="password"
              placeholder="Enter a strong password"
            />

            <div className="lg:col-span-2">
              <FormTextarea<FormComponentsDemoValues>
                name="bio"
                label="Bio"
                placeholder="Tell us a bit about your team and use case"
                description="Minimum 20 characters."
              />
            </div>

            <FormSelect<FormComponentsDemoValues>
              name="framework"
              label="Preferred Framework"
              placeholder="Select a framework"
              options={frameworkOptions}
            />

            <FormNumberInput<FormComponentsDemoValues>
              name="teamSize"
              label="Team Size"
              placeholder="25"
              min={1}
              max={500}
              step={1}
            />

            <FormRadioGroup<FormComponentsDemoValues>
              name="notificationChannel"
              label="Notification Channel"
              options={notificationOptions}
            />

            <FormDatePicker<FormComponentsDemoValues>
              name="startDate"
              label="Project Start Date"
              placeholder="Choose a date"
            />

            <FormDatePicker<FormComponentsDemoValues>
              name="multipleDates"
              label="Milestone Dates"
              mode="multiple"
              placeholder="Choose multiple dates"
            />

            <div className="lg:col-span-2">
              <FormDatePicker<FormComponentsDemoValues>
                name="dateRange"
                label="Launch Window"
                mode="range"
                placeholder="Choose a date range"
                numberOfMonths={2}
              />
            </div>

            <FormSlider<FormComponentsDemoValues>
              name="satisfactionScore"
              label="Satisfaction Score"
              min={0}
              max={100}
              step={10}
              description="Set this to at least 30 to pass validation."
            />

            <div className="lg:col-span-2">
              <FormMultiSelect<FormComponentsDemoValues>
                name="skills"
                label="Core Skills"
                placeholder="Select at least two skills"
                options={skillOptions}
              />
            </div>

            <FormCheckbox<FormComponentsDemoValues>
              name="termsAccepted"
              label="Terms"
              checkboxLabel="I agree to the scaffold terms and validation rules."
            />

            <FormSwitch<FormComponentsDemoValues>
              name="marketingEnabled"
              label="Marketing Notifications"
              switchLabel="Enable demo marketing notifications"
            />

            <div className="lg:col-span-2">
              <FormFileUpload<FormComponentsDemoValues>
                name="avatar"
                label="Avatar Upload"
                accept="image/png,image/jpeg,image/webp"
                imagePreview
                description="Upload an image to test file validation and preview rendering."
              />
            </div>

            <div className="lg:col-span-2">
              <FormOTPInput<FormComponentsDemoValues>
                name="otp"
                label="Verification Code"
                length={6}
                description="Enter the 6-digit OTP code."
              />
            </div>

            <div className="lg:col-span-2 flex items-center gap-3">
              <Button type="submit">Submit Demo Form</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset(defaultValues)
                  setSubmittedValues(null)
                }}
              >
                Reset
              </Button>
            </div>
          </form>
        </Form>

        <section className="rounded-2xl border border-border bg-background p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Submitted Values</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            This stays empty until the form passes validation.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-xl bg-muted p-4 text-xs">
            {submittedValues
              ? JSON.stringify(submittedValues, null, 2)
              : "No successful submission yet."}
          </pre>
        </section>
      </div>
    </div>
  )
}
