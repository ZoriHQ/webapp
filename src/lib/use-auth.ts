import { useUser } from '@stackframe/react'
import { useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'

export interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: any | null
}

export function useAuth() {
  const user = useUser()
  const router = useRouter()

  const isAuthenticated = !!user
  const isLoading = false // Stack manages loading state internally

  const checkAuth = () => {
    return isAuthenticated
  }

  const requireAuth = () => {
    if (!checkAuth()) {
      router.navigate({ to: '/login' })
      return false
    }
    return true
  }

  const getUser = () => {
    return user
  }

  const getOrganization = () => {
    // Stack handles organizations differently - adjust based on your setup
    return (user as any)?.selectedTeam ?? null
  }

  const getToken = async (): Promise<string> => {
    const tokens = await user?.currentSession.getTokens()
    return tokens?.accessToken ?? ''
  }

  return {
    isAuthenticated,
    isLoading,
    account: user,
    organization: getOrganization(),
    user,
    checkAuth,
    requireAuth,
    getUser,
    getOrganization,
    getToken,
  }
}

// Hook for protecting routes
export function useAuthGuard(redirectTo = '/login') {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.navigate({ to: redirectTo })
    }
  }, [isAuthenticated, isLoading, redirectTo, router])

  return { isAuthenticated, isLoading }
}

// Hook for redirecting authenticated users (e.g., from login page)
export function useGuestGuard(redirectTo = '/projects') {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.navigate({ to: redirectTo })
    }
  }, [isAuthenticated, isLoading, redirectTo, router])

  return { isAuthenticated, isLoading }
}
