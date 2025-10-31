import { createFileRoute } from '@tanstack/react-router'
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react'

/**
 * SSO Callback Route
 * Clerk redirects here after OAuth authentication
 */
export const Route = createFileRoute('/login/sso-callback')({
  component: SSOCallback,
})

function SSOCallback() {
  return <AuthenticateWithRedirectCallback />
}
