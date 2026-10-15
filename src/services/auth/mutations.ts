import type { Me, ProfileSetupRequest } from '@shared/contracts/auth'

import { meSchema, profileSetupRequestSchema } from '@shared/contracts/auth'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { post } from '@/api'

import { authQueryKeys } from './key'

export function useCompleteProfileSetupMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ProfileSetupRequest) =>
      post('/api/profile-setup', data, {
        requestSchema: profileSetupRequestSchema,
        requireAuth: true,
        responseSchema: meSchema,
      }),
    // Seeding the cache releases every profile gate instantly, including
    // the one that rendered this page.
    onSuccess: (me: Me) => {
      queryClient.setQueryData(authQueryKeys.me(), me)
    },
  })
}
