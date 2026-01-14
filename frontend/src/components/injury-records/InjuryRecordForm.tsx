import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
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


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-zinc-50">Atleta</label>
        <select
          {...register('athleteId', { valueAsNumber: true })}
          className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          disabled={!!injuryRecord}
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


      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-zinc-50">Tipo de Lesão</label>
          <input
            {...register('injuryType')}
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            placeholder="Ex: Entorse, Fratura, etc."
          />
          {errors.injuryType && (
            <p className="text-xs text-red-400 mt-1">{errors.injuryType.message}</p>
          )}
        </div>


        <div>
          <label className="block text-sm font-medium mb-1 text-zinc-50">Parte do Corpo</label>
          <input
            {...register('bodyPart')}
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            placeholder="Ex: Joelho, Tornozelo, etc."
          />
          {errors.bodyPart && (
            <p className="text-xs text-red-400 mt-1">{errors.bodyPart.message}</p>
          )}
        </div>
      </div>


      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-zinc-50">Severidade</label>
          <select
            {...register('severity')}
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="minor">Leve</option>
            <option value="moderate">Moderada</option>
            <option value="severe">Grave</option>
            <option value="critical">Crítica</option>
          </select>
          {errors.severity && (
            <p className="text-xs text-red-400 mt-1">{errors.severity.message}</p>
          )}
        </div>


        <div>
          <label className="block text-sm font-medium mb-1 text-zinc-50">Status</label>
          <select
            {...register('status')}
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="active">Ativa</option>
            <option value="recovering">Recuperando</option>
            <option value="recovered">Recuperada</option>
          </select>
          {errors.status && (
            <p className="text-xs text-red-400 mt-1">{errors.status.message}</p>
          )}
        </div>
      </div>


      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-zinc-50">Data da Lesão</label>
          <input
            type="date"
            {...register('injuryDate')}
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
          {errors.injuryDate && (
            <p className="text-xs text-red-400 mt-1">{errors.injuryDate.message}</p>
          )}
        </div>


        <div>
          <label className="block text-sm font-medium mb-1 text-zinc-50">
            Data de Recuperação
          </label>
          <input
            type="date"
            {...register('recoveryDate')}
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
          {errors.recoveryDate && (
            <p className="text-xs text-red-400 mt-1">{errors.recoveryDate.message}</p>
          )}
        </div>
      </div>


      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-zinc-50">
            Recuperação Esperada (dias)
          </label>
          <input
            type="number"
            {...register('expectedRecovery', { valueAsNumber: true })}
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            placeholder="Ex: 30"
          />
          {errors.expectedRecovery && (
            <p className="text-xs text-red-400 mt-1">{errors.expectedRecovery.message}</p>
          )}
        </div>


        <div>
          <label className="block text-sm font-medium mb-1 text-zinc-50">
            Recuperação Real (dias)
          </label>
          <input
            type="number"
            {...register('actualRecovery', {
              valueAsNumber: true,
              setValueAs: (v) => (v === '' ? undefined : v),
            })}
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            placeholder="Opcional"
          />
          {errors.actualRecovery && (
            <p className="text-xs text-red-400 mt-1">{errors.actualRecovery.message}</p>
          )}
        </div>
      </div>


      <div>
        <label className="block text-sm font-medium mb-1 text-zinc-50">Causa</label>
        <textarea
          {...register('cause')}
          rows={2}
          className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          placeholder="Descreva a causa da lesão"
        />
        {errors.cause && <p className="text-xs text-red-400 mt-1">{errors.cause.message}</p>}
      </div>


      <div>
        <label className="block text-sm font-medium mb-1 text-zinc-50">
          Protocolo de Tratamento
        </label>
        <textarea
          {...register('treatmentProtocol')}
          rows={4}
          className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          placeholder="Descreva o protocolo de tratamento"
        />
        {errors.treatmentProtocol && (
          <p className="text-xs text-red-400 mt-1">{errors.treatmentProtocol.message}</p>
        )}
      </div>


      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {injuryRecord ? 'Salvar' : 'Criar'}
        </Button>
      </div>
    </form>
  )
}
