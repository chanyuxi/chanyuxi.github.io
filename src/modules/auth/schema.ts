import { z } from 'zod'

import { MIN_PASSWORD_LENGTH } from './constants'

// The name field is shared by both schemas so they keep the same inferred
// shape. This lets the form swap resolvers by mode without type conflicts.
const baseFormSchema = z.object({
  email: z.email('Enter a valid email address.'),
  name: z.string(),
  password: z.string().min(
    MIN_PASSWORD_LENGTH,
    `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
  ),
})

export const credentialsFormSchema = baseFormSchema

export const signUpFormSchema = baseFormSchema.extend({
  name: z.string().trim().min(1, 'Tell us your name.'),
})

export type AuthMode = 'sign-in' | 'sign-up'

export type CredentialsFormValues = z.infer<typeof signUpFormSchema>
