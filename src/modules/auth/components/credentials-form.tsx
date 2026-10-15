import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
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
  type AuthMode,
  credentialsFormSchema,
  type CredentialsFormValues,
  signUpFormSchema,
} from '../schema'

interface CredentialsFormProps {
  mode: AuthMode
  onModeChange: (mode: AuthMode) => void
}

export function CredentialsForm({ mode, onModeChange }: CredentialsFormProps) {
  const { signIn, signUp } = useAuth()
  const shouldReduceMotion = useReducedMotion()
  const [accountCreated, setAccountCreated] = useState(false)
  const {
    clearErrors,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<CredentialsFormValues>({
    defaultValues: {
      email: '',
      name: '',
      password: '',
    },
    mode: 'onBlur',
    resolver: zodResolver(
      mode === 'sign-up' ? signUpFormSchema : credentialsFormSchema,
    ),
  })

  async function onSubmit(values: CredentialsFormValues) {
    clearErrors('root.server')
    setAccountCreated(false)

    try {
      if (mode === 'sign-up') {
        const outcome = await signUp(values)

        if (outcome === 'verification-pending') {
          setAccountCreated(true)
        }
      }
      else {
        await signIn({ email: values.email, password: values.password })
      }
    }
    catch (error) {
      setError('root.server', {
        message: error instanceof Error && error.message
          ? error.message
          : 'Unable to reach the authentication service. Please try again.',
      })
    }
  }

  function handleToggleMode() {
    clearErrors()
    setAccountCreated(false)
    onModeChange(mode === 'sign-up' ? 'sign-in' : 'sign-up')
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <AnimatePresence initial={false}>
        {mode === 'sign-up' && (
          <motion.div
            animate={{ height: 'auto', opacity: 1 }}
            className="overflow-hidden"
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.3,
              ease: 'easeOut',
            }}
          >
            {/* Bottom spacing lives inside the animated box so the collapse
                swallows it instead of leaving a ghost gap behind. */}
            <div className="pb-5">
              <Field data-invalid={Boolean(errors.name)}>
                <FieldLabel htmlFor="auth-name">Name</FieldLabel>
                <Input
                  {...register('name')}
                  aria-describedby={errors.name ? 'auth-name-error' : undefined}
                  aria-invalid={Boolean(errors.name)}
                  autoComplete="name"
                  disabled={isSubmitting}
                  id="auth-name"
                  placeholder="Your name"
                  type="text"
                />
                <FieldError errors={[errors.name]} id="auth-name-error" />
              </Field>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
            autoComplete={mode === 'sign-up' ? 'new-password' : 'current-password'}
            disabled={isSubmitting}
            id="auth-password"
            placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
            type="password"
          />
          <FieldError errors={[errors.password]} id="auth-password-error" />
        </Field>
      </FieldGroup>

      {accountCreated && (
        <p className="mt-4 text-sm leading-6 text-muted-foreground" role="status">
          Account created. Check your email to verify your address, then sign in.
        </p>
      )}

      <FieldError
        className="mt-4 text-center leading-5"
        errors={[errors.root?.server]}
      />

      <Button className="mt-6 w-full" loading={isSubmitting} size="lg" type="submit">
        {mode === 'sign-up' ? 'Create account' : 'Sign in'}
      </Button>

      <p className="mt-5 text-center text-sm leading-6 text-muted-foreground">
        {`${mode === 'sign-up' ? 'Already have an account?' : 'New here?'} `}
        <Button
          disabled={isSubmitting}
          onClick={handleToggleMode}
          type="button"
          variant="link"
        >
          {mode === 'sign-up' ? 'Sign in' : 'Create an account'}
        </Button>
      </p>
    </form>
  )
}
