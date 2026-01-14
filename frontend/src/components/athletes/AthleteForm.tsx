import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import {
  createAthleteSchema,
  type CreateAthleteFormValues,
  type UpdateAthleteFormValues,
} from '../../features/athletes/schemas'
import type { Athlete } from '../../features/athletes/api'

type AthleteFormProps = {
  athlete?: Athlete
  onSubmit: (values: CreateAthleteFormValues | UpdateAthleteFormValues) => void
  onCancel: () => void
  isLoading?: boolean
}

export function AthleteForm({ athlete, onSubmit, onCancel, isLoading }: AthleteFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAthleteFormValues>({
    resolver: zodResolver(createAthleteSchema),
    defaultValues: athlete
      ? {
          name: athlete.name,
          sport: athlete.sport,
          birthDate: athlete.birthDate,
          height: athlete.height,
          weight: athlete.weight,
          status: athlete.status,
          phone: athlete.phone ?? '',
          email: athlete.email,
        }
      : {
          name: '',
          sport: '',
          birthDate: new Date().getFullYear() - 18,
          height: null,
          weight: null,
          status: 'active',
          phone: '',
          email: '',
        },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-zinc-50">Nome</label>
        <input
          {...register('name')}
          className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
        />
        {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-zinc-50">Esporte</label>
        <input
          {...register('sport')}
          className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
        />
        {errors.sport && (
          <p className="text-xs text-red-400 mt-1">{errors.sport.message}</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-zinc-50">Ano de Nascimento</label>
          <input
            type="number"
            {...register('birthDate', { valueAsNumber: true })}
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
          {errors.birthDate && (
            <p className="text-xs text-red-400 mt-1">{errors.birthDate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-zinc-50">Altura (cm)</label>
          <input
            type="number"
            {...register('height', { valueAsNumber: true, setValueAs: (v) => (v === '' ? null : v) })}
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
          {errors.height && <p className="text-xs text-red-400 mt-1">{errors.height.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-zinc-50">Peso (kg)</label>
          <input
            type="number"
            step="0.1"
            {...register('weight', { valueAsNumber: true, setValueAs: (v) => (v === '' ? null : v) })}
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />
          {errors.weight && <p className="text-xs text-red-400 mt-1">{errors.weight.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-zinc-50">E-mail</label>
        <input
          type="email"
          {...register('email')}
          className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
        />
        {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-zinc-50">Telefone</label>
        <input
          type="tel"
          {...register('phone')}
          className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
        />
        {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-zinc-50">Status</label>
        <select
          {...register('status')}
          className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
        >
          <option value="active">Ativo</option>
          <option value="treatment">Em Tratamento</option>
          <option value="removed">Removido</option>
          <option value="released">Liberado</option>
        </select>
        {errors.status && (
          <p className="text-xs text-red-400 mt-1">{errors.status.message}</p>
        )}
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {athlete ? 'Salvar' : 'Criar'}
        </Button>
      </div>
    </form>
  )
}
