'use client'

import { Loader2Icon } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useAuthState } from '@/lib/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function ProtectedPage() {
  const { user, isAuthenticated, isLoading, signOut } = useAuthState()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate({ to: '/login' })
  }

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Only render if authenticated
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Protected Dashboard</h1>
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* User Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="font-medium">Name:</span>{' '}
              <span className="text-muted-foreground">
                {user?.name || 'N/A'}
              </span>
            </div>
            <div>
              <span className="font-medium">Email:</span>{' '}
              <span className="text-muted-foreground">
                {user?.email || 'N/A'}
              </span>
            </div>
            <div>
              <span className="font-medium">User ID:</span>{' '}
              <span className="text-muted-foreground font-mono text-xs">
                {user?.id || 'N/A'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Authentication Status Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Authentication Status</CardTitle>
            <CardDescription>Current session information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">Status:</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Authenticated
              </span>
            </div>
            <div>
              <span className="font-medium">Session Info:</span>{' '}
              <span className="text-muted-foreground text-sm">
                Your session is active and tokens are being automatically
                refreshed
              </span>
            </div>
            <div className="pt-4">
              <p className="text-sm text-muted-foreground">
                This is a protected page. You can only access it when logged in.
                Try logging out and visiting this page again - you'll be
                redirected to the login page.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
