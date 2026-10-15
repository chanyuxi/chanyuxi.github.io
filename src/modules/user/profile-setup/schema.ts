import { MAX_PROFILE_BIO_LENGTH } from '@shared/constants/user-profiles'
import { z } from 'zod'

export const bioFormSchema = z.object({
  bio: z
    .string()
    .trim()
    .min(1, 'Write a short bio to introduce yourself.')
    .max(
      MAX_PROFILE_BIO_LENGTH,
      `Keep your bio within ${MAX_PROFILE_BIO_LENGTH} characters.`,
    ),
})

export type BioFormValues = z.infer<typeof bioFormSchema>
