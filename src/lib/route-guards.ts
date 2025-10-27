import { redirect } from '@tanstack/react-router'
import { stackClientApp } from './stack-client'

export async function requireAuth({ location }: { location: any }) {
  // Wait for Stack to be ready
  const user = await stackClientApp.getUser({ or: 'redirect', to: '/login' })

  if (!user) {
    // Store the attempted location for redirecting after login
    const redirectTo = location.href
    throw redirect({
      to: '/login',
      search: {
        redirect: redirectTo,
      },
    })
  }

  return user
}

export async function requireGuest({ location }: { location: any }) {
  const user = await stackClientApp.getUser({ or: 'return-null' })

  if (user) {
    throw redirect({
      to: '/projects',
    })
  }

  return null
}

export async function optionalAuth() {
  const user = await stackClientApp.getUser({ or: 'return-null' })
  return user
}

export async function requireRole(role: string) {
  const user = await stackClientApp.getUser({ or: 'redirect', to: '/login' })

  if (!user) {
    throw redirect({
      to: '/login',
    })
  }

  // Stack Auth stores roles differently - adjust based on your setup
  const userRole = (user as any)?.clientMetadata?.role

  if (userRole !== role) {
    throw redirect({
      to: '/login',
      statusCode: 403,
    })
  }

  return user
}

export async function requireOrganization() {
  const user = await stackClientApp.getUser({ or: 'redirect', to: '/login' })

  if (!user) {
    throw redirect({
      to: '/login',
    })
  }

  return user
}

export async function requireAuthAndOrg({ location }: { location: any }) {
  const user = await stackClientApp.getUser({ or: 'redirect', to: '/login' })

  if (!user) {
    const redirectTo = location.href
    throw redirect({
      to: '/login',
      search: {
        redirect: redirectTo,
      },
    })
  }

  // Check if user has a selected team (organization context)
  if (!user.selectedTeam) {
    // Redirect to team selection page if no team is selected
    const redirectTo = location.href
    throw redirect({
      to: '/select-team',
      search: {
        redirect: redirectTo,
      },
    })
  }

  return user
}

export function getPostLoginRedirect(search: Record<string, any>): string {
  // eslint-disable-next-line
  const redirect = search?.redirect as string

  if (redirect && redirect.startsWith('/') && !redirect.startsWith('//')) {
    return redirect
  }

  return '/projects'
}
