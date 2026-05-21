import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchAdminDrives, fetchAdminStats,
  approveDrive, rejectDrive, deleteDrive,
  type DriveStatus,
} from '@/lib/api/admin'

export function useAdminDrives(status?: DriveStatus, enabled = true) {
  return useQuery({
    queryKey: ['admin-drives', status],
    queryFn: () => fetchAdminDrives(status),
    enabled,
    staleTime: 0,
    refetchOnMount: 'always',
  })
}

export function useAdminStats(enabled = true) {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: fetchAdminStats,
    enabled,
    staleTime: 0,
    refetchOnMount: 'always',
  })
}

export function useApproveDrive() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: approveDrive,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-drives'] })
      qc.invalidateQueries({ queryKey: ['admin-stats'] })
      qc.invalidateQueries({ queryKey: ['drives'] })
    },
  })
}

export function useRejectDrive() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: rejectDrive,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-drives'] })
      qc.invalidateQueries({ queryKey: ['admin-stats'] })
    },
  })
}

export function useDeleteDrive() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteDrive,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-drives'] })
      qc.invalidateQueries({ queryKey: ['admin-stats'] })
      qc.invalidateQueries({ queryKey: ['drives'] })
    },
  })
}
