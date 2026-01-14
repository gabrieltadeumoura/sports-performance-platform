import { createContext } from 'react'

export type AuthContextValue = {
  isAuthenticated: boolean
  token: string | null
  setAuthenticated: (value: boolean, token?: string) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
