import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { RegisterComponent } from '@/components/auth/register'
import { requireGuest } from '@/lib/route-guards'

const registerSearchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/register')({
  validateSearch: registerSearchSchema,

  beforeLoad: async ({ location }) => {
    await requireGuest({ location })
  },

  component: RegisterComponent,
})
