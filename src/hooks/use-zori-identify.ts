import { useEffect, useRef } from 'react'
import { useAuthState } from '@/lib/auth'

declare global {
  interface Window {
    ZoriHQ?: {
      identify: (params: {
        app_id: string
        email: string
        fullname: string
      }) => void
    }
  }
}

/**
 * Hook to identify authenticated users with ZoriHQ analytics
 * This should be called after Clerk/auth is loaded and user is authenticated
 */
export function useZoriIdentify() {
  const { user, isAuthenticated, isLoading } = useAuthState()
  const hasIdentified = useRef(false)

  useEffect(() => {
    if (isLoading) {
      return
    }

    if (!isAuthenticated || !user) {
      hasIdentified.current = false
      return
    }

    if (hasIdentified.current) {
      return
    }

    if (!window.ZoriHQ?.identify) {
      const timeout = setTimeout(() => {
        if (window.ZoriHQ?.identify) {
          window.ZoriHQ.identify({
            app_id: user.id,
            email: user.email,
            fullname: user.name,
          })
          hasIdentified.current = true
          console.log('[ZoriHQ] User identified:', user.email)
        }
      }, 500)

      return () => clearTimeout(timeout)
    }

    try {
      window.ZoriHQ.identify({
        app_id: user.id,
        email: user.email,
        fullname: user.name,
      })
      hasIdentified.current = true
      console.log('[ZoriHQ] User identified:', user.email)
    } catch (error) {
      console.error('[ZoriHQ] Failed to identify user:', error)
    }
  }, [user, isAuthenticated, isLoading])
}
