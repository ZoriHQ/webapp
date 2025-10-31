import { createContext, useContext, useMemo } from 'react'
import {
  ClerkProvider,
  SignIn,
  SignUp,
  useClerk,
  useAuth as useClerkAuth,
  useUser,
} from '@clerk/clerk-react'
import type { ReactNode } from 'react'
import type { AuthProvider, AuthUser } from './types'

/**
 * Clerk Auth Provider
 * Full-featured authentication provider for cloud deployments
 * Wraps Clerk's authentication system
 */

// Clerk configuration
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!CLERK_PUBLISHABLE_KEY && import.meta.env.VITE_AUTH_MODE === 'clerk') {
  throw new Error(
    'Missing VITE_CLERK_PUBLISHABLE_KEY environment variable. Please add it to your .env file.',
  )
}

/**
 * Hook-based Clerk Auth Provider
 * This must be used within a ClerkProvider
 */
function useClerkAuthProvider(): AuthProvider {
  const { user, isLoaded } = useUser()
  const { isSignedIn, getToken: clerkGetToken } = useClerkAuth()
  const { signOut: clerkSignOut } = useClerk()

  // Use useMemo to create a stable reference that updates when Clerk state changes
  return useMemo(() => {
    const getUser = (): AuthUser | null => {
      if (!isLoaded || !user) return null

      return {
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress || '',
        name: user.fullName || user.username || 'User',
        avatar: user.imageUrl,
      }
    }

    const isAuthenticated = (): boolean => {
      return !!(isLoaded && isSignedIn)
    }

    const isLoadingFn = (): boolean => {
      return !isLoaded
    }

    const signIn = async (_email: string, _password: string): Promise<void> => {
      // Clerk handles sign-in through their UI components
      // This method is for compatibility with the AuthProvider interface
      throw new Error('Please use Clerk SignIn component for authentication')
    }

    const signUp = async (
      _email: string,
      _password: string,
      _name: string,
    ): Promise<void> => {
      // Clerk handles sign-up through their UI components
      // This method is for compatibility with the AuthProvider interface
      throw new Error('Please use Clerk SignUp component for registration')
    }

    const signOut = async (): Promise<void> => {
      await clerkSignOut()
    }

    const getToken = async (): Promise<string | null> => {
      if (!isLoaded || !isSignedIn) return null

      try {
        // Get the session token from Clerk using the auth hook
        // This is more reliable than user.getToken()
        const token = await clerkGetToken()
        return token
      } catch (error) {
        console.error('Failed to get Clerk session token:', error)
        return null
      }
    }

    return {
      getUser,
      isAuthenticated,
      isLoading: isLoadingFn,
      signIn,
      signUp,
      signOut,
      getToken,
    }
  }, [user, isLoaded, isSignedIn, clerkGetToken, clerkSignOut])
}

// Context for Clerk auth provider
const ClerkAuthContext = createContext<AuthProvider | null>(null)

/**
 * Internal component that provides auth context using Clerk hooks
 */
function ClerkAuthContextProvider({ children }: { children: ReactNode }) {
  const authProvider = useClerkAuthProvider()

  return (
    <ClerkAuthContext.Provider value={authProvider}>
      {children}
    </ClerkAuthContext.Provider>
  )
}

/**
 * Main Clerk Auth Provider Component
 * Wraps the app with ClerkProvider and auth context
 */
export function ClerkAuthProviderComponent({
  children,
}: {
  children: ReactNode
}) {
  if (!CLERK_PUBLISHABLE_KEY) {
    throw new Error('Clerk publishable key is required for Clerk mode')
  }

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <ClerkAuthContextProvider>{children}</ClerkAuthContextProvider>
    </ClerkProvider>
  )
}

/**
 * Hook to use Clerk auth provider
 */
export function useClerkAuthContext(): AuthProvider {
  const context = useContext(ClerkAuthContext)
  if (!context) {
    throw new Error(
      'useClerkAuthContext must be used within ClerkAuthProviderComponent',
    )
  }

  return context
}

// Export Clerk components for use in routes
export { SignIn as ClerkSignIn, SignUp as ClerkSignUp }
