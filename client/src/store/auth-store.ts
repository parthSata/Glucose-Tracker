import { create } from 'zustand'

export type AuthUser = {
  id: string
  name: string
  email: string
  createdAt: string
}

type AuthState = {
  user: AuthUser | null
  token: string | null
  setSession: (user: AuthUser, token: string) => void
  clearSession: () => void
}

const TOKEN_KEY = 'sweety_token'
const USER_KEY = 'sweety_user'

function readStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) {
    return null
  }
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: readStoredUser(),
  token: localStorage.getItem(TOKEN_KEY),
  setSession: (user, token) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    set({ user, token })
  },
  clearSession: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    set({ user: null, token: null })
  },
}))
