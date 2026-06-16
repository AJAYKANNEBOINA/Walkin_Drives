import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchUserApplications,
  applyToDrive,
  withdrawApplication,
  hasApplied,
  type ApplyDetails,
} from '@/lib/api/applications'

export function useApplications(userId: string | undefined) {
  return useQuery({
    queryKey: ['applications', userId],
    queryFn:  () => fetchUserApplications(userId!),
    enabled:  !!userId,
    staleTime: 30_000,
  })
}

export function useHasApplied(driveId: string, userId: string | undefined) {
  return useQuery({
    queryKey: ['hasApplied', driveId, userId],
    queryFn:  () => hasApplied(driveId, userId!),
    enabled:  !!userId && !!driveId,
    staleTime: 30_000,
  })
}

export function useApply() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ driveId, userId, details }: { driveId: string; userId: string; details?: ApplyDetails }) =>
      applyToDrive(driveId, userId, details),
    onSuccess: (_data, { driveId, userId }) => {
      qc.invalidateQueries({ queryKey: ['applications', userId] })
      qc.invalidateQueries({ queryKey: ['hasApplied', driveId, userId] })
    },
  })
}

export function useWithdraw() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ applicationId }: { applicationId: string; userId: string }) =>
      withdrawApplication(applicationId),
    onSuccess: (_data, { userId }) => {
      qc.invalidateQueries({ queryKey: ['applications', userId] })
    },
  })
}
