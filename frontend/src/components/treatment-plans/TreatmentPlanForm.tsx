import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Select } from '../ui/select'
import {
  createTreatmentPlanSchema,
  type CreateTreatmentPlanFormValues,
  type UpdateTreatmentPlanFormValues,
} from '../../features/treatment-plans/schemas'
import type { TreatmentPlan } from '../../features/treatment-plans/api'
import { useAthletes } from '../../features/athletes/hooks'
import { useInjuryRecords } from '../../features/injury-records/hooks'

type TreatmentPlanFormProps = {
  treatmentPlan?: TreatmentPlan
  onSubmit: (values: CreateTreatmentPlanFormValues | UpdateTreatmentPlanFormValues) => void
  onCancel: () => void
  isLoading?: boolean
}

export function TreatmentPlanForm({
  treatmentPlan,
  onSubmit,
  onCancel,
  isLoading,
}: TreatmentPlanFormProps) {
  const { data: athletesData } = useAthletes()
  const { data: injuryRecordsData } = useInjuryRecords()
  const athletes = athletesData?.athletes ?? []
  const injuryRecords = injuryRecordsData?.data ?? []

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateTreatmentPlanFormValues>({
    resolver: zodResolver(createTreatmentPlanSchema),
    defaultValues: treatmentPlan
      ? {
          athleteId: treatmentPlan.athleteId,
          injuryRecordId: treatmentPlan.injuryRecordId,
          diagnosis: treatmentPlan.diagnosis,
          objectives: treatmentPlan.objectives,
          notes: treatmentPlan.notes ?? '',
          startDate: treatmentPlan.startDate
            ? new Date(treatmentPlan.startDate).toISOString().split('T')[0]
            : '',
          endDate: treatmentPlan.endDate
            ? new Date(treatmentPlan.endDate).toISOString().split('T')[0]
            : null,
          status: treatmentPlan.status,
        }
      : {
          athleteId: 0,
          injuryRecordId: null,
          diagnosis: '',
          objectives: '',
          notes: '',
          startDate: new Date().toISOString().split('T')[0],
          endDate: null,
          status: 'draft',
        },
  })

  const selectedAthleteId = watch('athleteId')
  const filteredInjuryRecords = injuryRecords.filter(
    (record) => record.athleteId === selectedAthleteId,
  )

  const athleteOptions = [
    { value: '0', label: 'Selecione um paciente' },
    ...athletes.map((athlete) => ({
      value: String(athlete.id),
      label: athlete.name,
    })),
  ]

  const injuryRecordOptions = [
    { value: '', label: 'Nenhuma' },
    ...filteredInjuryRecords.map((record) => ({
      value: String(record.id),
      label: `${record.injuryType} - ${record.bodyPart} (${new Date(record.injuryDate).toLocaleDateString('pt-BR')})`,
    })),
  ]

  const statusOptions = [
    { value: 'draft', label: 'Rascunho' },
    { value: 'active', label: 'Ativo' },
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Select
            label="Paciente"
            options={athleteOptions}
            error={errors.athleteId?.message}
            disabled={!!treatmentPlan}
            {...register('athleteId', {
              valueAsNumber: true,
              setValueAs: (v) => (v === '0' ? 0 : Number(v)),
            })}
          />
        </div>

        {selectedAthleteId > 0 && filteredInjuryRecords.length > 0 && (
          <div className="sm:col-span-2">
            <Select
              label="Lesão Relacionada (Opcional)"
              options={injuryRecordOptions}
              error={errors.injuryRecordId?.message}
              {...register('injuryRecordId', {
                valueAsNumber: true,
                setValueAs: (v) => (v === '' || v === '0' ? null : Number(v)),
              })}
            />
          </div>
        )}

        <Input
          label="Data de Início"
          type="date"
          error={errors.startDate?.message}
          {...register('startDate')}
        />

        <Input
          label="Data de Término"
          type="date"
          error={errors.endDate?.message}
          {...register('endDate')}
        />

        {!treatmentPlan && (
          <div className="sm:col-span-2">
            <Select
              label="Status Inicial"
              options={statusOptions}
              error={errors.status?.message}
              {...register('status')}
            />
          </div>
        )}

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-secondary-700">
            Diagnóstico
          </label>
          <textarea
            {...register('diagnosis')}
            rows={3}
            className="flex w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm transition-colors placeholder:text-secondary-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Descreva o diagnóstico"
          />
          {errors.diagnosis && (
            <p className="mt-1.5 text-xs text-danger-600">{errors.diagnosis.message}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-secondary-700">
            Objetivos
          </label>
          <textarea
            {...register('objectives')}
            rows={4}
            className="flex w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm transition-colors placeholder:text-secondary-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Descreva os objetivos do tratamento"
          />
          {errors.objectives && (
            <p className="mt-1.5 text-xs text-danger-600">{errors.objectives.message}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-secondary-700">
            Observações
          </label>
          <textarea
            {...register('notes')}
            rows={3}
            className="flex w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm transition-colors placeholder:text-secondary-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Observações adicionais (opcional)"
          />
          {errors.notes && (
            <p className="mt-1.5 text-xs text-danger-600">{errors.notes.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-secondary-100">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {treatmentPlan ? 'Salvar Alterações' : 'Criar Plano de Tratamento'}
        </Button>
      </div>
    </form>
  )
}
