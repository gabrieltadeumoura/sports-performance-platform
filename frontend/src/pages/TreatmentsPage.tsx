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
import { Badge } from '../components/ui/badge'
import { Card, CardContent } from '../components/ui/card'
import { EmptyState } from '../components/ui/empty-state'
import { Loading } from '../components/ui/loading'
import { Tooltip, TooltipContent, TooltipTrigger } from '../components/ui/tooltip'
import { toast } from '../components/ui/use-toast'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
        toast({
          variant: 'success',
          title: 'Tratamento criado com sucesso!',
          description: 'O plano de tratamento foi adicionado ao sistema.',
        })
      },
      onError: () => {
        toast({
          variant: 'danger',
          title: 'Erro ao criar tratamento',
          description: 'Ocorreu um erro ao criar o tratamento. Tente novamente.',
        })
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
            toast({
              variant: 'success',
              title: 'Tratamento atualizado com sucesso!',
              description: 'As informações foram atualizadas.',
            })
          },
          onError: () => {
            toast({
              variant: 'danger',
              title: 'Erro ao atualizar tratamento',
              description: 'Ocorreu um erro ao atualizar. Tente novamente.',
            })
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
          toast({
            variant: 'success',
            title: 'Tratamento excluído com sucesso!',
            description: 'O registro foi removido do sistema.',
          })
        },
        onError: () => {
          toast({
            variant: 'danger',
            title: 'Erro ao excluir tratamento',
            description: 'Ocorreu um erro ao excluir. Tente novamente.',
          })
        },
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: 'default' | 'success' | 'warning' | 'info' | 'danger'; label: string }> = {
      draft: { variant: 'default', label: 'Rascunho' },
      active: { variant: 'success', label: 'Ativo' },
      paused: { variant: 'warning', label: 'Pausado' },
      completed: { variant: 'info', label: 'Concluído' },
      cancelled: { variant: 'danger', label: 'Cancelado' },
    }
    return config[status] || { variant: 'default' as const, label: status }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-linear-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">Tratamentos</h2>
          <p className="text-sm text-secondary-500 mt-1">
            Gerencie os planos de tratamento dos pacientes
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
          Novo Tratamento
        </Button>
      </div>

      {/* Content */}
      {isLoading ? (
        <Card>
          <CardContent className="py-12">
            <Loading size="lg" text="Carregando tratamentos..." />
          </CardContent>
        </Card>
      ) : treatmentPlans.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <EmptyState
              icon={<Plus className="h-8 w-8" />}
              title="Nenhum tratamento cadastrado"
              description="Comece adicionando o primeiro plano de tratamento"
              action={
                <Button onClick={() => setIsCreateOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
                  Adicionar Tratamento
                </Button>
              }
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente</TableHead>
                <TableHead>Diagnóstico</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data Início</TableHead>
                <TableHead>Data Término</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {treatmentPlans.map((plan) => {
                const statusConfig = getStatusBadge(plan.status)
                return (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium text-secondary-900">
                      {plan.athlete?.name || `Paciente #${plan.athleteId}`}
                    </TableCell>
                    <TableCell className="text-secondary-500 max-w-xs truncate">
                      {plan.diagnosis}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                    </TableCell>
                    <TableCell className="text-secondary-500">
                      {new Date(plan.startDate).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-secondary-500">
                      {plan.endDate ? new Date(plan.endDate).toLocaleDateString('pt-BR') : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        {plan.status === 'draft' && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => activateMutation.mutate(plan.id)}
                              >
                                <Play className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Ativar tratamento</TooltipContent>
                          </Tooltip>
                        )}
                        {plan.status === 'active' && (
                          <>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  onClick={() => pauseMutation.mutate(plan.id)}
                                >
                                  <Pause className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Pausar tratamento</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  onClick={() => completeMutation.mutate(plan.id)}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Concluir tratamento</TooltipContent>
                            </Tooltip>
                          </>
                        )}
                        {plan.status === 'paused' && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => activateMutation.mutate(plan.id)}
                              >
                                <Play className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Retomar tratamento</TooltipContent>
                          </Tooltip>
                        )}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => setEditingPlan(plan)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Editar tratamento</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => setDeletingId(plan.id)}
                              className="text-danger-500 hover:text-danger-700 hover:bg-danger-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Excluir tratamento</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          <p className="text-sm text-secondary-500 text-center">
            Mostrando {treatmentPlans.length} {treatmentPlans.length === 1 ? 'tratamento' : 'tratamentos'}
          </p>
        </>
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

      {/* Delete Dialog */}
      <Dialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este tratamento? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingId(null)}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={deleteMutation.isPending}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
