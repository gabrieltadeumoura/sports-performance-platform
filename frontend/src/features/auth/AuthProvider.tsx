import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { setAuthToken } from '../../lib/api'
import { AuthContext } from './auth-context'

type AuthProviderProps = {
  children: ReactNode
}

const STORAGE_KEY = 'sports-platform:is-authenticated'
const TOKEN_KEY = 'sports-platform:auth-token'

function getInitialAuthState() {
  const stored = window.localStorage.getItem(STORAGE_KEY)
  const storedToken = window.localStorage.getItem(TOKEN_KEY)
  if (stored === 'true' && storedToken) {
    setAuthToken(storedToken)
    return { isAuthenticated: true, token: storedToken }
  }
  return { isAuthenticated: false, token: null }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const state = getInitialAuthState()
    return state.isAuthenticated
  })
  const [token, setToken] = useState<string | null>(() => {
    const state = getInitialAuthState()
    return state.token
  })

  useEffect(() => {
    setAuthToken(token)
  }, [token])

  const value = useMemo(
    () => ({
      isAuthenticated,
      token,
      setAuthenticated(next: boolean, newToken?: string) {
        setIsAuthenticated(next)
        if (next && newToken) {
          setToken(newToken)
          window.localStorage.setItem(STORAGE_KEY, String(next))
          window.localStorage.setItem(TOKEN_KEY, newToken)
        } else {
          setToken(null)
          window.localStorage.removeItem(STORAGE_KEY)
          window.localStorage.removeItem(TOKEN_KEY)
        }
      },
      logout() {
        setIsAuthenticated(false)
        setToken(null)
        window.localStorage.removeItem(STORAGE_KEY)
        window.localStorage.removeItem(TOKEN_KEY)
      },
    }),
    [isAuthenticated, token],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

