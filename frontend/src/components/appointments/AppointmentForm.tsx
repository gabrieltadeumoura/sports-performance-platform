import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-zinc-50">Atleta</label>
        <select
          {...register('athleteId', { valueAsNumber: true })}
          className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          disabled={!!appointment}
        >
          <option value={0}>Selecione um atleta</option>
          {athletes.map((athlete) => (
            <option key={athlete.id} value={athlete.id}>
              {athlete.name}
            </option>
          ))}
        </select>
        {errors.athleteId && (
          <p className="text-xs text-red-400 mt-1">{errors.athleteId.message}</p>
        )}
      </div>

      {selectedAthleteId > 0 && filteredTreatmentPlans.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-1 text-zinc-50">
            Plano de Tratamento (Opcional)
          </label>
          <select
            {...register('treatmentPlanId', {
              valueAsNumber: true,
              setValueAs: (v) => (v === '' || v === '0' ? undefined : Number(v)),
            })}
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="">Nenhum</option>
            {filteredTreatmentPlans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.diagnosis.length > 50
                  ? `${plan.diagnosis.substring(0, 50)}...`
                  : plan.diagnosis}{' '}
                ({plan.status})
              </option>
            ))}
          </select>
          {errors.treatmentPlanId && (
            <p className="text-xs text-red-400 mt-1">{errors.treatmentPlanId.message}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-zinc-50">
            Data e Hora do Atendimento
          </label>
          <input
            type="datetime-local"
            {...register('appointmentDate')}
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
          {errors.appointmentDate && (
            <p className="text-xs text-red-400 mt-1">{errors.appointmentDate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-zinc-50">
            Duração (minutos)
          </label>
          <input
            type="number"
            {...register('durationMinutes', { valueAsNumber: true })}
            min="1"
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
          {errors.durationMinutes && (
            <p className="text-xs text-red-400 mt-1">{errors.durationMinutes.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-zinc-50">Tipo</label>
          <select
            {...register('type')}
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="consultation">Consulta</option>
            <option value="treatment">Tratamento</option>
            <option value="follow_up">Acompanhamento</option>
            <option value="assessment">Avaliação</option>
            <option value="review">Revisão</option>
          </select>
          {errors.type && (
            <p className="text-xs text-red-400 mt-1">{errors.type.message}</p>
          )}
        </div>

        {!appointment && (
          <div>
            <label className="block text-sm font-medium mb-1 text-zinc-50">Status</label>
            <select
              {...register('status')}
              className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            >
              <option value="scheduled">Agendado</option>
              <option value="confirmed">Confirmado</option>
            </select>
            {errors.status && (
              <p className="text-xs text-red-400 mt-1">{errors.status.message}</p>
            )}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-zinc-50">Motivo</label>
        <textarea
          {...register('reason')}
          rows={2}
          className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          placeholder="Motivo do atendimento (opcional)"
        />
        {errors.reason && (
          <p className="text-xs text-red-400 mt-1">{errors.reason.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-zinc-50">Notas</label>
        <textarea
          {...register('notes')}
          rows={3}
          className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          placeholder="Notas adicionais (opcional)"
        />
        {errors.notes && (
          <p className="text-xs text-red-400 mt-1">{errors.notes.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-zinc-50">Observações</label>
        <textarea
          {...register('observations')}
          rows={3}
          className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          placeholder="Observações do atendimento (opcional)"
        />
        {errors.observations && (
          <p className="text-xs text-red-400 mt-1">{errors.observations.message}</p>
        )}
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {appointment ? 'Salvar' : 'Criar'}
        </Button>
      </div>
    </form>
  )
}
