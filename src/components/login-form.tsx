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

interface LoginFormProps extends React.ComponentProps<"form"> {
  email: string
  setEmail: (val: string) => void
  password: string
  setPassword: (val: string) => void
  loading: boolean
  onSubmit: (e: React.FormEvent) => void
  onToggleAuth: () => void
}

export function LoginForm({
  className,
  email,
  setEmail,
  password,
  setPassword,
  loading,
  onSubmit,
  onToggleAuth,
  ...props
}: LoginFormProps) {
  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={onSubmit} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold font-heading uppercase tracking-wider">Hospital Portal</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your credentials to access your dashboard
          </p>
        </div>
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
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline text-primary"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            required
            className="bg-background"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Field>
          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
        </Field>
        <Field>
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <button 
              type="button"
              onClick={onToggleAuth}
              className="underline underline-offset-4 font-semibold text-primary"
            >
              Sign Up
            </button>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
