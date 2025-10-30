import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useUser } from '@stackframe/react'
import { z } from 'zod'
import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getPostLoginRedirect, requireAuth } from '@/lib/route-guards'

const selectTeamSearchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/select-team')({
  validateSearch: selectTeamSearchSchema,

  beforeLoad: async ({ location }) => {
    await requireAuth({ location })
  },

  component: SelectTeamPage,
})

function SelectTeamPage() {
  const user = useUser({ or: 'redirect', to: '/login' })
  const navigate = useNavigate()
  const search = Route.useSearch()
  const [loading, setLoading] = useState(false)

  const teams = user?.useTeams() || []

  const handleSelectTeam = async (teamId: string) => {
    if (!user) return

    setLoading(true)
    try {
      const selectedTeam = teams.find((t) => t.id === teamId)
      if (selectedTeam) {
        await user.setSelectedTeam(selectedTeam)

        // Redirect to the original destination or default to /projects
        const redirectTo = getPostLoginRedirect(search)
        navigate({ to: redirectTo })
      }
    } catch (error) {
      console.error('Failed to select team:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTeam = () => {
    navigate({ to: '/create-team', search: { redirect: search.redirect } })
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Select Your Team</CardTitle>
          <CardDescription>
            Choose a team to continue, or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {teams.length > 0 ? (
            <div className="space-y-2">
              {teams.map((team) => (
                <Button
                  key={team.id}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleSelectTeam(team.id)}
                  disabled={loading}
                >
                  <div className="flex items-center gap-3">
                    {team.profileImageUrl && (
                      <img
                        src={team.profileImageUrl}
                        alt={team.displayName}
                        className="h-8 w-8 rounded"
                      />
                    )}
                    <div className="text-left">
                      <div className="font-medium">{team.displayName}</div>
                      {/* Add any additional team info here */}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <p className="mb-4">You're not a member of any teams yet.</p>
            </div>
          )}

          <div className="pt-4 border-t">
            <Button
              className="w-full"
              onClick={handleCreateTeam}
              disabled={loading}
            >
              Create New Team
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
