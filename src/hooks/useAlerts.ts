import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchMyAlert, saveAlert, deleteAlert } from '@/lib/api/alerts'
import type { JobAlertPayload } from '@/lib/api/alerts'

export function useMyAlert(userId?: string) {
  return useQuery({
    queryKey: ['job-alert', userId],
    queryFn:  () => fetchMyAlert(userId!),
    enabled:  !!userId,
  })
}

export function useSaveAlert() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ payload, userId }: { payload: JobAlertPayload; userId: string }) =>
      saveAlert(payload, userId),
    onSuccess: (_data, { userId }) => {
      qc.invalidateQueries({ queryKey: ['job-alert', userId] })
    },
  })
}

export function useDeleteAlert() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ alertId, userId }: { alertId: string; userId: string }) =>
      deleteAlert(alertId),
    onSuccess: (_data, { userId }) => {
      qc.invalidateQueries({ queryKey: ['job-alert', userId] })
    },
  })
}
