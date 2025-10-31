/**
 * Auth Provider Types
 * Defines the interface that all auth providers must implement
 */

export interface AuthUser {
  id: string
  email: string
  name: string
  avatar?: string
}

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface AuthProvider {
  /**
   * Get the current authenticated user
   */
  getUser: () => AuthUser | null

  /**
   * Check if a user is authenticated
   */
  isAuthenticated: () => boolean

  /**
   * Check if auth state is loading
   */
  isLoading: () => boolean

  /**
   * Sign in with email and password
   */
  signIn: (email: string, password: string) => Promise<void>

  /**
   * Sign up with email and password
   */
  signUp: (email: string, password: string, name: string) => Promise<void>

  /**
   * Sign out the current user
   */
  signOut: () => Promise<void>

  /**
   * Get the authentication token for API calls
   */
  getToken: () => Promise<string | null>
}

export type AuthMode = 'clerk' | 'oss'

export function getAuthMode(): AuthMode {
  const mode = import.meta.env.VITE_AUTH_MODE?.toLowerCase()
  if (mode === 'clerk' || mode === 'oss') {
    return mode
  }
  return 'oss'
}
