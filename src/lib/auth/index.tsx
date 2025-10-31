/**
 * Unified Auth System
 * Provides a single interface for authentication regardless of the underlying provider
 * Supports both Clerk (cloud) and OSS (self-hosted) modes
 */

import { getAuthMode } from './types'
import { OSSAuthProviderComponent, useOSSAuth } from './oss-provider'
import {
  ClerkAuthProviderComponent,
  useClerkAuthContext,
} from './clerk-provider'
import type { ReactNode } from 'react'
import type { AuthProvider, AuthUser } from './types'

export type { AuthProvider, AuthUser, AuthMode } from './types'

/**
 * Unified Auth Provider Component
 * Automatically selects the correct provider based on VITE_AUTH_MODE
 */
export function AuthProviderComponent({ children }: { children: ReactNode }) {
  const mode = getAuthMode()

  if (mode === 'clerk') {
    return <ClerkAuthProviderComponent>{children}</ClerkAuthProviderComponent>
  }

  return <OSSAuthProviderComponent>{children}</OSSAuthProviderComponent>
}

/**
 * Unified Auth Hook
 * Use this hook throughout your app for authentication
 * It automatically uses the correct provider based on the mode
 */
export function useAuth(): AuthProvider {
  const mode = getAuthMode()

  if (mode === 'clerk') {
    return useClerkAuthContext()
  }

  return useOSSAuth()
}

/**
 * Helper hook for common auth states
 */
export function useAuthState() {
  const auth = useAuth()

  // Don't destructure - return the auth object directly wrapped with computed values
  // This ensures we always get fresh values from the auth provider
  return {
    user: auth.getUser(),
    isAuthenticated: auth.isAuthenticated(),
    isLoading: auth.isLoading(),
    signIn: auth.signIn,
    signOut: auth.signOut,
    getToken: auth.getToken,
  }
}

// Export auth mode helper
export { getAuthMode }
