import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { SignIn } from '@clerk/clerk-react'
import { OSSLoginForm } from './oss-login-form'
import { getAuthMode, useAuthState } from '@/lib/auth'

/**
 * Unified Login Component
 * Shows different UI based on auth mode:
 * - Clerk: Clerk's SignIn component
 * - OSS: OSS login form with JWT authentication
 */
export function LoginComponent() {
  const mode = getAuthMode()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthState()

  // Redirect authenticated users to projects
  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/projects' })
    }
  }, [isAuthenticated, navigate])

  if (mode === 'clerk') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <SignIn routing="path" path="/login" />
      </div>
    )
  }

  // OSS mode - show login form
  return <OSSLoginForm />
}
