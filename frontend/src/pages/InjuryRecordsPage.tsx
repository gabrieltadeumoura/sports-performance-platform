import { useState } from 'react'
import { Plus, Pencil, Trash2, Stethoscope, Search } from 'lucide-react'
import {
  useInjuryRecords,
  useCreateInjuryRecord,
  useUpdateInjuryRecord,
  useDeleteInjuryRecord,
} from '../features/injury-records/hooks'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
  const [searchQuery, setSearchQuery] = useState('')

  const records = data?.data ?? []

  const filteredRecords = records.filter((record) =>
    record.injuryType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.bodyPart.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.athlete?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreate = (values: CreateInjuryRecordFormValues) => {
    const injuryDate = new Date(values.injuryDate)
    injuryDate.setHours(0, 0, 0, 0)

    const payload: CreateInjuryRecordPayload = {
      athleteId: values.athleteId,
      injuryType: values.injuryType,
      bodyPart: values.bodyPart,
      severity: values.severity,
      cause: values.cause,
      expectedRecovery: values.expectedRecovery,
      treatmentProtocol: values.treatmentProtocol,
      status: values.status,
      injuryDate: injuryDate.toISOString(),
      actualRecovery:
        values.actualRecovery !== null && values.actualRecovery !== undefined
          ? values.actualRecovery
          : null,
      recoveryDate: values.recoveryDate
        ? (() => {
            const recoveryDate = new Date(values.recoveryDate!)
            recoveryDate.setHours(0, 0, 0, 0)
            return recoveryDate.toISOString()
          })()
        : null,
    }

    createMutation.mutate(payload, {
      onSuccess: () => {
        setIsCreateOpen(false)
        toast({
          variant: 'success',
          title: 'Lesão registrada com sucesso!',
          description: 'O registro de lesão foi adicionado ao sistema.',
        })
      },
      onError: () => {
        toast({
          variant: 'danger',
          title: 'Erro ao registrar lesão',
          description: 'Ocorreu um erro ao criar o registro. Tente novamente.',
        })
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
            toast({
              variant: 'success',
              title: 'Lesão atualizada com sucesso!',
              description: 'As informações foram atualizadas.',
            })
          },
          onError: () => {
            toast({
              variant: 'danger',
              title: 'Erro ao atualizar lesão',
              description: 'Ocorreu um erro ao atualizar o registro. Tente novamente.',
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
            title: 'Lesão excluída com sucesso!',
            description: 'O registro foi removido do sistema.',
          })
        },
        onError: () => {
          toast({
            variant: 'danger',
            title: 'Erro ao excluir lesão',
            description: 'Ocorreu um erro ao excluir o registro. Tente novamente.',
          })
        },
      })
    }
  }

  const getSeverityBadge = (severity: string) => {
    const config: Record<string, { variant: 'success' | 'warning' | 'danger' | 'default'; label: string }> = {
      minor: { variant: 'success', label: 'Leve' },
      moderate: { variant: 'warning', label: 'Moderada' },
      severe: { variant: 'danger', label: 'Grave' },
      critical: { variant: 'danger', label: 'Critica' },
    }
    return config[severity] || { variant: 'default' as const, label: severity }
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: 'danger' | 'warning' | 'success' | 'default'; label: string }> = {
      active: { variant: 'danger', label: 'Ativa' },
      recovering: { variant: 'warning', label: 'Recuperando' },
      recovered: { variant: 'success', label: 'Recuperada' },
    }
    return config[status] || { variant: 'default' as const, label: status }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-linear-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">Lesões</h2>
          <p className="text-sm text-secondary-500 mt-1">
            Gerencie os registros de lesões dos pacientes
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
          Nova Lesão
        </Button>
      </div>

      {/* Search */}
      <Card padding="sm">
        <CardContent>
          <Input
            placeholder="Buscar por tipo de lesão, parte do corpo ou paciente..."
            leftIcon={<Search className="h-4 w-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Content */}
      {isLoading ? (
        <Card>
          <CardContent className="py-12">
            <Loading size="lg" text="Carregando lesões..." />
          </CardContent>
        </Card>
      ) : filteredRecords.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <EmptyState
              icon={<Stethoscope className="h-8 w-8" />}
              title={searchQuery ? 'Nenhuma lesão encontrada' : 'Nenhuma lesão cadastrada'}
              description={
                searchQuery
                  ? 'Tente ajustar os termos de busca'
                  : 'Comece adicionando o primeiro registro de lesão'
              }
              action={
                !searchQuery && (
                  <Button onClick={() => setIsCreateOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
                    Adicionar Lesão
                  </Button>
                )
              }
            />
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Parte do Corpo</TableHead>
                  <TableHead>Severidade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => {
                  const severityConfig = getSeverityBadge(record.severity)
                  const statusConfig = getStatusBadge(record.status)

                  return (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        {record.athlete?.name || '-'}
                      </TableCell>
                      <TableCell>{record.injuryType}</TableCell>
                      <TableCell className="text-secondary-500">{record.bodyPart}</TableCell>
                      <TableCell>
                        <Badge variant={severityConfig.variant}>{severityConfig.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                      </TableCell>
                      <TableCell className="text-secondary-500">
                        {new Date(record.injuryDate).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => setEditingRecord(record)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Editar lesão</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => setDeletingId(record.id)}
                                className="text-danger-500 hover:text-danger-700 hover:bg-danger-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Excluir lesão</TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile/Tablet Cards */}
          <div className="grid gap-4 lg:hidden">
            {filteredRecords.map((record) => {
              const severityConfig = getSeverityBadge(record.severity)
              const statusConfig = getStatusBadge(record.status)

              return (
                <Card key={record.id} padding="sm">
                  <CardContent>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-secondary-900">
                            {record.injuryType}
                          </span>
                          <Badge variant={severityConfig.variant} size="sm">
                            {severityConfig.label}
                          </Badge>
                          <Badge variant={statusConfig.variant} size="sm">
                            {statusConfig.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-secondary-500 mt-1">{record.bodyPart}</p>
                        <p className="text-sm text-secondary-400 mt-0.5">
                          {record.athlete?.name || '-'} - {new Date(record.injuryDate).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setEditingRecord(record)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setDeletingId(record.id)}
                          className="text-danger-500 hover:text-danger-700 hover:bg-danger-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <p className="text-sm text-secondary-500 text-center">
            Mostrando {filteredRecords.length} de {records.length} lesões
          </p>
        </>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
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

      {/* Edit Dialog */}
      <Dialog open={!!editingRecord} onOpenChange={(open) => !open && setEditingRecord(null)}>
        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
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

      {/* Delete Dialog */}
      <Dialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusao</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este registro de lesão? Esta ação não pode ser
              desfeita.
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
