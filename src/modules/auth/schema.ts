import { z } from 'zod'

import { MIN_PASSWORD_LENGTH } from './constants'

export const credentialsFormSchema = z.object({
  email: z.email('Enter a valid email address.'),
  password: z.string().min(
    MIN_PASSWORD_LENGTH,
    `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
  ),
})

export type CredentialsFormValues = z.infer<typeof credentialsFormSchema>
