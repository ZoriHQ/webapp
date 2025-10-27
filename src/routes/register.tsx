import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { SignUp } from '@stackframe/react'
import { requireGuest } from '@/lib/route-guards'

const registerSearchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/register')({
  validateSearch: registerSearchSchema,

  beforeLoad: async ({ location }) => {
    await requireGuest({ location })
  },

  component: RegisterPageWrapper,
})

function RegisterPageWrapper() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <SignUp />
      </div>
    </div>
  )
}
