import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../../lib/api'

export type DashboardOverview = {
  total_athletes: number
  active_athletes: number
  high_risk_athletes: number
  critical_fatigue_athletes: number
  avg_vo2_max: number
  updated_at: string
}

export type DashboardTrends = {
  daily_metrics: Array<{
    date: string
    avg_fatigue: number
    avg_vo2: number
    avg_heart_rate: number
    total_measurements: number
  }>
  injury_trends: Array<{
    date: string
    new_injuries: number
  }>
  period: string
  updated_at: string
}

export type DashboardAlert = {
  athlete_id: number
  name: string
  position?: string
  alert_type: 'critical_fatigue' | 'high_risk' | 'recent_injury'
  severity: 'high' | 'medium' | 'low'
  fatigue_score?: number
  risk_level?: string
  injury_type?: string
  time_ago?: string
}

export type DashboardAlertsResponse = {
  critical_fatigue: DashboardAlert[]
  high_risk_active: DashboardAlert[]
  recent_injuries: DashboardAlert[]
  total_alerts: number
  updated_at: string
}

export type TeamPerformance = {
  by_position: Array<{
    position: string
    avg_vo2: number
    avg_fatigue: number
    total_athletes: number
    performance_score: number
  }>
  by_team: Array<{
    team: string
    avg_vo2: number
    avg_fatigue: number
    total_athletes: number
    performance_score: number
  }>
  risk_distribution: Record<string, {
    low: number
    medium: number
    high: number
    critical: number
  }>
  updated_at: string
}

export function useDashboardOverview() {
  return useQuery({
    queryKey: ['dashboard', 'overview'],
    queryFn: () => apiClient.get<DashboardOverview>('/api/dashboard/overview'),
  })
}

export function useDashboardTrends() {
  return useQuery({
    queryKey: ['dashboard', 'trends'],
    queryFn: () => apiClient.get<DashboardTrends>('/api/dashboard/trends'),
  })
}

export function useDashboardAlerts() {
  return useQuery({
    queryKey: ['dashboard', 'alerts'],
    queryFn: () => apiClient.get<DashboardAlertsResponse>('/api/dashboard/alerts'),
  })
}

export function useTeamPerformance() {
  return useQuery({
    queryKey: ['dashboard', 'team-performance'],
    queryFn: () => apiClient.get<TeamPerformance>('/api/dashboard/team-performance'),
  })
}
