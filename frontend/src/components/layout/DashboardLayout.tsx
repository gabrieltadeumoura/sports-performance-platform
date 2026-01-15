import { useState } from 'react'
import {
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Users,
  Stethoscope,
  Heart,
  Calendar,
  Activity,
  ChevronLeft,
} from 'lucide-react'
import { Navigate, Outlet, useLocation, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../features/auth/useAuth'
import { Button } from '../ui/button'
import { setAuthToken } from '../../lib/api'
import { cn } from '../../lib/utils'

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Pacientes',
    href: '/athletes',
    icon: Users,
  },
  {
    name: 'Lesoes',
    href: '/injury-records',
    icon: Stethoscope,
  },
  {
    name: 'Tratamentos',
    href: '/treatments',
    icon: Heart,
  },
  {
    name: 'Atendimentos',
    href: '/appointments',
    icon: Calendar,
  },
  {
    name: 'Coluna Vertebral',
    href: '/spine',
    icon: Activity,
  },
]

export function DashboardLayout() {
  const { isAuthenticated, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  const handleLogout = () => {
    logout()
    setAuthToken(null)
    navigate('/login', { replace: true })
  }

  const currentPath = location.pathname
  const currentPage = navigationItems.find((item) => currentPath.startsWith(item.href))

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-secondary-950/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r border-secondary-200 transition-transform duration-200 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-secondary-100">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-base font-semibold text-secondary-900">
                Sports
              </span>
              <span className="text-base font-semibold text-primary-600">
                Performance
              </span>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3">
          {navigationItems.map((item) => {
            const isActive = currentPath.startsWith(item.href)
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                )}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 shrink-0',
                    isActive ? 'text-primary-600' : 'text-secondary-400'
                  )}
                />
                <span className="flex-1">{item.name}</span>
                {isActive && (
                  <ChevronLeft className="h-4 w-4 text-primary-400" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-secondary-100 p-3">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-3 text-secondary-600 hover:text-danger-600 hover:bg-danger-50"
          >
            <LogOut className="h-5 w-5" />
            <span>Sair</span>
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-secondary-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 px-4 sm:px-6">
          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Breadcrumb / Page title */}
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-secondary-900">
              {currentPage?.name || 'Dashboard'}
            </h1>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="hidden sm:flex gap-2 text-secondary-600"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
