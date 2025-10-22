import { createFileRoute } from '@tanstack/react-router'
import { useProject } from '@/hooks/use-projects'
import { IconTarget, IconPlus } from '@tabler/icons-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_protected/projects/$projectId/goals')({
  component: GoalsPage,
})

function GoalsPage() {
  const { projectId } = Route.useParams()
  const { data: projectData, isLoading: projectLoading } = useProject(projectId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Goals</h1>
          <p className="text-muted-foreground">
            Set and track custom goals for {projectData?.name || 'your project'}
          </p>
        </div>
        <Button disabled>
          <IconPlus className="mr-2 h-4 w-4" />
          Create Goal
        </Button>
      </div>

      <Card className="border-dashed">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <IconTarget className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle>Goals Coming Soon</CardTitle>
          <CardDescription className="max-w-md mx-auto">
            We're building a powerful goal tracking system that will help you set
            and monitor custom conversion goals based on your events.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center pb-8">
          <div className="space-y-4">
            <div className="grid gap-3 text-left max-w-md mx-auto">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-primary" />
                <p className="text-sm text-muted-foreground">
                  Define custom conversion events
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-primary" />
                <p className="text-sm text-muted-foreground">
                  Track goal completion rates and trends
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-primary" />
                <p className="text-sm text-muted-foreground">
                  Set target values and monitor progress
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-primary" />
                <p className="text-sm text-muted-foreground">
                  Get insights on goal performance by source
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
