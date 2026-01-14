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
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      scheduled: 'Agendado',
      confirmed: 'Confirmado',
      in_progress: 'Em Andamento',
      completed: 'Concluído',
      cancelled: 'Cancelado',
      no_show: 'Não Compareceu',
      rescheduled: 'Reagendado',
    }
    return labels[status] || status
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: 'bg-blue-900/30 text-blue-400',
      confirmed: 'bg-green-900/30 text-green-400',
      in_progress: 'bg-yellow-900/30 text-yellow-400',
      completed: 'bg-green-900/30 text-green-400',
      cancelled: 'bg-red-900/30 text-red-400',
      no_show: 'bg-orange-900/30 text-orange-400',
      rescheduled: 'bg-purple-900/30 text-purple-400',
    }
    return colors[status] || 'bg-zinc-800 text-zinc-400'
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Atendimentos</h2>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Atendimento
        </Button>
      </div>

      {isLoading && <p className="text-sm text-zinc-400">Carregando atendimentos...</p>}

      {!isLoading && appointments.length === 0 && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-8 text-center">
          <p className="text-sm text-zinc-400">Nenhum atendimento cadastrado</p>
        </div>
      )}

      {!isLoading && appointments.length > 0 && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-zinc-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">Atleta</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">
                  Data/Hora
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">Tipo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">Duração</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-zinc-400">Ações</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr
                  key={appointment.id}
                  className="border-b border-zinc-800 hover:bg-zinc-900/50"
                >
                  <td className="px-4 py-3 text-sm text-zinc-300">
                    {appointment.athlete?.name || `Atleta #${appointment.athleteId}`}
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-300">
                    {new Date(appointment.appointmentDate).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-4 py-3 text-sm">{getTypeLabel(appointment.type)}</td>
                  <td className="px-4 py-3 text-sm text-zinc-300">
                    {appointment.durationMinutes} min
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded ${getStatusColor(appointment.status)}`}
                    >
                      {getStatusLabel(appointment.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {appointment.status === 'scheduled' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleConfirm(appointment.id)}
                            className="h-8 w-8 p-0 text-green-400 hover:text-green-300"
                            title="Confirmar"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancel(appointment.id)}
                            className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                            title="Cancelar"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setReschedulingId(appointment.id)}
                            className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300"
                            title="Reagendar"
                          >
                            <Calendar className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingAppointment(appointment)}
                        className="h-8 w-8 p-0"
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingId(appointment.id)}
                        className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                        title="Excluir"
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

      <Dialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este atendimento? Esta ação não pode ser desfeita.
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
            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-50">
                Nova Data e Hora
              </label>
              <input
                type="datetime-local"
                value={newRescheduleDate}
                onChange={(e) => setNewRescheduleDate(e.target.value)}
                className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-50 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setReschedulingId(null)}>
                Cancelar
              </Button>
              <Button
                onClick={handleReschedule}
                disabled={!newRescheduleDate || rescheduleMutation.isPending}
              >
                {rescheduleMutation.isPending ? 'Reagendando...' : 'Reagendar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
