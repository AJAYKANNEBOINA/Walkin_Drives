import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchDrives, fetchDriveById, postDrive } from '@/lib/api/drives'
import type { DrivesFilter, PostDrivePayload } from '@/lib/api/drives'

export function useDrives(filter: DrivesFilter & { enabled?: boolean } = {}) {
  const { enabled = true, ...rest } = filter
  return useQuery({
    queryKey: ['drives', rest],
    queryFn:  () => fetchDrives(rest),
    enabled,
    staleTime: 60_000,
  })
}

export function useDrive(id: string | undefined) {
  return useQuery({
    queryKey: ['drives', id],
    queryFn:  () => fetchDriveById(id!),
    enabled:  !!id,
    staleTime: 60_000,
  })
}

export function usePostDrive() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ payload, userId }: { payload: PostDrivePayload; userId: string }) =>
      postDrive(payload, userId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['drives'] }),
  })
}
