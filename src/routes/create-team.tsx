import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useUser } from '@stackframe/react'
import { z } from 'zod'
import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getPostLoginRedirect, requireAuth } from '@/lib/route-guards'

const createTeamSearchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/create-team')({
  validateSearch: createTeamSearchSchema,

  beforeLoad: async ({ location }) => {
    await requireAuth({ location })
  },

  component: CreateTeamPage,
})

function CreateTeamPage() {
  const user = useUser({ or: 'redirect', to: '/login' })
  const navigate = useNavigate()
  const search = Route.useSearch()
  const [error, setError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      teamName: '',
    },
    onSubmit: async ({ value }) => {
      if (!user) return

      try {
        setError(null)

        // Create the team
        const newTeam = await user.createTeam({
          displayName: value.teamName,
        })

        // Set it as the selected team
        await user.setSelectedTeam(newTeam)

        // Redirect to the original destination or default to /projects
        const redirectTo = getPostLoginRedirect(search)
        navigate({ to: redirectTo })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create team')
      }
    },
  })

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create a New Team</CardTitle>
          <CardDescription>
            Enter a name for your team to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
            className="space-y-4"
          >
            <form.Field
              name="teamName"
              validators={{
                onChange: ({ value }) => {
                  if (!value || value.trim().length === 0) {
                    return 'Team name is required'
                  }
                  if (value.length < 2) {
                    return 'Team name must be at least 2 characters'
                  }
                  return undefined
                },
              }}
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Team Name</Label>
                  <Input
                    id={field.name}
                    type="text"
                    placeholder="My Awesome Team"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className={
                      field.state.meta.errors.length > 0
                        ? 'border-destructive'
                        : ''
                    }
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            />

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate({ to: '/select-team' })}
              >
                Back
              </Button>
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={!canSubmit || isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Team'}
                  </Button>
                )}
              />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
