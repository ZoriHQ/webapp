import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { LoginComponent } from '@/components/auth/login'
import { requireGuest } from '@/lib/route-guards'

const loginSearchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/login')({
  validateSearch: loginSearchSchema,

  beforeLoad: async ({ location }) => {
    await requireGuest({ location })
  },

  component: LoginComponent,
})
