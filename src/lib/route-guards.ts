import { redirect } from '@tanstack/react-router'
import { getAuthMode } from './auth'
import { ossProvider } from './auth/oss-provider'

/**
 * Route Guards for Authentication
 * Works with both Clerk and OSS modes
 */

export function requireAuth({ location }: { location: any }) {
  const mode = getAuthMode()

  // In OSS mode, check actual authentication state
  if (mode === 'oss') {
    if (!ossProvider.isAuthenticated()) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.pathname,
        },
      })
    }
    return true
  }

  // In Clerk mode, we rely on Clerk's built-in authentication
  // Clerk will automatically redirect to their sign-in page if not authenticated
  // The ClerkProvider handles this for us
  return true
}

export function requireGuest({ location }: { location: any }) {
  const mode = getAuthMode()

  // In OSS mode, check if user is authenticated
  if (mode === 'oss') {
    if (ossProvider.isAuthenticated()) {
      throw redirect({
        to: '/projects',
      })
    }
    return null
  }

  // In Clerk mode, if user is already signed in, redirect to projects
  // Clerk will handle this check
  return null
}

export function getPostLoginRedirect(search: Record<string, unknown>): string {
  const redirectPath = search.redirect as string | undefined

  if (
    redirectPath &&
    redirectPath.startsWith('/') &&
    !redirectPath.startsWith('//')
  ) {
    return redirectPath
  }

  return '/projects'
}
