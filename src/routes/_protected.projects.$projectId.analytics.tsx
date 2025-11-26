import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useProject } from '@/hooks/use-projects'
import { ProjectHeader } from '@/components/analytics/project-header'
import { EngagementMetrics } from '@/components/analytics/engagement-metrics'
import { TopVisitorsTable } from '@/components/analytics/top-visitors-table'
import { EmptyEventsState } from '@/components/analytics/empty-events-state'
import { VisitorProfileModal } from '@/components/analytics/visitor-profile-modal'
import {
  TopPagesAndSourcesCards,
  VisitorTimelineChart,
} from '@/components/analytics/web-analytics-dashboard'
import { TrafficSourcesJoinedTile } from '@/components/analytics/tiles/traffic-sources.joined-tile'
import { VisitorsByBrowserTile } from '@/components/analytics/tiles/visitors-by-browser.tile'
import { VisitorsByOSTile } from '@/components/analytics/tiles/visitors-by-os.tile'
import { useAppContext } from '@/contexts/app.context'
import { useTopUniqueVisitorsTile } from '@/hooks/use-analytics-tiles'

export const Route = createFileRoute(
  '/_protected/projects/$projectId/analytics',
)({
  component: ProjectDetailPage,
})

function ProjectDetailPage() {
  const { projectId } = Route.useParams()
  const [selectedVisitorId, setSelectedVisitorId] = useState<string | null>(
    null,
  )
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false)

  const { data: project } = useProject(projectId)
  const { storedValues } = useAppContext()

  const tileParams = {
    project_id: projectId,
    time_range: storedValues?.timeRange || 'last_7_days',
  }

  // Check if there are any events by querying unique visitors
  const { data: visitorData, isLoading: isLoadingVisitors } =
    useTopUniqueVisitorsTile(tileParams)

  const handleVisitorClick = (visitorId: string) => {
    setSelectedVisitorId(visitorId)
    setIsVisitorModalOpen(true)
  }

  // Show empty state only if data is loaded and there are no visitors
  const hasNoEvents =
    !isLoadingVisitors && visitorData && visitorData.count === 0

  return (
    <>
      <ProjectHeader />

      {/* Show empty state only if there are no events */}
      {hasNoEvents ? (
        <EmptyEventsState
          projectId={projectId}
          projectName={project?.name || 'Your project'}
        />
      ) : (
        <>
          {/* Engagement Metrics Cards */}
          <div className="mb-8">
            <EngagementMetrics />
          </div>

          {/* Visitor Timeline Chart + Traffic Sources (2fr/1fr layout) */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mb-8">
            <VisitorTimelineChart />
            <TrafficSourcesJoinedTile />
          </div>

          {/* Top Pages and Sources */}
          <div className="mb-8">
            <TopPagesAndSourcesCards />
          </div>

          {/* Browser and OS Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <VisitorsByBrowserTile />
            <VisitorsByOSTile />
          </div>

          <div className="mb-8">
            <TopVisitorsTable onVisitorClick={handleVisitorClick} />
          </div>
        </>
      )}

      <VisitorProfileModal
        projectId={projectId}
        visitorId={selectedVisitorId}
        open={isVisitorModalOpen}
        onOpenChange={setIsVisitorModalOpen}
      />
    </>
  )
}
