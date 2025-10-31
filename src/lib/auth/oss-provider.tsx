import { createContext, useContext, useEffect, useState } from 'react'
import { loginWithCredentials } from './api-endpoints'
import type { ReactNode } from 'react'
import type { AuthProvider, AuthUser } from './types'

/**
 * OSS Auth Provider
 * JWT-based authentication provider for self-hosted/OSS deployments
 * Stores JWT token and user data in localStorage
 */

const OSS_TOKEN_KEY = 'oss_auth_token'
const OSS_USER_KEY = 'oss_auth_user'

class OSSAuthProvider implements AuthProvider {
  private user: AuthUser | null = null
  private token: string | null = null
  private loading = true
  private listeners: Array<() => void> = []

  constructor() {
    // Restore session from localStorage on init
    this.restoreSession()
  }

  private restoreSession(): void {
    try {
      const storedToken = localStorage.getItem(OSS_TOKEN_KEY)
      const storedUser = localStorage.getItem(OSS_USER_KEY)

      if (storedToken && storedUser) {
        this.token = storedToken
        this.user = JSON.parse(storedUser)
      }
    } catch (error) {
      console.error('Failed to restore session:', error)
      this.clearSession()
    } finally {
      this.loading = false
      this.notifyListeners()
    }
  }

  private clearSession(): void {
    this.user = null
    this.token = null
    localStorage.removeItem(OSS_TOKEN_KEY)
    localStorage.removeItem(OSS_USER_KEY)
    this.notifyListeners()
  }

  private saveSession(token: string, user: AuthUser): void {
    this.token = token
    this.user = user
    localStorage.setItem(OSS_TOKEN_KEY, token)
    localStorage.setItem(OSS_USER_KEY, JSON.stringify(user))
    this.notifyListeners()
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener())
  }

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  getUser(): AuthUser | null {
    return this.user
  }

  isAuthenticated(): boolean {
    return this.user !== null && this.token !== null
  }

  isLoading(): boolean {
    return this.loading
  }

  async signIn(email: string, password: string): Promise<void> {
    try {
      const response = await loginWithCredentials(email, password)
      this.saveSession(response.token, response.user)
    } catch (error) {
      console.error('Sign in failed:', error)
      throw error
    }
  }

  signUp(_email: string, _password: string, _name: string): Promise<void> {
    // Sign up not supported in OSS mode
    return Promise.reject(
      new Error(
        'Sign up is not available in OSS mode. Please contact your administrator.',
      ),
    )
  }

  async signOut(): Promise<void> {
    this.clearSession()
    return Promise.resolve()
  }

  async getToken(): Promise<string | null> {
    return Promise.resolve(this.token)
  }
}

// Create singleton instance
const ossProvider = new OSSAuthProvider()

// Create context
const OSSAuthContext = createContext<AuthProvider>(ossProvider)

// Provider component with reactivity
export function OSSAuthProviderComponent({
  children,
}: {
  children: ReactNode
}) {
  // Force re-render when auth state changes
  const [, setUpdateCounter] = useState(0)

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = ossProvider.subscribe(() => {
      setUpdateCounter((prev) => prev + 1)
    })

    return unsubscribe
  }, [])

  return (
    <OSSAuthContext.Provider value={ossProvider}>
      {children}
    </OSSAuthContext.Provider>
  )
}

// Hook to use OSS auth with reactivity
export function useOSSAuth(): AuthProvider {
  const context = useContext(OSSAuthContext)
  const [, setUpdateCounter] = useState(0)

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = ossProvider.subscribe(() => {
      setUpdateCounter((prev) => prev + 1)
    })

    return unsubscribe
  }, [])

  return context
}

export { ossProvider }
