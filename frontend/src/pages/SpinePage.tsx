import { SpineViewer } from '../components/spine/SpineViewer'
import { Card, CardContent } from '../components/ui/card'

export function SpinePage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold bg-linear-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">Coluna Vertebral</h2>
        <p className="text-sm text-secondary-500 mt-1">
          Visualização interativa do modelo 3D da coluna vertebral para uso durante consultas
        </p>
      </div>

      {/* 3D Viewer */}
      <Card>
        <CardContent className="p-0 overflow-hidden">
          <div className="w-full" style={{ height: '700px' }}>
            <SpineViewer />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
