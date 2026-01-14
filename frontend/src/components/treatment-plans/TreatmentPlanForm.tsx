import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-zinc-50">Atleta</label>
        <select
          {...register('athleteId', { valueAsNumber: true })}
          className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          disabled={!!treatmentPlan}
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

      {selectedAthleteId > 0 && filteredInjuryRecords.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-1 text-zinc-50">
            Lesão Relacionada (Opcional)
          </label>
          <select
            {...register('injuryRecordId', {
              valueAsNumber: true,
              setValueAs: (v) => (v === '' || v === '0' ? null : Number(v)),
            })}
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="">Nenhuma</option>
            {filteredInjuryRecords.map((record) => (
              <option key={record.id} value={record.id}>
                {record.injuryType} - {record.bodyPart} (
                {new Date(record.injuryDate).toLocaleDateString('pt-BR')})
              </option>
            ))}
          </select>
          {errors.injuryRecordId && (
            <p className="text-xs text-red-400 mt-1">{errors.injuryRecordId.message}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-zinc-50">Data de Início</label>
          <input
            type="date"
            {...register('startDate')}
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
          {errors.startDate && (
            <p className="text-xs text-red-400 mt-1">{errors.startDate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-zinc-50">Data de Término</label>
          <input
            type="date"
            {...register('endDate')}
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
          {errors.endDate && (
            <p className="text-xs text-red-400 mt-1">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      {!treatmentPlan && (
        <div>
          <label className="block text-sm font-medium mb-1 text-zinc-50">Status Inicial</label>
          <select
            {...register('status')}
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="draft">Rascunho</option>
            <option value="active">Ativo</option>
          </select>
          {errors.status && (
            <p className="text-xs text-red-400 mt-1">{errors.status.message}</p>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1 text-zinc-50">Diagnóstico</label>
        <textarea
          {...register('diagnosis')}
          rows={3}
          className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          placeholder="Descreva o diagnóstico"
        />
        {errors.diagnosis && (
          <p className="text-xs text-red-400 mt-1">{errors.diagnosis.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-zinc-50">Objetivos</label>
        <textarea
          {...register('objectives')}
          rows={4}
          className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          placeholder="Descreva os objetivos do tratamento"
        />
        {errors.objectives && (
          <p className="text-xs text-red-400 mt-1">{errors.objectives.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-zinc-50">Observações</label>
        <textarea
          {...register('notes')}
          rows={3}
          className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          placeholder="Observações adicionais (opcional)"
        />
        {errors.notes && (
          <p className="text-xs text-red-400 mt-1">{errors.notes.message}</p>
        )}
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {treatmentPlan ? 'Salvar' : 'Criar'}
        </Button>
      </div>
    </form>
  )
}
