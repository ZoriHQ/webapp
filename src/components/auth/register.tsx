import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { SignUp } from '@clerk/clerk-react'
import { getAuthMode } from '@/lib/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

/**
 * Unified Register Component
 * Shows different UI based on auth mode:
 * - Clerk: Clerk's SignUp component
 * - OSS: Auto-redirects to projects (always authenticated)
 */
export function RegisterComponent() {
  const mode = getAuthMode()
  const navigate = useNavigate()

  // In OSS mode, users are always authenticated
  useEffect(() => {
    if (mode === 'oss') {
      navigate({ to: '/projects' })
    }
  }, [mode, navigate])

  if (mode === 'clerk') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <SignUp routing="path" path="/register" />
      </div>
    )
  }

  // OSS mode - show loading while redirecting
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>Redirecting to dashboard...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
