import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createInjuryRecord,
  deleteInjuryRecord,
  getInjuryRecords,
  updateInjuryRecord,
  type CreateInjuryRecordPayload,
  type UpdateInjuryRecordPayload,
} from './api'

export function useInjuryRecords() {
  return useQuery({
    queryKey: ['injury-records'],
    queryFn: getInjuryRecords,
  })
}

export function useCreateInjuryRecord() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateInjuryRecordPayload) => createInjuryRecord(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['injury-records'] })
    },
  })
}

export function useUpdateInjuryRecord() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateInjuryRecordPayload }) =>
      updateInjuryRecord(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['injury-records'] })
    },
  })
}

export function useDeleteInjuryRecord() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteInjuryRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['injury-records'] })
    },
  })
}

