import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import {
  usePhysicalAssessments,
  useDeletePhysicalAssessment,
} from '../features/physical-tests/hooks'
import { Button } from '../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog'

export function PhysicalTestsPage() {
  const { data, isLoading } = usePhysicalAssessments()
  const deleteMutation = useDeletePhysicalAssessment()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const assessments = data?.data ?? []

  const handleDelete = () => {
    if (deletingId) {
      deleteMutation.mutate(deletingId, {
        onSuccess: () => {
          setDeletingId(null)
        },
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Testes físicos</h2>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Teste
        </Button>
      </div>

      {isLoading && <p className="text-sm text-zinc-400">Carregando testes físicos...</p>}

      {!isLoading && assessments.length === 0 && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-8 text-center">
          <p className="text-sm text-zinc-400">Nenhum teste físico cadastrado</p>
        </div>
      )}

      {!isLoading && assessments.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {assessments.map((assessment) => (
            <div
              key={assessment.id}
              className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium">{assessment.type}</div>
                  <div className="text-xs text-zinc-400">
                    {new Date(assessment.assessmentDate).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeletingId(assessment.id)}
                  className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              {assessment.observations && (
                <div className="text-xs text-zinc-400">{assessment.observations}</div>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Teste Físico</DialogTitle>
            <DialogDescription>Adicione um novo teste físico</DialogDescription>
          </DialogHeader>
          <div className="text-sm text-zinc-400">
            Formulário completo será implementado na próxima iteração
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este teste físico? Esta ação não pode ser desfeita.
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

