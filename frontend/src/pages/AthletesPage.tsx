import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import {
  useAthletes,
  useCreateAthlete,
  useUpdateAthlete,
  useDeleteAthlete,
} from '../features/athletes/hooks'
import { AthleteForm } from '../components/athletes/AthleteForm'
import { Button } from '../components/ui/button'
import type { CreateAthletePayload, UpdateAthletePayload, Athlete } from '../features/athletes/api'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog'
import type { CreateAthleteFormValues, UpdateAthleteFormValues } from '../features/athletes/schemas'

export function AthletesPage() {
  const { data, isLoading } = useAthletes()
  const createMutation = useCreateAthlete()
  const updateMutation = useUpdateAthlete()
  const deleteMutation = useDeleteAthlete()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingAthlete, setEditingAthlete] = useState<Athlete | null>(null)
  const [deletingAthlete, setDeletingAthlete] = useState<Athlete | null>(null)

  const athletes = data?.athletes ?? []

  const handleCreate = (values: CreateAthleteFormValues) => {
    const payload: CreateAthletePayload = {
      name: values.name,
      sport: values.sport,
      birthDate: values.birthDate,
      height: values.height ?? null,
      weight: values.weight ?? null,
      status: values.status,
      phone: values.phone ?? null,
      email: values.email,
    }
    createMutation.mutate(payload, {
      onSuccess: () => {
        setIsCreateOpen(false)
      },
    })
  }

  const handleUpdate = (values: UpdateAthleteFormValues) => {
    if (editingAthlete) {
      const payload: UpdateAthletePayload = {
        name: values.name,
        sport: values.sport,
        birthDate: values.birthDate,
        height: values.height ?? null,
        weight: values.weight ?? null,
        status: values.status,
        phone: values.phone ?? null,
        email: values.email,
      }
      updateMutation.mutate(
        { id: editingAthlete.id, payload },
        {
          onSuccess: () => {
            setEditingAthlete(null)
          },
        },
      )
    }
  }

  const handleDelete = () => {
    if (deletingAthlete) {
      deleteMutation.mutate(deletingAthlete.id, {
        onSuccess: () => {
          setDeletingAthlete(null)
        },
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Atletas</h2>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Atleta
        </Button>
      </div>

      {isLoading && <p className="text-sm text-zinc-400">Carregando atletas...</p>}

      {!isLoading && athletes.length === 0 && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-8 text-center">
          <p className="text-sm text-zinc-400">Nenhum atleta cadastrado</p>
        </div>
      )}

      {!isLoading && athletes.length > 0 && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-zinc-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">Nome</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">Esporte</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">E-mail</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">Idade</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-zinc-400">Ações</th>
              </tr>
            </thead>
            <tbody>
              {athletes.map((athlete) => {
                const age = athlete.birthDate
                  ? new Date().getFullYear() - athlete.birthDate
                  : null
                return (
                  <tr key={athlete.id} className="border-b border-zinc-800 hover:bg-zinc-900/50">
                    <td className="px-4 py-3">
                      <Link
                        to={`/athletes/${athlete.id}`}
                        className="text-sm font-medium hover:text-sky-400"
                      >
                        {athlete.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-zinc-300">{athlete.sport}</td>
                    <td className="px-4 py-3 text-sm text-zinc-300">{athlete.email}</td>
                    <td className="px-4 py-3 text-sm text-zinc-300">
                      {age !== null ? `${age} anos` : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          athlete.status === 'active'
                            ? 'bg-green-900/30 text-green-400'
                            : athlete.status === 'treatment'
                              ? 'bg-yellow-900/30 text-yellow-400'
                              : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {athlete.status === 'active'
                          ? 'Ativo'
                          : athlete.status === 'treatment'
                            ? 'Tratamento'
                            : athlete.status === 'removed'
                              ? 'Removido'
                              : 'Liberado'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingAthlete(athlete)}
                          className="h-8 w-8 p-0"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingAthlete(athlete)}
                          className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Atleta</DialogTitle>
            <DialogDescription>Adicione um novo atleta ao sistema</DialogDescription>
          </DialogHeader>
          <AthleteForm
            onSubmit={(values) => handleCreate(values as CreateAthleteFormValues)}
            onCancel={() => setIsCreateOpen(false)}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingAthlete} onOpenChange={(open) => !open && setEditingAthlete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Atleta</DialogTitle>
            <DialogDescription>Atualize as informações do atleta</DialogDescription>
          </DialogHeader>
          {editingAthlete && (
            <AthleteForm
              athlete={editingAthlete}
              onSubmit={(values) => handleUpdate(values as UpdateAthleteFormValues)}
              onCancel={() => setEditingAthlete(null)}
              isLoading={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!deletingAthlete} onOpenChange={(open) => !open && setDeletingAthlete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o atleta {deletingAthlete?.name}? Esta ação não pode
              ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setDeletingAthlete(null)}>
              Cancelar
            </Button>
            <Button
              variant="default"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-500"
            >
              {deleteMutation.isPending ? 'Excluindo...' : 'Excluir'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

