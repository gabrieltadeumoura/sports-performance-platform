import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Users, Search, Filter } from 'lucide-react'
import {
  useAthletes,
  useCreateAthlete,
  useUpdateAthlete,
  useDeleteAthlete,
} from '../features/athletes/hooks'
import { AthleteForm } from '../components/athletes/AthleteForm'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { Avatar } from '../components/ui/avatar'
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
import type { CreateAthletePayload, UpdateAthletePayload, Athlete } from '../features/athletes/api'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
  const [searchQuery, setSearchQuery] = useState('')

  const athletes = data?.athletes ?? []

  const filteredAthletes = athletes.filter((athlete) =>
    athlete.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    athlete.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
    athlete.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
        toast({
          variant: 'success',
          title: 'Paciente criado com sucesso!',
          description: `${values.name} foi adicionado ao sistema.`,
        })
      },
      onError: () => {
        toast({
          variant: 'danger',
          title: 'Erro ao criar paciente',
          description: 'Ocorreu um erro ao criar o paciente. Tente novamente.',
        })
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
            toast({
              variant: 'success',
              title: 'Paciente atualizado com sucesso!',
              description: `As informacoes de ${values.name} foram atualizadas.`,
            })
          },
          onError: () => {
            toast({
              variant: 'danger',
              title: 'Erro ao atualizar paciente',
              description: 'Ocorreu um erro ao atualizar o paciente. Tente novamente.',
            })
          },
        }
      )
    }
  }

  const handleDelete = () => {
    if (deletingAthlete) {
      const athleteName = deletingAthlete.name
      deleteMutation.mutate(deletingAthlete.id, {
        onSuccess: () => {
          setDeletingAthlete(null)
          toast({
            variant: 'success',
            title: 'Paciente excluido com sucesso!',
            description: `${athleteName} foi removido do sistema.`,
          })
        },
        onError: () => {
          toast({
            variant: 'danger',
            title: 'Erro ao excluir paciente',
            description: 'Ocorreu um erro ao excluir o paciente. Tente novamente.',
          })
        },
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: 'success' | 'warning' | 'danger' | 'default'; label: string }> = {
      active: { variant: 'success', label: 'Ativo' },
      treatment: { variant: 'warning', label: 'Tratamento' },
      removed: { variant: 'danger', label: 'Removido' },
      released: { variant: 'default', label: 'Liberado' },
    }
    return statusConfig[status] || { variant: 'default' as const, label: status }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-secondary-900">Pacientes</h2>
          <p className="text-sm text-secondary-500 mt-1">
            Gerencie os pacientes cadastrados na plataforma
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
          Novo paciente
        </Button>
      </div>

      {/* Filters */}
      <Card padding="sm">
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex-1">
              <Input
                placeholder="Buscar por nome, esporte ou e-mail..."
                leftIcon={<Search className="h-4 w-4" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" leftIcon={<Filter className="h-4 w-4" />}>
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <Card>
          <CardContent className="py-12">
            <Loading size="lg" text="Carregando pacientes..." />
          </CardContent>
        </Card>
      ) : filteredAthletes.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <EmptyState
              icon={<Users className="h-8 w-8" />}
              title={searchQuery ? 'Nenhum paciente encontrado' : 'Nenhum paciente cadastrado'}
              description={
                searchQuery
                  ? 'Tente ajustar os termos de busca'
                  : 'Comece adicionando seu primeiro paciente'
              }
              action={
                !searchQuery && (
                  <Button onClick={() => setIsCreateOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
                    Adicionar paciente
                  </Button>
                )
              }
            />
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Esporte</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Idade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Acoes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAthletes.map((athlete) => {
                  const age = athlete.birthDate
                    ? new Date().getFullYear() - athlete.birthDate
                    : null
                  const statusConfig = getStatusBadge(athlete.status)

                  return (
                    <TableRow key={athlete.id}>
                      <TableCell>
                        <Link
                          to={`/athletes/${athlete.id}`}
                          className="flex items-center gap-3 hover:opacity-80 transition-all duration-200 hover:text-primary-600"
                        >
                          <Avatar alt={athlete.name} size="sm" />
                          <span className="font-medium text-secondary-900 hover:text-primary-600">
                            {athlete.name}
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell>{athlete.sport}</TableCell>
                      <TableCell className="text-secondary-500">{athlete.email}</TableCell>
                      <TableCell>{age !== null ? `${age} anos` : '-'}</TableCell>
                      <TableCell>
                        <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => setEditingAthlete(athlete)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Editar paciente</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => setDeletingAthlete(athlete)}
                                className="text-danger-500 hover:text-danger-700 hover:bg-danger-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Excluir paciente</TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="grid gap-4 md:hidden">
            {filteredAthletes.map((athlete) => {
              const age = athlete.birthDate
                ? new Date().getFullYear() - athlete.birthDate
                : null
              const statusConfig = getStatusBadge(athlete.status)

              return (
                <Card key={athlete.id} padding="sm">
                  <CardContent>
                    <div className="flex items-start gap-3">
                      <Avatar alt={athlete.name} size="lg" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <Link
                            to={`/athletes/${athlete.id}`}
                            className="font-medium text-secondary-900 hover:text-primary-600 truncate"
                          >
                            {athlete.name}
                          </Link>
                          <Badge variant={statusConfig.variant} size="sm">
                            {statusConfig.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-secondary-500 mt-0.5">{athlete.sport}</p>
                        <p className="text-sm text-secondary-400 mt-0.5">{athlete.email}</p>
                        {age !== null && (
                          <p className="text-xs text-secondary-400 mt-1">{age} anos</p>
                        )}
                        <div className="flex items-center gap-2 mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingAthlete(athlete)}
                            leftIcon={<Pencil className="h-3.5 w-3.5" />}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingAthlete(athlete)}
                            className="text-danger-500 hover:text-danger-700 hover:bg-danger-50"
                            leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                          >
                            Excluir
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Results count */}
          <p className="text-sm text-secondary-500 text-center">
            Mostrando {filteredAthletes.length} de {athletes.length} pacientes
          </p>
        </>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Novo Paciente</DialogTitle>
            <DialogDescription>Adicione um novo paciente ao sistema</DialogDescription>
          </DialogHeader>
          <AthleteForm
            onSubmit={(values) => handleCreate(values as CreateAthleteFormValues)}
            onCancel={() => setIsCreateOpen(false)}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingAthlete} onOpenChange={(open) => !open && setEditingAthlete(null)}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Editar Paciente</DialogTitle>
            <DialogDescription>Atualize as informacoes do paciente</DialogDescription>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingAthlete} onOpenChange={(open) => !open && setDeletingAthlete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusao</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o paciente <strong>{deletingAthlete?.name}</strong>? Esta
              acao nao pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingAthlete(null)}>
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
