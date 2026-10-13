import { useQueryClient } from '@tanstack/react-query'
import {
  createContext,
  type PropsWithChildren,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { authQueryKeys } from '@/services/auth/key'

interface AuthContextType {
  isSigningOut: boolean
  signIn: (credentials: SignInCredentials) => Promise<void>
  signOut: () => Promise<void>
  status: AuthStatus
  user: AuthUser | null
}

type AuthStatus = 'anonymous' | 'authenticated' | 'loading'

interface AuthUser {
  email: string
  id: string
  name: string
}

interface SignInCredentials {
  email: string
  password: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    let active = true

    loadSessionUser()
      .then((sessionUser) => {
        if (!active) return

        setUser(sessionUser)
        setStatus(sessionUser ? 'authenticated' : 'anonymous')
      })
      .catch(() => {
        if (!active) return

        setUser(null)
        setStatus('anonymous')
      })

    return () => {
      active = false
    }
  }, [])

  const signIn = useCallback(async (credentials: SignInCredentials) => {
    const { authClient, resetAccessToken } = await import('@/libs/auth')
    const { error } = await authClient.signIn.email(credentials)

    if (error) {
      throw new Error(error.message || 'Unable to sign in. Please try again.')
    }

    resetAccessToken()

    const sessionUser = await loadSessionUser()

    if (!sessionUser) {
      throw new Error('Unable to verify the new session. Please try again.')
    }

    setUser(sessionUser)
    setStatus('authenticated')
  }, [])

  const signOut = useCallback(async () => {
    setIsSigningOut(true)

    try {
      const { authClient, resetAccessToken } = await import('@/libs/auth')

      await authClient.signOut()
      resetAccessToken()
      queryClient.removeQueries({ queryKey: authQueryKeys.me() })
      setUser(null)
      setStatus('anonymous')
    }
    finally {
      setIsSigningOut(false)
    }
  }, [queryClient])

  const contextValue = useMemo<AuthContextType>(() => ({
    isSigningOut,
    signIn,
    signOut,
    status,
    user,
  }), [isSigningOut, signIn, signOut, status, user])

  return <AuthContext value={contextValue}>{children}</AuthContext>
}

export function useAuth() {
  const context = use(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}

async function loadSessionUser(): Promise<AuthUser | null> {
  const { authClient } = await import('@/libs/auth')
  const { data } = await authClient.getSession()

  return data
    ? {
        email: data.user.email,
        id: data.user.id,
        name: data.user.name,
      }
    : null
}
