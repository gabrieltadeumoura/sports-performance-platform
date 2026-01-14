import { apiClient } from '../../lib/api'

type LoginPayload = {
  email: string
  password: string
}

type RegisterPayload = {
  name: string
  email: string
  password: string
}

type AuthResponse = {
  status: number
  token: string
}

type RegisterResponse = {
  status: number
  message: string
  user: unknown
}

export function login(payload: LoginPayload) {
  return apiClient.post<AuthResponse>('/login', payload)
}

export function register(payload: RegisterPayload) {
  return apiClient.post<RegisterResponse>('/register', payload)
}

