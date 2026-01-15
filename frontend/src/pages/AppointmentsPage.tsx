import { useState } from 'react'
import { Plus, Pencil, Trash2, Check, X, Calendar } from 'lucide-react'
import {
  useAppointments,
  useCreateAppointment,
  useUpdateAppointment,
  useDeleteAppointment,
  useConfirmAppointment,
  useCancelAppointment,
  useRescheduleAppointment,
} from '../features/appointments/hooks'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Card, CardContent } from '../components/ui/card'
import { EmptyState } from '../components/ui/empty-state'
import { Loading } from '../components/ui/loading'
import { Input } from '../components/ui/input'
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
import { AppointmentForm } from '../components/appointments/AppointmentForm'
import type { Appointment } from '../features/appointments/api'
import type {
  CreateAppointmentFormValues,
  UpdateAppointmentFormValues,
} from '../features/appointments/schemas'

export function AppointmentsPage() {
  const { data, isLoading } = useAppointments()
  const createMutation = useCreateAppointment()
  const updateMutation = useUpdateAppointment()
  const deleteMutation = useDeleteAppointment()
  const confirmMutation = useConfirmAppointment()
  const cancelMutation = useCancelAppointment()
  const rescheduleMutation = useRescheduleAppointment()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [reschedulingId, setReschedulingId] = useState<number | null>(null)
  const [newRescheduleDate, setNewRescheduleDate] = useState('')

  const appointments = data?.appointments ?? []

  const handleCreate = (values: CreateAppointmentFormValues) => {
    const appointmentDate = new Date(values.appointmentDate)

    const payload: any = {
      athleteId: values.athleteId,
      appointmentDate: appointmentDate.toISOString(),
      durationMinutes: values.durationMinutes ?? 60,
      type: values.type,
      status: values.status ?? 'scheduled',
    }

    if (values.treatmentPlanId) {
      payload.treatmentPlanId = values.treatmentPlanId
    }
    if (values.notes) {
      payload.notes = values.notes
    }
    if (values.reason) {
      payload.reason = values.reason
    }
    if (values.observations) {
      payload.observations = values.observations
    }

    createMutation.mutate(payload, {
      onSuccess: () => {
        setIsCreateOpen(false)
        toast({
          variant: 'success',
          title: 'Atendimento criado com sucesso!',
          description: 'O atendimento foi agendado.',
        })
      },
      onError: () => {
        toast({
          variant: 'danger',
          title: 'Erro ao criar atendimento',
          description: 'Ocorreu um erro ao criar o atendimento. Tente novamente.',
        })
      },
    })
  }

  const handleUpdate = (values: UpdateAppointmentFormValues) => {
    if (editingAppointment) {
      const payload: any = {}

      if (values.appointmentDate) {
        payload.appointmentDate = new Date(values.appointmentDate).toISOString()
      }
      if (values.durationMinutes !== undefined) {
        payload.durationMinutes = values.durationMinutes
      }
      if (values.type) {
        payload.type = values.type
      }
      if (values.status) {
        payload.status = values.status
      }
      if (values.notes !== undefined) {
        payload.notes = values.notes
      }
      if (values.reason !== undefined) {
        payload.reason = values.reason
      }
      if (values.observations !== undefined) {
        payload.observations = values.observations
      }

      updateMutation.mutate(
        { id: editingAppointment.id, payload },
        {
          onSuccess: () => {
            setEditingAppointment(null)
            toast({
              variant: 'success',
              title: 'Atendimento atualizado com sucesso!',
              description: 'As informações foram atualizadas.',
            })
          },
          onError: () => {
            toast({
              variant: 'danger',
              title: 'Erro ao atualizar atendimento',
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
            title: 'Atendimento excluído com sucesso!',
            description: 'O registro foi removido do sistema.',
          })
        },
        onError: () => {
          toast({
            variant: 'danger',
            title: 'Erro ao excluir atendimento',
            description: 'Ocorreu um erro ao excluir. Tente novamente.',
          })
        },
      })
    }
  }

  const handleConfirm = (id: number) => {
    confirmMutation.mutate(id)
  }

  const handleCancel = (id: number) => {
    cancelMutation.mutate(id)
  }

  const handleReschedule = () => {
    if (reschedulingId && newRescheduleDate) {
      const appointmentDate = new Date(newRescheduleDate)
      rescheduleMutation.mutate(
        { id: reschedulingId, newDate: appointmentDate.toISOString() },
        {
          onSuccess: () => {
            setReschedulingId(null)
            setNewRescheduleDate('')
          },
        },
      )
    }
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: 'info' | 'success' | 'warning' | 'danger' | 'default'; label: string }> = {
      scheduled: { variant: 'info', label: 'Agendado' },
      confirmed: { variant: 'success', label: 'Confirmado' },
      in_progress: { variant: 'warning', label: 'Em Andamento' },
      completed: { variant: 'success', label: 'Concluído' },
      cancelled: { variant: 'danger', label: 'Cancelado' },
      no_show: { variant: 'danger', label: 'Não Compareceu' },
      rescheduled: { variant: 'warning', label: 'Reagendado' },
    }
    return config[status] || { variant: 'default' as const, label: status }
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      consultation: 'Consulta',
      treatment: 'Tratamento',
      follow_up: 'Acompanhamento',
      assessment: 'Avaliação',
      review: 'Revisão',
    }
    return labels[type] || type
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-secondary-900">Atendimentos</h2>
          <p className="text-sm text-secondary-500 mt-1">
            Gerencie os atendimentos e consultas dos atletas
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
          Novo Atendimento
        </Button>
      </div>

      {/* Content */}
      {isLoading ? (
        <Card>
          <CardContent className="py-12">
            <Loading size="lg" text="Carregando atendimentos..." />
          </CardContent>
        </Card>
      ) : appointments.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <EmptyState
              icon={<Calendar className="h-8 w-8" />}
              title="Nenhum atendimento cadastrado"
              description="Comece agendando o primeiro atendimento"
              action={
                <Button onClick={() => setIsCreateOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
                  Agendar Atendimento
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
                <TableHead>Atleta</TableHead>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => {
                const statusConfig = getStatusBadge(appointment.status)
                return (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium text-secondary-900">
                      {appointment.athlete?.name || `Atleta #${appointment.athleteId}`}
                    </TableCell>
                    <TableCell className="text-secondary-500">
                      {new Date(appointment.appointmentDate).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                    <TableCell className="text-secondary-500">{getTypeLabel(appointment.type)}</TableCell>
                    <TableCell className="text-secondary-500">
                      {appointment.durationMinutes} min
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        {appointment.status === 'scheduled' && (
                          <>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  onClick={() => handleConfirm(appointment.id)}
                                  className="text-success-600 hover:text-success-700 hover:bg-success-50"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Confirmar atendimento</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  onClick={() => handleCancel(appointment.id)}
                                  className="text-danger-600 hover:text-danger-700 hover:bg-danger-50"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Cancelar atendimento</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  onClick={() => setReschedulingId(appointment.id)}
                                  className="text-info-600 hover:text-info-700 hover:bg-info-50"
                                >
                                  <Calendar className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Reagendar atendimento</TooltipContent>
                            </Tooltip>
                          </>
                        )}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => setEditingAppointment(appointment)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Editar atendimento</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => setDeletingId(appointment.id)}
                              className="text-danger-600 hover:text-danger-700 hover:bg-danger-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Excluir atendimento</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          <p className="text-sm text-secondary-500 text-center">
            Mostrando {appointments.length} {appointments.length === 1 ? 'atendimento' : 'atendimentos'}
          </p>
        </>
      )}

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Atendimento</DialogTitle>
            <DialogDescription>Adicione um novo atendimento</DialogDescription>
          </DialogHeader>
          <AppointmentForm
            onSubmit={(values) => handleCreate(values as CreateAppointmentFormValues)}
            onCancel={() => setIsCreateOpen(false)}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editingAppointment}
        onOpenChange={(open) => !open && setEditingAppointment(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Atendimento</DialogTitle>
            <DialogDescription>Atualize as informações do atendimento</DialogDescription>
          </DialogHeader>
          {editingAppointment && (
            <AppointmentForm
              appointment={editingAppointment}
              onSubmit={(values) => handleUpdate(values as UpdateAppointmentFormValues)}
              onCancel={() => setEditingAppointment(null)}
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
              Tem certeza que deseja excluir este atendimento? Esta ação não pode ser desfeita.
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

      {/* Reschedule Dialog */}
      <Dialog
        open={!!reschedulingId}
        onOpenChange={(open) => !open && setReschedulingId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reagendar Atendimento</DialogTitle>
            <DialogDescription>Selecione a nova data e hora para o atendimento</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="datetime-local"
              label="Nova Data e Hora"
              value={newRescheduleDate}
              onChange={(e) => setNewRescheduleDate(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReschedulingId(null)}>
              Cancelar
            </Button>
            <Button
              onClick={handleReschedule}
              isLoading={rescheduleMutation.isPending}
              disabled={!newRescheduleDate}
            >
              Reagendar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
