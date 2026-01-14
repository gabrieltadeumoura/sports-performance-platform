import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  activateTreatmentPlan,
  completeTreatmentPlan,
  createTreatmentPlan,
  deleteTreatmentPlan,
  getTreatmentPlanById,
  getTreatmentPlans,
  getTreatmentPlansByAthlete,
  pauseTreatmentPlan,
  updateTreatmentPlan,
  type CreateTreatmentPlanPayload,
  type UpdateTreatmentPlanPayload,
} from './api'

export function useTreatmentPlans() {
  return useQuery({
    queryKey: ['treatment-plans'],
    queryFn: getTreatmentPlans,
  })
}

export function useTreatmentPlan(id: number) {
  return useQuery({
    queryKey: ['treatment-plans', id],
    queryFn: () => getTreatmentPlanById(id),
    enabled: !!id,
  })
}

export function useTreatmentPlansByAthlete(athleteId: number) {
  return useQuery({
    queryKey: ['treatment-plans', 'athlete', athleteId],
    queryFn: () => getTreatmentPlansByAthlete(athleteId),
    enabled: !!athleteId,
  })
}

export function useCreateTreatmentPlan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateTreatmentPlanPayload) => createTreatmentPlan(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatment-plans'] })
    },
  })
}

export function useUpdateTreatmentPlan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateTreatmentPlanPayload }) =>
      updateTreatmentPlan(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['treatment-plans'] })
      queryClient.invalidateQueries({ queryKey: ['treatment-plans', variables.id] })
    },
  })
}

export function useDeleteTreatmentPlan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteTreatmentPlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatment-plans'] })
    },
  })
}

export function useActivateTreatmentPlan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => activateTreatmentPlan(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['treatment-plans'] })
      queryClient.invalidateQueries({ queryKey: ['treatment-plans', id] })
    },
  })
}

export function usePauseTreatmentPlan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => pauseTreatmentPlan(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['treatment-plans'] })
      queryClient.invalidateQueries({ queryKey: ['treatment-plans', id] })
    },
  })
}

export function useCompleteTreatmentPlan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => completeTreatmentPlan(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['treatment-plans'] })
      queryClient.invalidateQueries({ queryKey: ['treatment-plans', id] })
    },
  })
}
