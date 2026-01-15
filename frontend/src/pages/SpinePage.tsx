import { SpineViewer } from '../components/spine/SpineViewer'

export function SpinePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Coluna Vertebral</h1>
        <p className="text-sm text-zinc-400">
          Visualização do modelo 3D da coluna vertebral
        </p>
      </div>
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
        <div className="w-full" style={{ height: '600px' }}>
          <SpineViewer />
        </div>
      </div>
    </div>
  )
}
