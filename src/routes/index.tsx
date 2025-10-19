import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    // Redirect root to projects
    throw redirect({
      to: '/projects',
      replace: true,
    })
  },
})
