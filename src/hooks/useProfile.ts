import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchProfile, updateProfile, saveJobAlert } from '@/lib/api/profiles'
import type { DbProfile } from '@/lib/database.types'

export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn:  () => fetchProfile(userId!),
    enabled:  !!userId,
    staleTime: 120_000,
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      userId,
      updates,
    }: {
      userId: string
      updates: Partial<Omit<DbProfile, 'id' | 'created_at' | 'updated_at'>>
    }) => updateProfile(userId, updates),
    onSuccess: (_data, { userId }) => {
      qc.invalidateQueries({ queryKey: ['profile', userId] })
    },
  })
}

export function useSaveJobAlert() {
  return useMutation({
    mutationFn: ({
      userId,
      prefs,
    }: {
      userId: string
      prefs: { city?: string; experience?: string; via_email: boolean; via_whatsapp: boolean }
    }) => saveJobAlert(userId, prefs),
  })
}
