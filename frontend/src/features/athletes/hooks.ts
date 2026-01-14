import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createAthlete,
  deleteAthlete,
  getAthleteBiomechanics,
  getAthleteById,
  getAthleteProfile,
  getAthletes,
  updateAthlete,
  type CreateAthletePayload,
  type UpdateAthletePayload,
} from './api'

export function useAthletes() {
  return useQuery({
    queryKey: ['athletes'],
    queryFn: getAthletes,
  })
}

export function useAthlete(id: number) {
  return useQuery({
    queryKey: ['athletes', id],
    queryFn: async () => {
      const response = await getAthleteById(id)
      return { athlete: response.data }
    },
    enabled: !!id,
  })
}

export function useAthleteProfile(id: number) {
  return useQuery({
    queryKey: ['athletes', id, 'profile'],
    queryFn: () => getAthleteProfile(id),
    enabled: !!id,
  })
}

export function useAthleteBiomechanics(id: number) {
  return useQuery({
    queryKey: ['athletes', id, 'biomechanics'],
    queryFn: () => getAthleteBiomechanics(id),
    enabled: !!id,
  })
}

export function useCreateAthlete() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateAthletePayload) => createAthlete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['athletes'] })
    },
  })
}

export function useUpdateAthlete() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateAthletePayload }) =>
      updateAthlete(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['athletes'] })
      queryClient.invalidateQueries({ queryKey: ['athletes', variables.id] })
    },
  })
}

export function useDeleteAthlete() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteAthlete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['athletes'] })
    },
  })
}

