import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/auth'

import { MIN_PASSWORD_LENGTH } from '../constants'
import {
  credentialsFormSchema,
  type CredentialsFormValues,
} from '../schema'

export function CredentialsForm() {
  const { signIn } = useAuth()
  const {
    clearErrors,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<CredentialsFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
    resolver: zodResolver(credentialsFormSchema),
  })

  async function onSubmit(values: CredentialsFormValues) {
    clearErrors('root.server')

    try {
      await signIn(values)
    }
    catch (error) {
      setError('root.server', {
        message: error instanceof Error && error.message
          ? error.message
          : 'Unable to reach the authentication service. Please try again.',
      })
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field data-invalid={Boolean(errors.email)}>
          <FieldLabel htmlFor="auth-email">Email</FieldLabel>
          <Input
            {...register('email')}
            aria-describedby={errors.email ? 'auth-email-error' : undefined}
            aria-invalid={Boolean(errors.email)}
            autoComplete="email"
            disabled={isSubmitting}
            id="auth-email"
            inputMode="email"
            placeholder="you@example.com"
            type="email"
          />
          <FieldError errors={[errors.email]} id="auth-email-error" />
        </Field>

        <Field data-invalid={Boolean(errors.password)}>
          <FieldLabel htmlFor="auth-password">Password</FieldLabel>
          <Input
            {...register('password')}
            aria-describedby={errors.password ? 'auth-password-error' : undefined}
            aria-invalid={Boolean(errors.password)}
            autoComplete="current-password"
            disabled={isSubmitting}
            id="auth-password"
            placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
            type="password"
          />
          <FieldError errors={[errors.password]} id="auth-password-error" />
        </Field>
      </FieldGroup>

      <FieldError
        className="mt-4 text-center leading-5"
        errors={[errors.root?.server]}
      />

      <Button className="mt-6 w-full" loading={isSubmitting} size="lg" type="submit">
        Sign in
      </Button>
    </form>
  )
}
