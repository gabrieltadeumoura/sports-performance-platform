import { useState } from 'react'
import { Plus, Pencil, Trash2, Play, Pause, Check } from 'lucide-react'
import {
  useTreatmentPlans,
  useCreateTreatmentPlan,
  useUpdateTreatmentPlan,
  useDeleteTreatmentPlan,
  useActivateTreatmentPlan,
  usePauseTreatmentPlan,
  useCompleteTreatmentPlan,
} from '../features/treatment-plans/hooks'
import { Button } from '../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog'
import { TreatmentPlanForm } from '../components/treatment-plans/TreatmentPlanForm'
import type { TreatmentPlan } from '../features/treatment-plans/api'
import type {
  CreateTreatmentPlanFormValues,
  UpdateTreatmentPlanFormValues,
} from '../features/treatment-plans/schemas'

export function TreatmentsPage() {
  const { data, isLoading } = useTreatmentPlans()
  const createMutation = useCreateTreatmentPlan()
  const updateMutation = useUpdateTreatmentPlan()
  const deleteMutation = useDeleteTreatmentPlan()
  const activateMutation = useActivateTreatmentPlan()
  const pauseMutation = usePauseTreatmentPlan()
  const completeMutation = useCompleteTreatmentPlan()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<TreatmentPlan | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const treatmentPlans = data?.treatmentPlans ?? []

  const handleCreate = (values: CreateTreatmentPlanFormValues) => {
    const payload = {
      athleteId: values.athleteId,
      injuryRecordId: values.injuryRecordId ?? undefined,
      diagnosis: values.diagnosis,
      objectives: values.objectives,
      notes: values.notes ?? undefined,
      startDate: new Date(values.startDate).toISOString(),
      endDate: values.endDate ? new Date(values.endDate).toISOString() : undefined,
      status: values.status,
    }
    createMutation.mutate(payload, {
      onSuccess: () => {
        setIsCreateOpen(false)
      },
    })
  }

  const handleUpdate = (values: UpdateTreatmentPlanFormValues) => {
    if (editingPlan) {
      const payload = {
        injuryRecordId: values.injuryRecordId ?? editingPlan.injuryRecordId ?? undefined,
        diagnosis: values.diagnosis ?? editingPlan.diagnosis,
        objectives: values.objectives ?? editingPlan.objectives,
        notes: values.notes ?? editingPlan.notes ?? undefined,
        startDate: values.startDate
          ? new Date(values.startDate).toISOString()
          : editingPlan.startDate,
        endDate: values.endDate
          ? new Date(values.endDate).toISOString()
          : editingPlan.endDate ?? undefined,
        status: values.status ?? editingPlan.status,
      }
      updateMutation.mutate(
        { id: editingPlan.id, payload },
        {
          onSuccess: () => {
            setEditingPlan(null)
          },
        },
      )
    }
  }

  const handleDelete = () => {
    if (deletingId) {
      deleteMutation.mutate(deletingId, {
        onSuccess: () => {
          setDeletingId(null)
        },
      })
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: 'Rascunho',
      active: 'Ativo',
      paused: 'Pausado',
      completed: 'Concluído',
      cancelled: 'Cancelado',
    }
    return labels[status] || status
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-zinc-800 text-zinc-400',
      active: 'bg-green-900/30 text-green-400',
      paused: 'bg-yellow-900/30 text-yellow-400',
      completed: 'bg-blue-900/30 text-blue-400',
      cancelled: 'bg-red-900/30 text-red-400',
    }
    return colors[status] || 'bg-zinc-800 text-zinc-400'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Tratamentos</h2>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Tratamento
        </Button>
      </div>

      {isLoading && <p className="text-sm text-zinc-400">Carregando tratamentos...</p>}

      {!isLoading && treatmentPlans.length === 0 && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-8 text-center">
          <p className="text-sm text-zinc-400">Nenhum tratamento cadastrado</p>
        </div>
      )}

      {!isLoading && treatmentPlans.length > 0 && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-zinc-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">Atleta</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">
                  Diagnóstico
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">
                  Data Início
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">
                  Data Término
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-zinc-400">Ações</th>
              </tr>
            </thead>
            <tbody>
              {treatmentPlans.map((plan) => (
                <tr key={plan.id} className="border-b border-zinc-800 hover:bg-zinc-900/50">
                  <td className="px-4 py-3 text-sm">
                    {plan.athlete?.name || `Atleta #${plan.athleteId}`}
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-300">
                    {plan.diagnosis.length > 50 ? `${plan.diagnosis.substring(0, 50)}...` : plan.diagnosis}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(plan.status)}`}>
                      {getStatusLabel(plan.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-300">
                    {new Date(plan.startDate).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-300">
                    {plan.endDate ? new Date(plan.endDate).toLocaleDateString('pt-BR') : '-'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {plan.status === 'draft' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => activateMutation.mutate(plan.id)}
                          className="h-8 w-8 p-0"
                          title="Ativar"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      {plan.status === 'active' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => pauseMutation.mutate(plan.id)}
                            className="h-8 w-8 p-0"
                            title="Pausar"
                          >
                            <Pause className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => completeMutation.mutate(plan.id)}
                            className="h-8 w-8 p-0"
                            title="Concluir"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {plan.status === 'paused' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => activateMutation.mutate(plan.id)}
                          className="h-8 w-8 p-0"
                          title="Retomar"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingPlan(plan)}
                        className="h-8 w-8 p-0"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingId(plan.id)}
                        className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Tratamento</DialogTitle>
            <DialogDescription>Adicione um novo plano de tratamento</DialogDescription>
          </DialogHeader>
          <TreatmentPlanForm
            onSubmit={(values) => handleCreate(values as CreateTreatmentPlanFormValues)}
            onCancel={() => setIsCreateOpen(false)}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingPlan} onOpenChange={(open) => !open && setEditingPlan(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Tratamento</DialogTitle>
            <DialogDescription>Atualize as informações do plano de tratamento</DialogDescription>
          </DialogHeader>
          {editingPlan && (
            <TreatmentPlanForm
              treatmentPlan={editingPlan}
              onSubmit={(values) => handleUpdate(values as UpdateTreatmentPlanFormValues)}
              onCancel={() => setEditingPlan(null)}
              isLoading={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este tratamento? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setDeletingId(null)}>
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
