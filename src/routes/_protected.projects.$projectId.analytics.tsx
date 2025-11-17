import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useProject } from '@/hooks/use-projects'
import { ProjectHeader } from '@/components/analytics/project-header'
import { EngagementMetrics } from '@/components/analytics/engagement-metrics'
import { TopVisitorsTable } from '@/components/analytics/top-visitors-table'
import { EmptyEventsState } from '@/components/analytics/empty-events-state'
import { VisitorProfileModal } from '@/components/analytics/visitor-profile-modal'
import { VisitorTimeline } from '@/components/overview/visitor-timeline'
import { TrafficSourcesJoinedTile } from '@/components/analytics/tiles/traffic-sources.joined-tile'
import { VisitorsByBrowserTile } from '@/components/analytics/tiles/visitors-by-browser.tile'
import { VisitorsByOSTile } from '@/components/analytics/tiles/visitors-by-os.tile'

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

  const { isLoading: projectLoading } = useProject(projectId)

  const handleVisitorClick = (visitorId: string) => {
    setSelectedVisitorId(visitorId)
    setIsVisitorModalOpen(true)
  }

  return (
    <>
      <ProjectHeader />

      {/* Show empty state if no events have been received */}
      {projectLoading ? (
        <EmptyEventsState projectId={projectId} projectName={'Loading...'} />
      ) : (
        <>
          {/* Engagement Metrics Cards */}
          <div className="mb-8">
            <EngagementMetrics />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mb-8">
            <VisitorTimeline />

            <TrafficSourcesJoinedTile />
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
