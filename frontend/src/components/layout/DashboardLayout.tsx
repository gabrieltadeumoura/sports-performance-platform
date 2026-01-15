import { LogOut } from 'lucide-react'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/useAuth'
import { Button } from '../ui/button'
import { setAuthToken } from '../../lib/api'

export function DashboardLayout() {
  const { isAuthenticated, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  const handleLogout = () => {
    logout()
    setAuthToken(null)
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen flex bg-zinc-950 text-zinc-50">
      <aside className="w-64 border-r border-zinc-800 p-4 hidden md:block">
        <div className="text-lg font-semibold mb-6">Sports Performance</div>
        <nav className="space-y-2 text-sm">
          <a href="/dashboard" className="block px-2 py-1 rounded hover:bg-zinc-800">
            Dashboard
          </a>
          <a href="/athletes" className="block px-2 py-1 rounded hover:bg-zinc-800">
            Pacientes
          </a>
          <a href="/injury-records" className="block px-2 py-1 rounded hover:bg-zinc-800">
            Lesões
          </a>
          <a href="/treatments" className="block px-2 py-1 rounded hover:bg-zinc-800">
            Tratamentos
          </a>
          <a href="/appointments" className="block px-2 py-1 rounded hover:bg-zinc-800">
            Atendimentos
          </a>
          <a href="/spine" className="block px-2 py-1 rounded hover:bg-zinc-800">
            Coluna Vertebral
          </a>
        </nav>
      </aside>
      <main className="flex-1 flex flex-col">
        <header className="h-14 border-b border-zinc-800 flex items-center justify-between px-4 text-sm">
          <div className="font-medium">Dashboard</div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </header>
        <div className="flex-1 p-4">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

