/**
 * Global unauthorized error handler
 * Handles 401 responses by clearing auth state and redirecting to login
 * Only applies to OSS mode
 */

import { getAuthMode } from './types'

/**
 * Handle unauthorized (401) error
 * Clears auth tokens and redirects to login page
 */
export function handleUnauthorized(): void {
  const mode = getAuthMode()

  // Only handle 401s in OSS mode
  // In Clerk mode, Clerk handles this automatically
  if (mode !== 'oss') {
    return
  }

  // Clear auth tokens from localStorage
  localStorage.removeItem('oss_auth_token')
  localStorage.removeItem('oss_auth_user')

  // Redirect to login page
  // Use window.location to force a full page reload and clear app state
  const currentPath = window.location.pathname
  if (currentPath !== '/login') {
    window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`
  }
}

/**
 * Check if an error is a 401 unauthorized error
 */
export function isUnauthorizedError(error: unknown): boolean {
  if (!error) return false

  // Check for Response object (from fetch)
  if (error instanceof Response) {
    return error.status === 401
  }

  // Check for error object with status property
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (error !== null && typeof error === 'object' && 'status' in error) {
    return (error as { status: number }).status === 401
  }

  // Check for error message containing 401
  if (error instanceof Error) {
    return (
      error.message.includes('401') || error.message.includes('Unauthorized')
    )
  }

  return false
}
