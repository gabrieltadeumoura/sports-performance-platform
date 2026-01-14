import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createPhysicalAssessment,
  deletePhysicalAssessment,
  getPhysicalAssessments,
  getPhysicalAssessmentsByAthlete,
  getPhysicalAssessmentById,
  updatePhysicalAssessment,
  type CreatePhysicalAssessmentPayload,
  type UpdatePhysicalAssessmentPayload,
} from './api'

export function usePhysicalAssessments() {
  return useQuery({
    queryKey: ['physical-assessments'],
    queryFn: getPhysicalAssessments,
  })
}

export function usePhysicalAssessment(id: number) {
  return useQuery({
    queryKey: ['physical-assessments', id],
    queryFn: () => getPhysicalAssessmentById(id),
    enabled: !!id,
  })
}

export function usePhysicalAssessmentsByAthlete(athleteId: number) {
  return useQuery({
    queryKey: ['physical-assessments', 'athlete', athleteId],
    queryFn: () => getPhysicalAssessmentsByAthlete(athleteId),
    enabled: !!athleteId,
  })
}

export function useCreatePhysicalAssessment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreatePhysicalAssessmentPayload) => createPhysicalAssessment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['physical-assessments'] })
    },
  })
}

export function useUpdatePhysicalAssessment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdatePhysicalAssessmentPayload }) =>
      updatePhysicalAssessment(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['physical-assessments'] })
      queryClient.invalidateQueries({ queryKey: ['physical-assessments', variables.id] })
    },
  })
}

export function useDeletePhysicalAssessment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deletePhysicalAssessment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['physical-assessments'] })
    },
  })
}

