import { createFileRoute } from '@tanstack/react-router'
import { useProject } from '@/hooks/use-projects'
import { IconBrain, IconPlus } from '@tabler/icons-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute(
  '/_protected/projects/$projectId/llm-traces',
)({
  component: LLMTracesPage,
})

function LLMTracesPage() {
  const { projectId } = Route.useParams()
  const { data: projectData, isLoading: projectLoading } = useProject(projectId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">LLM Traces</h1>
          <p className="text-muted-foreground">
            Track LLM usage and expenses for {projectData?.name || 'your project'}
          </p>
        </div>
        <Button disabled>
          <IconPlus className="mr-2 h-4 w-4" />
          Configure Integration
        </Button>
      </div>

      <Card className="border-dashed">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <IconBrain className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle>LLM Traces Coming Soon</CardTitle>
          <CardDescription className="max-w-md mx-auto">
            We're building a comprehensive LLM tracking system that will help you
            monitor usage, costs, and performance of your AI integrations.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center pb-8">
          <div className="space-y-4">
            <div className="grid gap-3 text-left max-w-md mx-auto">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-primary" />
                <p className="text-sm text-muted-foreground">
                  Track token usage and API costs by customer
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-primary" />
                <p className="text-sm text-muted-foreground">
                  Analyze spending patterns across segments
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-primary" />
                <p className="text-sm text-muted-foreground">
                  Monitor model performance and latency
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-primary" />
                <p className="text-sm text-muted-foreground">
                  Set budget alerts and usage limits
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-primary" />
                <p className="text-sm text-muted-foreground">
                  View detailed request and response traces
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
