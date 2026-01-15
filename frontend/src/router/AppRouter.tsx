import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthLayout } from '../components/layout/AuthLayout'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { AthleteDetailPage } from '../pages/AthleteDetailPage'
import { AthletesPage } from '../pages/AthletesPage'
import { AppointmentsPage } from '../pages/AppointmentsPage'
import { DashboardPage } from '../pages/DashboardPage'
import { InjuryRecordsPage } from '../pages/InjuryRecordsPage'
import { LoginPage } from '../pages/LoginPage'
import { SpinePage } from '../pages/SpinePage'
import { TreatmentsPage } from '../pages/TreatmentsPage'
import { RegisterPage } from '../pages/RegisterPage'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/athletes" element={<AthletesPage />} />
        <Route path="/athletes/:id" element={<AthleteDetailPage />} />
        <Route path="/injury-records" element={<InjuryRecordsPage />} />
        <Route path="/treatments" element={<TreatmentsPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/spine" element={<SpinePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

