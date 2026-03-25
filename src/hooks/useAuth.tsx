import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { authService, type AuthUser } from '../services/auth.service'

interface AuthContextType {
  user: AuthUser | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, hospitalName: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('carenow_token')
    const storedUser = localStorage.getItem('carenow_user')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const data = await authService.login({ email, password })
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem('carenow_token', data.token)
    localStorage.setItem('carenow_user', JSON.stringify(data.user))
  }

  const register = async (email: string, password: string, hospitalName: string) => {
    const data = await authService.register({ email, password, hospitalName })
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem('carenow_token', data.token)
    localStorage.setItem('carenow_user', JSON.stringify(data.user))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('carenow_token')
    localStorage.removeItem('carenow_user')
  }

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, isLoading, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
