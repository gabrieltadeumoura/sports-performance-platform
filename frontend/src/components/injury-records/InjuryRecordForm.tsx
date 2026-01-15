import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Select } from '../ui/select'
import {
  createInjuryRecordSchema,
  type CreateInjuryRecordFormValues,
  type UpdateInjuryRecordFormValues,
} from '../../features/injury-records/schemas'
import type { InjuryRecord } from '../../features/injury-records/api'
import { useAthletes } from '../../features/athletes/hooks'


type InjuryRecordFormProps = {
  injuryRecord?: InjuryRecord
  onSubmit: (values: CreateInjuryRecordFormValues | UpdateInjuryRecordFormValues) => void
  onCancel: () => void
  isLoading?: boolean
}


export function InjuryRecordForm({
  injuryRecord,
  onSubmit,
  onCancel,
  isLoading,
}: InjuryRecordFormProps) {
  const { data: athletesData } = useAthletes()
  const athletes = athletesData?.athletes ?? []


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateInjuryRecordFormValues>({
    resolver: zodResolver(createInjuryRecordSchema),
    defaultValues: injuryRecord
      ? {
          athleteId: injuryRecord.athleteId,
          injuryType: injuryRecord.injuryType,
          bodyPart: injuryRecord.bodyPart,
          severity: injuryRecord.severity as 'minor' | 'moderate' | 'severe' | 'critical',
          cause: injuryRecord.cause ?? '',
          expectedRecovery:
            typeof injuryRecord.expectedRecovery === 'number'
              ? injuryRecord.expectedRecovery
              : injuryRecord.expectedRecovery
                ? parseInt(injuryRecord.expectedRecovery.toString())
                : 0,
          actualRecovery:
            typeof injuryRecord.actualRecovery === 'number'
              ? injuryRecord.actualRecovery
              : injuryRecord.actualRecovery
                ? parseInt(injuryRecord.actualRecovery.toString())
                : undefined,
          treatmentProtocol: injuryRecord.treatmentProtocol ?? '',
          status: injuryRecord.status as 'active' | 'recovering' | 'recovered',
          injuryDate: injuryRecord.injuryDate
            ? new Date(injuryRecord.injuryDate).toISOString().split('T')[0]
            : undefined,
          recoveryDate: injuryRecord.recoveryDate
            ? new Date(injuryRecord.recoveryDate).toISOString().split('T')[0]
            : undefined,
        }
      : {
          athleteId: 0,
          injuryType: '',
          bodyPart: '',
          severity: 'minor',
          cause: '',
          expectedRecovery: 0,
          actualRecovery: undefined,
          treatmentProtocol: '',
          status: 'active',
          injuryDate: new Date().toISOString().split('T')[0],
          recoveryDate: undefined,
        },
  })


  const severityOptions = [
    { value: 'minor', label: 'Leve' },
    { value: 'moderate', label: 'Moderada' },
    { value: 'severe', label: 'Grave' },
    { value: 'critical', label: 'Crítica' },
  ]

  const statusOptions = [
    { value: 'active', label: 'Ativa' },
    { value: 'recovering', label: 'Recuperando' },
    { value: 'recovered', label: 'Recuperada' },
  ]

  const athleteOptions = [
    { value: '0', label: 'Selecione um paciente' },
    ...athletes.map((athlete) => ({
      value: String(athlete.id),
      label: athlete.name,
    })),
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Select
            label="Paciente"
            options={athleteOptions}
            error={errors.athleteId?.message}
            disabled={!!injuryRecord}
            {...register('athleteId', {
              valueAsNumber: true,
              setValueAs: (v) => (v === '0' ? 0 : Number(v)),
            })}
          />
        </div>

        <Input
          label="Tipo de Lesão"
          placeholder="Ex: Entorse, Fratura, etc."
          error={errors.injuryType?.message}
          {...register('injuryType')}
        />

        <Input
          label="Parte do Corpo"
          placeholder="Ex: Joelho, Tornozelo, etc."
          error={errors.bodyPart?.message}
          {...register('bodyPart')}
        />

        <Select
          label="Severidade"
          options={severityOptions}
          error={errors.severity?.message}
          {...register('severity')}
        />

        <Select
          label="Status"
          options={statusOptions}
          error={errors.status?.message}
          {...register('status')}
        />

        <Input
          label="Data da Lesão"
          type="date"
          error={errors.injuryDate?.message}
          {...register('injuryDate')}
        />

        <Input
          label="Data de Recuperação"
          type="date"
          error={errors.recoveryDate?.message}
          {...register('recoveryDate')}
        />

        <Input
          label="Recuperação Esperada (dias)"
          type="number"
          placeholder="Ex: 30"
          error={errors.expectedRecovery?.message}
          {...register('expectedRecovery', { valueAsNumber: true })}
        />

        <Input
          label="Recuperação Real (dias)"
          type="number"
          placeholder="Opcional"
          error={errors.actualRecovery?.message}
          {...register('actualRecovery', {
            valueAsNumber: true,
            setValueAs: (v) => (v === '' ? undefined : v),
          })}
        />

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-secondary-700">
            Causa
          </label>
          <textarea
            {...register('cause')}
            rows={2}
            className="flex w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm transition-colors placeholder:text-secondary-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Descreva a causa da lesão"
          />
          {errors.cause && (
            <p className="mt-1.5 text-xs text-danger-600">{errors.cause.message}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-secondary-700">
            Protocolo de Tratamento
          </label>
          <textarea
            {...register('treatmentProtocol')}
            rows={4}
            className="flex w-full rounded-lg border border-secondary-300 bg-white px-3 py-2 text-sm transition-colors placeholder:text-secondary-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Descreva o protocolo de tratamento"
          />
          {errors.treatmentProtocol && (
            <p className="mt-1.5 text-xs text-danger-600">
              {errors.treatmentProtocol.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-secondary-100">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {injuryRecord ? 'Salvar Alterações' : 'Criar Lesão'}
        </Button>
      </div>
    </form>
  )
}
