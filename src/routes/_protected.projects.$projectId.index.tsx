import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useProject } from '@/hooks/use-projects'
import {
  useVisitorsByCountry,
  useVisitorsTimeline,
  type TimeRange,
} from '@/hooks/use-analytics'
import { ProjectHeader } from '@/components/analytics/project-header'
import { EmptyEventsState } from '@/components/analytics/empty-events-state'
import { GlobeVisualization } from '@/components/overview/globe-visualization'
import { VisitorTimeline } from '@/components/overview/visitor-timeline'

export const Route = createFileRoute('/_protected/projects/$projectId/')({
  component: OverviewPage,
})

function OverviewPage() {
  const { projectId } = Route.useParams()
  const [timeRange, setTimeRange] = useState<TimeRange>('last_7_days')

  // Fetch project details
  const { data: projectData, isLoading: projectLoading } = useProject(projectId)

  // Fetch data for visualizations
  const { data: countryData, isLoading: countryLoading } = useVisitorsByCountry(
    projectId,
    timeRange,
  )
  const { data: timelineData, isLoading: timelineLoading } = useVisitorsTimeline(
    projectId,
    timeRange,
  )

  // Check if project has received any events
  const hasNoEvents = !projectData?.first_event_received_at && !projectLoading

  return (
    <>
      <ProjectHeader
        projectName={projectData?.name}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
      />

      {/* Show empty state if no events have been received */}
      {hasNoEvents ? (
        <EmptyEventsState
          projectId={projectId}
          projectName={projectData?.name}
        />
      ) : (
        <div className="space-y-6">
          {/* Globe + Timeline Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6">
            {/* Globe Visualization */}
            <GlobeVisualization
              countryData={countryData?.data}
              isLoading={countryLoading}
            />

            {/* Visitor Timeline */}
            <VisitorTimeline
              data={timelineData?.data}
              isLoading={timelineLoading}
              timeRange={timeRange}
            />
          </div>
        </div>
      )}
    </>
  )
}
