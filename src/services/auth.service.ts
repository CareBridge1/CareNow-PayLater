import api from './api'

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  hospitalName: string
}

export interface AuthUser {
  id: string
  email: string
  hospitalName: string
}

export const authService = {
  login: async (data: LoginData) => {
    const res = await api.post('/auth/login', data)
    return res.data as { token: string; user: AuthUser; message: string }
  },

  register: async (data: RegisterData) => {
    const res = await api.post('/auth/register', data)
    return res.data as { token: string; user: AuthUser; message: string }
  },

  getMe: async () => {
    const res = await api.get('/auth/me')
    return res.data as { user: AuthUser }
  },
}
