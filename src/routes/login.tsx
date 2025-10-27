import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { SignIn } from '@stackframe/react'
import { requireGuest } from '@/lib/route-guards'

const loginSearchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/login')({
  validateSearch: loginSearchSchema,

  beforeLoad: async ({ location }) => {
    await requireGuest({ location })
  },

  component: LoginPageWrapper,
})

function LoginPageWrapper() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <SignIn />
      </div>
    </div>
  )
}
