import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Select } from '../ui/select'
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

const statusOptions = [
  { value: 'active', label: 'Ativo' },
  { value: 'treatment', label: 'Em Tratamento' },
  { value: 'removed', label: 'Removido' },
  { value: 'released', label: 'Liberado' },
]

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Input
            label="Nome completo"
            placeholder="Digite o nome do paciente"
            error={errors.name?.message}
            {...register('name')}
          />
        </div>

        <Input
          label="Esporte"
          placeholder="Ex: Futebol, Natacao..."
          error={errors.sport?.message}
          {...register('sport')}
        />

        <Input
          label="E-mail"
          type="email"
          placeholder="paciente@email.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Telefone"
          type="tel"
          placeholder="(00) 00000-0000"
          error={errors.phone?.message}
          {...register('phone')}
        />

        <Input
          label="Ano de Nascimento"
          type="number"
          placeholder="Ex: 1995"
          error={errors.birthDate?.message}
          {...register('birthDate', { valueAsNumber: true })}
        />

        <Input
          label="Altura (cm)"
          type="number"
          placeholder="Ex: 180"
          error={errors.height?.message}
          {...register('height', {
            valueAsNumber: true,
            setValueAs: (v) => (v === '' || v === undefined ? null : Number(v)),
          })}
        />

        <Input
          label="Peso (kg)"
          type="number"
          step="0.1"
          placeholder="Ex: 75.5"
          error={errors.weight?.message}
          {...register('weight', {
            valueAsNumber: true,
            setValueAs: (v) => (v === '' || v === undefined ? null : Number(v)),
          })}
        />

        <div className="sm:col-span-2">
          <Select
            label="Status"
            options={statusOptions}
            error={errors.status?.message}
            {...register('status')}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-secondary-100">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {athlete ? 'Salvar Alterações' : 'Criar Paciente'}
        </Button>
      </div>
    </form>
  )
}
