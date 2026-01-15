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
import { toast } from '../ui/use-toast'

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
    name: 'Lesões',
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  const handleLogout = () => {
    logout()
    setAuthToken(null)
    toast({
      variant: 'danger',
      title: 'Logout realizado',
      description: 'Você foi desconectado. Até logo!',
    })
    navigate('/login', { replace: true })
  }

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
          'fixed inset-y-0 left-0 z-50 bg-white border-r border-secondary-200 transition-all duration-200 ease-in-out lg:translate-x-0 flex flex-col',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          sidebarCollapsed ? 'lg:w-16' : 'lg:w-64 w-64'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-secondary-100 shrink-0">
          <Link 
            to="/dashboard" 
            className={cn(
              "flex items-center gap-3 transition-all duration-200",
              sidebarCollapsed && "lg:justify-center"
            )}
          >
            <div className="flex h-9 w-9 items-center justify-center shrink-0">
              <img
                src="/icon .png"
                alt="SportsPerformance Logo"
                className="h-full w-auto object-contain"
              />
            </div>
            <div className={cn(
              "transition-opacity duration-200",
              sidebarCollapsed ? "lg:opacity-0 lg:w-0 lg:overflow-hidden" : "opacity-100"
            )}>
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
        <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive = location.pathname.startsWith(item.href)
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
                <span className={cn(
                  "flex-1 transition-opacity duration-200",
                  sidebarCollapsed && "lg:opacity-0 lg:w-0 lg:overflow-hidden"
                )}>
                  {item.name}
                </span>
                {isActive && !sidebarCollapsed && (
                  <ChevronLeft className="h-4 w-4 text-primary-400" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* User section - fixed at bottom */}
        <div className="border-t border-secondary-100 p-3 mt-auto mb-4 shrink-0">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn(
              "w-full text-secondary-600 hover:text-danger-600 hover:bg-danger-50 transition-all duration-200",
              sidebarCollapsed ? "lg:justify-center" : "justify-start gap-3"
            )}
            title={sidebarCollapsed ? "Sair" : undefined}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className={cn(
              "transition-opacity duration-200",
              sidebarCollapsed && "lg:opacity-0 lg:w-0 lg:overflow-hidden"
            )}>
              Sair
            </span>
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className={cn(
        "transition-all duration-200",
        sidebarCollapsed ? "lg:pl-16" : "lg:pl-64"
      )}>
        {/* Top header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-secondary-200 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60 px-4 sm:px-6">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              const isDesktop = window.innerWidth >= 1024
              if (isDesktop) {
                setSidebarCollapsed(!sidebarCollapsed)
              } else {
                setSidebarOpen(true)
              }
            }}
            title={sidebarCollapsed ? "Expandir sidebar" : "Minimizar sidebar"}
          >
            <Menu className="h-5 w-5" />
          </Button>
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
