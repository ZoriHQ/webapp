import { createFileRoute } from '@tanstack/react-router'
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react'

/**
 * SSO Callback Route for Registration
 * Clerk redirects here after OAuth authentication during sign-up
 */
export const Route = createFileRoute('/register/sso-callback')({
  component: RegisterSSOCallback,
})

function RegisterSSOCallback() {
  return <AuthenticateWithRedirectCallback />
}
