import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import {
  useInjuryRecords,
  useCreateInjuryRecord,
  useUpdateInjuryRecord,
  useDeleteInjuryRecord,
} from '../features/injury-records/hooks'
import { Button } from '../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog'
import { InjuryRecordForm } from '../components/injury-records/InjuryRecordForm'
import type {
  CreateInjuryRecordPayload,
  InjuryRecord,
} from '../features/injury-records/api'
import type {
  CreateInjuryRecordFormValues,
  UpdateInjuryRecordFormValues,
} from '../features/injury-records/schemas'

export function InjuryRecordsPage() {
  const { data, isLoading } = useInjuryRecords()
  const createMutation = useCreateInjuryRecord()
  const updateMutation = useUpdateInjuryRecord()
  const deleteMutation = useDeleteInjuryRecord()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<InjuryRecord | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const records = data?.data ?? []

  const handleCreate = (values: CreateInjuryRecordFormValues) => {
    const injuryDate = new Date(values.injuryDate)
    injuryDate.setHours(0, 0, 0, 0)
    
    const payload: any = {
      athleteId: values.athleteId,
      injuryType: values.injuryType,
      bodyPart: values.bodyPart,
      severity: values.severity,
      cause: values.cause,
      expectedRecovery: values.expectedRecovery,
      treatmentProtocol: values.treatmentProtocol,
      status: values.status,
      injuryDate: injuryDate.toISOString(),
    }

    if (values.actualRecovery !== null && values.actualRecovery !== undefined) {
      payload.actualRecovery = values.actualRecovery
    }

    if (values.recoveryDate) {
      const recoveryDate = new Date(values.recoveryDate)
      recoveryDate.setHours(0, 0, 0, 0)
      payload.recoveryDate = recoveryDate.toISOString()
    }

    createMutation.mutate(payload, {
      onSuccess: () => {
        setIsCreateOpen(false)
      },
    })
  }

  const handleUpdate = (values: UpdateInjuryRecordFormValues) => {
    if (editingRecord) {
      const injuryDate = values.injuryDate
        ? (() => {
            const date = new Date(values.injuryDate)
            date.setHours(0, 0, 0, 0)
            return date.toISOString()
          })()
        : editingRecord.injuryDate

      const recoveryDate = values.recoveryDate
        ? (() => {
            const date = new Date(values.recoveryDate)
            date.setHours(0, 0, 0, 0)
            return date.toISOString()
          })()
        : editingRecord.recoveryDate ?? null

      const payload: CreateInjuryRecordPayload = {
        athleteId: values.athleteId ?? editingRecord.athleteId,
        injuryType: values.injuryType ?? editingRecord.injuryType,
        bodyPart: values.bodyPart ?? editingRecord.bodyPart,
        severity: (values.severity ?? editingRecord.severity) as string,
        cause: values.cause ?? editingRecord.cause ?? '',
        expectedRecovery:
          values.expectedRecovery ??
          (typeof editingRecord.expectedRecovery === 'number'
            ? editingRecord.expectedRecovery
            : editingRecord.expectedRecovery
              ? parseInt(editingRecord.expectedRecovery.toString())
              : 0),
        actualRecovery:
          values.actualRecovery ??
          (editingRecord.actualRecovery
            ? typeof editingRecord.actualRecovery === 'number'
              ? editingRecord.actualRecovery
              : parseInt(editingRecord.actualRecovery.toString())
            : null),
        treatmentProtocol: values.treatmentProtocol ?? editingRecord.treatmentProtocol ?? '',
        status: (values.status ?? editingRecord.status) as string,
        injuryDate,
        recoveryDate,
      }
      updateMutation.mutate(
        { id: editingRecord.id, payload },
        {
          onSuccess: () => {
            setEditingRecord(null)
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

  const getSeverityLabel = (severity: string) => {
    const labels: Record<string, string> = {
      minor: 'Leve',
      moderate: 'Moderada',
      severe: 'Grave',
      critical: 'Crítica',
    }
    return labels[severity] || severity
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: 'Ativa',
      recovering: 'Recuperando',
      recovered: 'Recuperada',
    }
    return labels[status] || status
  }

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      minor: 'bg-green-900/30 text-green-400',
      moderate: 'bg-yellow-900/30 text-yellow-400',
      severe: 'bg-orange-900/30 text-orange-400',
      critical: 'bg-red-900/30 text-red-400',
    }
    return colors[severity] || 'bg-zinc-800 text-zinc-400'
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-red-900/30 text-red-400',
      recovering: 'bg-yellow-900/30 text-yellow-400',
      recovered: 'bg-green-900/30 text-green-400',
    }
    return colors[status] || 'bg-zinc-800 text-zinc-400'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Lesões</h2>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Lesão
        </Button>
      </div>

      {isLoading && <p className="text-sm text-zinc-400">Carregando registros de lesão...</p>}

      {!isLoading && records.length === 0 && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-8 text-center">
          <p className="text-sm text-zinc-400">Nenhum registro de lesão cadastrado</p>
        </div>
      )}

      {!isLoading && records.length > 0 && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-zinc-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">Atleta</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">Tipo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">
                  Parte do Corpo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">
                  Severidade
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-400">Data</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-zinc-400">Ações</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className="border-b border-zinc-800 hover:bg-zinc-900/50">
                  <td className="px-4 py-3 text-sm text-zinc-300">
                    {(record as any).athlete?.name || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm">{record.injuryType}</td>
                  <td className="px-4 py-3 text-sm text-zinc-300">{record.bodyPart}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded ${getSeverityColor(record.severity)}`}>
                      {getSeverityLabel(record.severity)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(record.status)}`}>
                      {getStatusLabel(record.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-300">
                    {new Date(record.injuryDate).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingRecord(record)}
                        className="h-8 w-8 p-0"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingId(record.id)}
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
            <DialogTitle>Novo Registro de Lesão</DialogTitle>
            <DialogDescription>Adicione um novo registro de lesão</DialogDescription>
          </DialogHeader>
          <InjuryRecordForm
            onSubmit={(values) => handleCreate(values as CreateInjuryRecordFormValues)}
            onCancel={() => setIsCreateOpen(false)}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingRecord} onOpenChange={(open) => !open && setEditingRecord(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Registro de Lesão</DialogTitle>
            <DialogDescription>Atualize as informações do registro de lesão</DialogDescription>
          </DialogHeader>
          {editingRecord && (
            <InjuryRecordForm
              injuryRecord={editingRecord}
              onSubmit={(values) => handleUpdate(values as UpdateInjuryRecordFormValues)}
              onCancel={() => setEditingRecord(null)}
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
              Tem certeza que deseja excluir este registro de lesão? Esta ação não pode ser
              desfeita.
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

