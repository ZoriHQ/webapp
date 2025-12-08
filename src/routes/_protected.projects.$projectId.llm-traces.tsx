import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { IconSettings } from '@tabler/icons-react'
import type {LlmTimeRange} from '@/hooks/use-llm-traces';
import { useProject } from '@/hooks/use-projects'
import { useAppContext } from '@/contexts/app.context'
import {
  
  useLlmCostTile,
  useLlmTopModelsCostTile,
  useLlmTraces
} from '@/hooks/use-llm-traces'
import { ProjectHeader } from '@/components/analytics/project-header'
import { EmptyTracesState } from '@/components/llm-traces/empty-traces-state'
import { LlmMetricsCards } from '@/components/llm-traces/llm-metrics-cards'
import { LlmTracesTable } from '@/components/llm-traces/llm-traces-table'
import { LlmTopModels } from '@/components/llm-traces/llm-top-models'
import { ConnectLLMProviderDialog } from '@/components/llm-providers/connect-provider-dialog'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute(
  '/_protected/projects/$projectId/llm-traces',
)({
  component: LLMTracesPage,
})

function LLMTracesPage() {
  const { projectId } = Route.useParams()
  const { storedValues } = useAppContext()
  const { data: project, isLoading: projectLoading } = useProject(projectId)
  const [configDialogOpen, setConfigDialogOpen] = useState(false)

  const timeRange = (storedValues?.timeRange || 'last_7_days') as LlmTimeRange

  const tileParams = {
    project_id: projectId,
    time_range: timeRange,
  }

  // Fetch LLM data
  const { data: tracesData, isLoading: tracesLoading } = useLlmTraces({
    ...tileParams,
    limit: 50,
  })

  const { data: costData, isLoading: costLoading } = useLlmCostTile(tileParams)

  const { data: topModelsData, isLoading: topModelsLoading } =
    useLlmTopModelsCostTile(tileParams)

  // Check if we have any traces
  const hasTraces = (tracesData?.total ?? 0) > 0
  const isLoadingInitial = projectLoading || tracesLoading

  // Show empty state when no traces and not loading
  if (!isLoadingInitial && !hasTraces) {
    return (
      <>
        <ProjectHeader />
        <EmptyTracesState project={project} />
      </>
    )
  }

  return (
    <>
      <ProjectHeader />

      {/* Integration Settings Button */}
      <div className="flex justify-end mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setConfigDialogOpen(true)}
        >
          <IconSettings className="h-4 w-4 mr-2" />
          Integration Settings
        </Button>
      </div>

      {/* Summary Metrics */}
      <div className="mb-8">
        <LlmMetricsCards
          costData={costData}
          tracesData={tracesData}
          isLoadingCost={costLoading}
          isLoadingTraces={tracesLoading}
        />
      </div>

      {/* Top Models by Cost */}
      <div className="mb-8">
        <LlmTopModels data={topModelsData} isLoading={topModelsLoading} />
      </div>

      {/* Traces Table */}
      <div className="mb-8">
        <LlmTracesTable data={tracesData} isLoading={tracesLoading} />
      </div>

      <ConnectLLMProviderDialog
        open={configDialogOpen}
        onOpenChange={setConfigDialogOpen}
        project={project}
      />
    </>
  )
}
