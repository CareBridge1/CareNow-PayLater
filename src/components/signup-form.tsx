import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

interface SignupFormProps extends React.ComponentProps<"form"> {
  hospitalName: string
  setHospitalName: (val: string) => void
  email: string
  setEmail: (val: string) => void
  password: string
  setPassword: (val: string) => void
  loading: boolean
  onSubmit: (e: React.FormEvent) => void
  onToggleAuth: () => void
}

export function SignupForm({
  className,
  hospitalName,
  setHospitalName,
  email,
  setEmail,
  password,
  setPassword,
  loading,
  onSubmit,
  onToggleAuth,
  ...props
}: SignupFormProps) {
  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={onSubmit} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold font-heading uppercase tracking-wider">Join CareNow</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Empower your patients with flexible payments
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="hospitalName">Hospital Name</FieldLabel>
          <Input
            id="hospitalName"
            type="text"
            placeholder="St. Nicholas Hospital"
            required
            className="bg-background"
            value={hospitalName}
            onChange={(e) => setHospitalName(e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="admin@hospital.com"
            required
            className="bg-background"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            required
            className="bg-background"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FieldDescription>
            Choose a strong password for your portal.
          </FieldDescription>
        </Field>
        <Field>
          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Partner With Us
          </Button>
        </Field>
        <Field>
          <FieldDescription className="px-6 text-center">
            Already a partner?{" "}
            <button 
              type="button"
              onClick={onToggleAuth}
              className="underline underline-offset-4 font-semibold text-primary"
            >
              Sign in
            </button>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
