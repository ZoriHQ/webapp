import { useState } from 'react'
import { IconBrain, IconPlus } from '@tabler/icons-react'
import type Zoriapi from 'zorihq'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ConnectLLMProviderDialog } from '@/components/llm-providers/connect-provider-dialog'
import { RequestProviderCTA } from '@/components/llm-providers/request-provider-cta'

interface EmptyTracesStateProps {
  project: Zoriapi.V1.Projects.Project | undefined
}

export function EmptyTracesState({ project }: EmptyTracesStateProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <IconBrain className="h-8 w-8 text-muted-foreground" />
        </div>

        <h3 className="text-lg font-semibold mb-2">No LLM Traces Yet</h3>
        <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
          Connect your LLM provider to start tracking token usage, costs, and
          performance metrics across your AI integrations.
        </p>

        <div className="grid gap-3 text-left max-w-md mb-6">
          <div className="flex items-start gap-3">
            <div className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
            <p className="text-sm text-muted-foreground">
              Track token usage and API costs by customer
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
            <p className="text-sm text-muted-foreground">
              Analyze spending patterns across traffic sources
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
            <p className="text-sm text-muted-foreground">
              Monitor model performance and latency
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
            <p className="text-sm text-muted-foreground">
              View detailed request and response traces
            </p>
          </div>
        </div>

        <Button onClick={() => setDialogOpen(true)}>
          <IconPlus className="h-4 w-4 mr-2" />
          Configure Integration
        </Button>

        <div className="mt-6 w-full max-w-md">
          <RequestProviderCTA />
        </div>

        <ConnectLLMProviderDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          project={project}
        />
      </CardContent>
    </Card>
  )
}
