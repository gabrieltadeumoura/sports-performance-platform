import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Select } from '../ui/select'
import {
  createAppointmentSchema,
  type CreateAppointmentFormValues,
  type UpdateAppointmentFormValues,
} from '../../features/appointments/schemas'
import type { Appointment } from '../../features/appointments/api'
import { useAthletes } from '../../features/athletes/hooks'
import { useTreatmentPlans } from '../../features/treatment-plans/hooks'

type AppointmentFormProps = {
  appointment?: Appointment
  onSubmit: (values: CreateAppointmentFormValues | UpdateAppointmentFormValues) => void
  onCancel: () => void
  isLoading?: boolean
}

export function AppointmentForm({
  appointment,
  onSubmit,
  onCancel,
  isLoading,
}: AppointmentFormProps) {
  const { data: athletesData } = useAthletes()
  const { data: treatmentPlansData } = useTreatmentPlans()
  const athletes = athletesData?.athletes ?? []
  const treatmentPlans = treatmentPlansData?.treatmentPlans ?? []

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateAppointmentFormValues>({
    resolver: zodResolver(createAppointmentSchema),
    defaultValues: appointment
      ? {
          athleteId: appointment.athleteId,
          treatmentPlanId: appointment.treatmentPlanId ?? undefined,
          appointmentDate: appointment.appointmentDate
            ? new Date(appointment.appointmentDate).toISOString().slice(0, 16)
            : '',
          durationMinutes: appointment.durationMinutes ?? 60,
          type: appointment.type,
          status: appointment.status,
          notes: appointment.notes ?? '',
          reason: appointment.reason ?? '',
          observations: appointment.observations ?? '',
        }
      : {
          athleteId: 0,
          treatmentPlanId: undefined,
          appointmentDate: new Date().toISOString().slice(0, 16),
          durationMinutes: 60,
          type: 'consultation',
          status: 'scheduled',
          notes: '',
          reason: '',
          observations: '',
        },
  })

  const selectedAthleteId = watch('athleteId')
  const filteredTreatmentPlans = treatmentPlans.filter(
    (plan) => plan.athleteId === selectedAthleteId,
  )

  const athleteOptions = [
    { value: '0', label: 'Selecione um atleta' },
    ...athletes.map((athlete) => ({
      value: String(athlete.id),
      label: athlete.name,
    })),
  ]

  const treatmentPlanOptions = [
    { value: '', label: 'Nenhum' },
    ...filteredTreatmentPlans.map((plan) => ({
      value: String(plan.id),
      label: `${plan.diagnosis.length > 50 ? `${plan.diagnosis.substring(0, 50)}...` : plan.diagnosis} (${plan.status})`,
    })),
  ]

  const typeOptions = [
    { value: 'consultation', label: 'Consulta' },
    { value: 'treatment', label: 'Tratamento' },
    { value: 'follow_up', label: 'Acompanhamento' },
    { value: 'assessment', label: 'Avaliação' },
    { value: 'review', label: 'Revisão' },
  ]

  const statusOptions = [
    { value: 'scheduled', label: 'Agendado' },
    { value: 'confirmed', label: 'Confirmado' },
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Select
            label="Atleta"
            options={athleteOptions}
            error={errors.athleteId?.message}
            disabled={!!appointment}
            {...register('athleteId', {
              valueAsNumber: true,
              setValueAs: (v) => (v === '0' ? 0 : Number(v)),
            })}
          />
        </div>

        {selectedAthleteId > 0 && filteredTreatmentPlans.length > 0 && (
          <div className="sm:col-span-2">
            <Select
              label="Plano de Tratamento (Opcional)"
              options={treatmentPlanOptions}
              error={errors.treatmentPlanId?.message}
              {...register('treatmentPlanId', {
                valueAsNumber: true,
                setValueAs: (v) => (v === '' || v === '0' ? undefined : Number(v)),
              })}
            />
          </div>
        )}

        <Input
          label="Data e Hora do Atendimento"
          type="datetime-local"
          error={errors.appointmentDate?.message}
          {...register('appointmentDate')}
        />

        <Input
          label="Duração (minutos)"
          type="number"
          min="1"
          error={errors.durationMinutes?.message}
          {...register('durationMinutes', { valueAsNumber: true })}
        />

        <Select
          label="Tipo"
          options={typeOptions}
          error={errors.type?.message}
          {...register('type')}
        />

        {!appointment && (
          <Select
            label="Status"
            options={statusOptions}
            error={errors.status?.message}
            {...register('status')}
          />
        )}

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-secondary-700">
            Motivo
          </label>
          <textarea
            {...register('reason')}
            rows={2}
            className="flex w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm transition-colors placeholder:text-secondary-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Motivo do atendimento (opcional)"
          />
          {errors.reason && (
            <p className="mt-1.5 text-xs text-danger-600">{errors.reason.message}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-secondary-700">
            Notas
          </label>
          <textarea
            {...register('notes')}
            rows={3}
            className="flex w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm transition-colors placeholder:text-secondary-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Notas adicionais (opcional)"
          />
          {errors.notes && (
            <p className="mt-1.5 text-xs text-danger-600">{errors.notes.message}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-secondary-700">
            Observações
          </label>
          <textarea
            {...register('observations')}
            rows={3}
            className="flex w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm transition-colors placeholder:text-secondary-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Observações do atendimento (opcional)"
          />
          {errors.observations && (
            <p className="mt-1.5 text-xs text-danger-600">{errors.observations.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-secondary-100">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {appointment ? 'Salvar Alterações' : 'Criar Atendimento'}
        </Button>
      </div>
    </form>
  )
}
